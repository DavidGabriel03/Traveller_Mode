require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Sequelize } = require('sequelize');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  { host: process.env.DB_HOST, dialect: 'mysql', logging: false }
);

const City = require('./models/City');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function updateCity(city) {
  const prompt = `
    Ești un expert în turism european. Evaluează orașul ${city.name} din ${city.country} 
    pe o scară de la 1 la 5 pentru următoarele criterii, bazat pe informații actuale:
    - tourism_rating: atractivitate turistică
    - safety_rating: siguranța orașului
    - economy_rating: nivelul economic
    
    Răspunde DOAR cu un JSON valid, fără text suplimentar:
    {"tourism_rating": X.X, "safety_rating": X.X, "economy_rating": X.X}
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const clean = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(clean);

    const livability = ((data.tourism_rating + data.safety_rating + data.economy_rating) / 3).toFixed(2);

    await city.update({
      tourism_rating: data.tourism_rating,
      safety_rating: data.safety_rating,
      economy_rating: data.economy_rating,
      livability_score: livability
    });

    console.log(`✅ ${city.name}: turism=${data.tourism_rating}, siguranță=${data.safety_rating}, economie=${data.economy_rating}`);
  } catch (err) {
    console.error(`❌ Eroare la ${city.name}:`, err.message);
  }
}

async function main() {
  await sequelize.authenticate();
  console.log('🚀 Start actualizare orașe...');

  const cities = await City.findAll();

  for (const city of cities) {
    await updateCity(city);
    await sleep(5000); // 5 secunde între requesturi să nu depășim limita
  }

  console.log('✅ Actualizare completă!');
  process.exit(0);
}

main();