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
  // Fallback if env file doesn't parse correctly
  mongodbUri = 'mongodb+srv://AmiraBeautifulCare:S4Epscw0SOkd5ZtG@cluster0.e5n1hnl.mongodb.net/AmiraBeautifulCare';
}

console.log('Connecting to MongoDB...');

const BannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String },
    primaryBtnText: { type: String },
    primaryBtnLink: { type: String },
    secondaryBtnText: { type: String },
    secondaryBtnLink: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Banner = mongoose.models.Banner || mongoose.model('Banner', BannerSchema);

const banners = [
  {
    title: 'Bridal Special Collection',
    image: '/assets/images/Banner/bridal-special-collection-banner.webp',
    link: '/shop',
    primaryBtnText: 'SHOP',
    primaryBtnLink: '/shop',
    secondaryBtnText: 'CONTACT',
    secondaryBtnLink: 'https://wa.me/8801635093334',
    order: 1,
    isActive: true,
  },
  {
    title: 'Cosmetics & Makeup',
    image: '/assets/images/Banner/cosmetics-makeup-banner.webp',
    link: '/shop',
    primaryBtnText: 'SHOP',
    primaryBtnLink: '/shop',
    secondaryBtnText: 'CONTACT',
    secondaryBtnLink: 'https://wa.me/8801635093334',
    order: 2,
    isActive: true,
  },
  {
    title: 'Jewelry Collection',
    image: '/assets/images/Banner/jewelry-collection-banner.webp',
    link: '/shop',
    primaryBtnText: 'SHOP',
    primaryBtnLink: '/shop',
    secondaryBtnText: 'CONTACT',
    secondaryBtnLink: 'https://wa.me/8801635093334',
    order: 3,
    isActive: true,
  },
  {
    title: 'Natural Skincare',
    image: '/assets/images/Banner/natural-skincare-banner.webp',
    link: '/shop',
    primaryBtnText: 'SHOP',
    primaryBtnLink: '/shop',
    secondaryBtnText: 'CONTACT',
    secondaryBtnLink: 'https://wa.me/8801635093334',
    order: 4,
    isActive: true,
  },
  {
    title: 'Amira Beautiful Care Exclusive Signature',
    image: '/assets/images/Banner/texjen-exclusive-signature-banner.webp',
    link: '/shop',
    primaryBtnText: 'SHOP',
    primaryBtnLink: '/shop',
    secondaryBtnText: 'CONTACT',
    secondaryBtnLink: 'https://wa.me/8801635093334',
    order: 5,
    isActive: true,
  }
];

async function seed() {
  try {
    await mongoose.connect(mongodbUri);
    console.log('Connected to MongoDB successfully.');

    // Clear existing banners
    const deleteResult = await Banner.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing banners.`);

    // Insert new banners
    const insertResult = await Banner.insertMany(banners);
    console.log(`Seeded ${insertResult.length} banners successfully:`);
    insertResult.forEach((b, i) => {
      console.log(`[Banner ${i + 1}] Title: "${b.title}", Image: "${b.image}"`);
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
