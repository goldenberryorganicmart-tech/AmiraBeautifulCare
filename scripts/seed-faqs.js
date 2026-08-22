const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read .env.local file to get MONGODB_URI
const envPath = path.join(__dirname, '../.env.local');
let mongodbUri = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/^MONGODB_URI=(.*)$/m);
  if (match && match[1]) {
    mongodbUri = match[1].trim().replace(/['"]/g, '');
  }
}

if (!mongodbUri) {
  mongodbUri = 'mongodb+srv://AmiraBeautifulCare:xI2QuBaFZsYQ5vRD@cluster0.e5n1hnl.mongodb.net/AmiraBeautifulCare';
}

console.log('Connecting to MongoDB...');

const FAQSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const FAQ = mongoose.models.FAQ || mongoose.model('FAQ', FAQSchema);

const faqs = [
  {
    question: 'Are your beauty and cosmetic products authentic?',
    answer: 'Yes, all our products are 100% authentic. We source them directly from authorized distributors and the original brands to ensure you receive genuine and high-quality products.',
    order: 1,
    isActive: true,
  },
  {
    question: 'What is your return or exchange policy for cosmetics?',
    answer: 'Due to hygiene and safety reasons, we cannot accept returns or exchanges on opened or used skincare and cosmetic products. If you receive a damaged or incorrect item, please contact us within 24 hours of delivery for a replacement.',
    order: 2,
    isActive: true,
  },
  {
    question: 'What are the shipping charges and delivery times?',
    answer: 'Delivery within Dhaka takes 24 to 48 hours with a shipping fee of 60 BDT. For locations outside Dhaka, shipping is 120 BDT and delivery takes 3 to 5 business days.',
    order: 3,
    isActive: true,
  },
  {
    question: 'How can I find the right makeup shade for my skin tone?',
    answer: 'We provide detailed shade descriptions and swatches on our product pages. If you need personalized assistance, our customer support team is always happy to help you find your perfect match.',
    order: 4,
    isActive: true,
  },
  {
    question: 'Do you offer organic or cruelty-free products?',
    answer: 'Yes, we have a curated selection of organic, vegan, and cruelty-free beauty products. You can check the product descriptions for specific certifications and ingredient lists.',
    order: 5,
    isActive: true,
  }
];

async function seed() {
  try {
    await mongoose.connect(mongodbUri);
    console.log('Connected to MongoDB successfully.');

    // Clear existing FAQs
    const deleteResult = await FAQ.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing FAQs.`);

    // Insert new FAQs
    const insertResult = await FAQ.insertMany(faqs);
    console.log(`Seeded ${insertResult.length} FAQs successfully:`);
    insertResult.forEach((f, i) => {
      console.log(`[FAQ ${i + 1}] Question: "${f.question}"`);
    });

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seed();
