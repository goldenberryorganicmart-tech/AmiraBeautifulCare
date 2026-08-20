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

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
});
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  purchasePrice: { type: Number },
  discountRate: { type: Number },
  sku: { type: String, required: true, unique: true },
  stock: { type: Number, required: true, default: 0 },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  tags: [{ type: String }],
  images: [{ type: String }],
  attributes: [
    {
      key: { type: String },
      value: { type: String },
    },
  ],
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isFlashSale: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const baseProducts = [
  // 1. Makeup
  {
    name: 'Luxury Matte Lipstick',
    slug: 'luxury-matte-lipstick',
    sku: 'MK-LIP-001',
    price: 1850,
    purchasePrice: 1200,
    stock: 50,
    images: ['/assets/images/products/luxury-matte-lipstick.webp'],
    categorySlug: 'makeup',
    description: 'A premium velvet matte red lipstick that offers long-lasting color and intense hydration with metallic container packaging.',
    tags: ['makeup', 'lipstick', 'matte', 'beauty']
  },
  {
    name: 'Longwear Liquid Foundation',
    slug: 'longwear-liquid-foundation',
    sku: 'MK-FND-002',
    price: 2450,
    purchasePrice: 1600,
    stock: 45,
    images: ['/assets/images/products/longwear-liquid-foundation.webp'],
    categorySlug: 'makeup',
    description: 'Flawless frosted glass foundation bottle featuring high coverage with natural finish and longwear protection.',
    tags: ['foundation', 'makeup', 'liquid', 'face']
  },
  {
    name: 'Waterproof Volume Mascara',
    slug: 'waterproof-volume-mascara',
    sku: 'MK-MAS-003',
    price: 1450,
    purchasePrice: 950,
    stock: 60,
    images: ['/assets/images/products/waterproof-volume-mascara.webp'],
    categorySlug: 'makeup',
    description: 'Get thick and long eyelashes with our waterproof volume mascara featuring a special gold metallic container.',
    tags: ['mascara', 'waterproof', 'makeup', 'eyes']
  },

  // 2. Skincare
  {
    name: 'Hyaluronic Acid Serum',
    slug: 'hyaluronic-acid-serum',
    sku: 'SC-HYA-004',
    price: 1950,
    purchasePrice: 1300,
    stock: 80,
    images: ['/assets/images/products/hyaluronic-acid-serum.webp'],
    categorySlug: 'skincare',
    description: 'Rehydrate your skin with our premium organic Hyaluronic Acid Serum dropper bottle, restoring moisture barrier.',
    tags: ['serum', 'skincare', 'hyaluronic', 'hydration']
  },
  {
    name: 'Hydrating Gel Moisturizer',
    slug: 'hydrating-gel-moisturizer',
    sku: 'SC-MOI-005',
    price: 1650,
    purchasePrice: 1100,
    stock: 75,
    images: ['/assets/images/products/hydrating-gel-moisturizer.webp'],
    categorySlug: 'skincare',
    description: 'Extremely lightweight gel moisturizer that locks in moisture for 24 hours, perfect for sensitive skin.',
    tags: ['moisturizer', 'gel', 'skincare', 'hydrating']
  },
  {
    name: 'Gentle Foaming Cleanser',
    slug: 'gentle-foaming-cleanser',
    sku: 'SC-CLN-006',
    price: 1250,
    purchasePrice: 800,
    stock: 90,
    images: ['/assets/images/products/gentle-foaming-cleanser.webp'],
    categorySlug: 'skincare',
    description: 'A gentle wash that removes impurities and makeup residue without stripping away essential natural skin moisture.',
    tags: ['cleanser', 'skincare', 'foaming', 'wash']
  },

  // 3. Hair Care
  {
    name: 'Nourishing Argan Hair Oil',
    slug: 'nourishing-argan-hair-oil',
    sku: 'HC-OIL-007',
    price: 1750,
    purchasePrice: 1150,
    stock: 65,
    images: ['/assets/images/products/nourishing-argan-hair-oil.webp'],
    categorySlug: 'hair-care',
    description: 'Enriched with authentic Moroccan Argan oil to repair dry hair, eliminate frizz and add a dazzling shine.',
    tags: ['hair oil', 'argan', 'haircare', 'nourishing']
  },
  {
    name: 'Repairing Keratin Shampoo',
    slug: 'repairing-keratin-shampoo',
    sku: 'HC-SHA-008',
    price: 1350,
    purchasePrice: 900,
    stock: 70,
    images: ['/assets/images/products/repairing-keratin-shampoo.webp'],
    categorySlug: 'hair-care',
    description: 'Cleanses and fortifies damaged hair structure from root to tip using specialized Keratin protein complex.',
    tags: ['shampoo', 'keratin', 'haircare', 'repair']
  },
  {
    name: 'Hydrating Coconut Hair Mask',
    slug: 'hydrating-coconut-hair-mask',
    sku: 'HC-MSK-009',
    price: 1550,
    purchasePrice: 1050,
    stock: 55,
    images: ['/assets/images/products/hydrating-coconut-hair-mask.webp'],
    categorySlug: 'hair-care',
    description: 'Deep conditioning treatment to restore moisture to damaged hair using pure coconut oil extracts.',
    tags: ['mask', 'coconut', 'haircare', 'hydration']
  },

  // 4. Fragrance & Perfume
  {
    name: 'Luxury Floral Eau de Parfum',
    slug: 'luxury-floral-perfume',
    sku: 'FP-FLO-010',
    price: 4500,
    purchasePrice: 3000,
    stock: 30,
    images: ['/assets/images/products/luxury-floral-perfume.webp'],
    categorySlug: 'fragrance-perfume',
    description: 'A magical floral blend featuring notes of rose, jasmine, and vanilla. Encased in a beautiful glass bottle.',
    tags: ['perfume', 'fragrance', 'floral', 'luxury']
  },
  {
    name: 'Classic Woody Oud Cologne',
    slug: 'classic-woody-oud',
    sku: 'FP-OUD-011',
    price: 5200,
    purchasePrice: 3500,
    stock: 25,
    images: ['/assets/images/products/classic-woody-oud.webp'],
    categorySlug: 'fragrance-perfume',
    description: 'A rich, mysterious woody fragrance featuring premium oud extracts and warm cedar notes.',
    tags: ['cologne', 'fragrance', 'oud', 'woody']
  },
  {
    name: 'Fresh Citrus Unisex Perfume',
    slug: 'fresh-citrus-perfume',
    sku: 'FP-CTR-012',
    price: 3800,
    purchasePrice: 2500,
    stock: 35,
    images: ['/assets/images/products/fresh-citrus-perfume.webp'],
    categorySlug: 'fragrance-perfume',
    description: 'Bright citrus blend with lemon, bergamot, and fresh orange highlights, perfect for everyday wear.',
    tags: ['perfume', 'unisex', 'citrus', 'fresh']
  },

  // 5. Beauty & Personal Care
  {
    name: 'Shea Butter Body Lotion',
    slug: 'shea-butter-body-lotion',
    sku: 'PC-LOT-013',
    price: 1200,
    purchasePrice: 800,
    stock: 80,
    images: ['/assets/images/products/shea-butter-body-lotion.webp'],
    categorySlug: 'beauty-personal-care',
    description: 'Ultra-moisturizing body lotion packed with raw African shea butter for silky smooth skin texture.',
    tags: ['body lotion', 'shea butter', 'personal care', 'moisturizing']
  },
  {
    name: 'Refreshing Aloe Vera Gel',
    slug: 'refreshing-aloe-vera-gel',
    sku: 'PC-ALO-014',
    price: 850,
    purchasePrice: 550,
    stock: 100,
    images: ['/assets/images/products/refreshing-aloe-vera-gel.webp'],
    categorySlug: 'beauty-personal-care',
    description: 'Multi-use soothing gel formulated with pure organic Aloe Vera to refresh sun-exposed skin.',
    tags: ['aloe vera', 'gel', 'personal care', 'soothing']
  },
  {
    name: 'Lavender Infused Bath Salts',
    slug: 'lavender-bath-salts',
    sku: 'PC-SAL-015',
    price: 950,
    purchasePrice: 650,
    stock: 60,
    images: ['/assets/images/products/lavender-bath-salts.webp'],
    categorySlug: 'beauty-personal-care',
    description: 'Relax your body and mind with our lavender-scented therapeutic bath salts, perfect for stress relief.',
    tags: ['bath salts', 'lavender', 'spa', 'relaxation']
  },

  // 6. Beauty Accessories
  {
    name: 'Rose Quartz Gua Sha & Roller Set',
    slug: 'rose-quartz-roller-set',
    sku: 'AC-ROL-016',
    price: 1950,
    purchasePrice: 1200,
    stock: 40,
    images: ['/assets/images/products/rose-quartz-roller-set.webp'],
    categorySlug: 'beauty-accessories',
    description: 'Sculpt and massage your face using our premium rose quartz gua sha tool and roller set.',
    tags: ['gua sha', 'face roller', 'accessories', 'beauty tools']
  },
  {
    name: 'Professional Makeup Brush Set (12pcs)',
    slug: 'makeup-brush-set',
    sku: 'AC-BRS-017',
    price: 2800,
    purchasePrice: 1800,
    stock: 30,
    images: ['/assets/images/products/makeup-brush-set.webp'],
    categorySlug: 'beauty-accessories',
    description: 'Full set of 12 professional synthetic brushes for foundation, eyeshadow, blending, and more.',
    tags: ['brush set', 'makeup tools', 'accessories']
  },
  {
    name: 'Premium Silk Sleep Mask',
    slug: 'premium-silk-sleep-mask',
    sku: 'AC-MSK-018',
    price: 1100,
    purchasePrice: 700,
    stock: 50,
    images: ['/assets/images/products/premium-silk-sleep-mask.webp'],
    categorySlug: 'beauty-accessories',
    description: 'Block out light and protect your skin with our ultra-soft 100% mulberry silk sleep mask.',
    tags: ['sleep mask', 'silk', 'accessories', 'night']
  },

  // 7. Nail Care
  {
    name: 'Long-Lasting Gel Nail Polish (Pastel Pink)',
    slug: 'gel-nail-polish-pink',
    sku: 'NC-POL-019',
    price: 650,
    purchasePrice: 400,
    stock: 120,
    images: ['/assets/images/products/gel-nail-polish-pink.webp'],
    categorySlug: 'nail-care',
    description: 'High-shine, chip-resistant pastel pink gel nail polish that stays vibrant for weeks.',
    tags: ['nail polish', 'gel', 'nail care', 'pink']
  },
  {
    name: 'Nourishing Cuticle Oil Pen',
    slug: 'cuticle-oil-pen',
    sku: 'NC-OIL-020',
    price: 450,
    purchasePrice: 280,
    stock: 150,
    images: ['/assets/images/products/cuticle-oil-pen.webp'],
    categorySlug: 'nail-care',
    description: 'Travel-friendly cuticle oil pen packed with jojoba and vitamin E to nourish dry nails.',
    tags: ['cuticle oil', 'nail care', 'oil pen']
  },
  {
    name: 'Professional UV Nail Lamp',
    slug: 'uv-nail-lamp',
    sku: 'NC-LMP-021',
    price: 2400,
    purchasePrice: 1600,
    stock: 25,
    images: ['/assets/images/products/uv-nail-lamp.webp'],
    categorySlug: 'nail-care',
    description: 'Fast drying professional UV LED nail lamp with automated timer for flawless gel nails at home.',
    tags: ['nail lamp', 'uv lamp', 'nail care', 'salon']
  },

  // 8. New Arrivals
  {
    name: 'Glow-Boosting Vitamin C Essence',
    slug: 'vitamin-c-essence',
    sku: 'NA-VIT-022',
    price: 1850,
    purchasePrice: 1250,
    stock: 65,
    images: ['/assets/images/products/vitamin-c-essence.webp'],
    categorySlug: 'new-arrivals',
    description: 'Brighten dark spots and boost natural collagen with our new fast-absorbing Vitamin C essence.',
    tags: ['vitamin c', 'essence', 'skincare', 'new arrival']
  },
  {
    name: 'Velvet Lip Clay Trio',
    slug: 'velvet-lip-clay-trio',
    sku: 'NA-LIP-023',
    price: 2200,
    purchasePrice: 1450,
    stock: 40,
    images: ['/assets/images/products/velvet-lip-clay-trio.webp'],
    categorySlug: 'new-arrivals',
    description: 'A bundle of three stunning velvet lip clays offering rich pigment in soft rose and terracotta colors.',
    tags: ['lipstick', 'lip clay', 'makeup', 'new arrival']
  },
  {
    name: 'Botanical Repair Hair Serum',
    slug: 'botanical-repair-hair-serum',
    sku: 'NA-SRM-024',
    price: 1950,
    purchasePrice: 1300,
    stock: 55,
    images: ['/assets/images/products/botanical-repair-hair-serum.webp'],
    categorySlug: 'new-arrivals',
    description: 'Strengthen and repair damaged hair cuticle layers using plant-based advanced botanical hair serum.',
    tags: ['hair serum', 'botanical', 'haircare', 'new arrival']
  },

  // 9. Best Sellers
  {
    name: 'Advanced Night Repair Ampoule',
    slug: 'advanced-night-repair-ampoule',
    sku: 'BS-AMP-025',
    price: 3200,
    purchasePrice: 2100,
    stock: 50,
    images: ['/assets/images/products/advanced-night-repair-ampoule.webp'],
    categorySlug: 'best-sellers',
    description: 'Our top-rated night serum that repairs fine lines and uneven tone overnight. Wake up to glowing skin.',
    tags: ['night repair', 'serum', 'skincare', 'best seller']
  },
  {
    name: 'Pore-Tightening Clay Mask',
    slug: 'pore-tightening-clay-mask',
    sku: 'BS-MSK-026',
    price: 1400,
    purchasePrice: 900,
    stock: 85,
    images: ['/assets/images/products/pore-tightening-clay-mask.webp'],
    categorySlug: 'best-sellers',
    description: 'Formulated with bentonite clay to extract oil, clear impurities and minimize large pores.',
    tags: ['clay mask', 'pore care', 'skincare', 'best seller']
  },
  {
    name: 'Matte Finish Setting Spray',
    slug: 'matte-finish-setting-spray',
    sku: 'BS-SPR-027',
    price: 1250,
    purchasePrice: 800,
    stock: 95,
    images: ['/assets/images/products/matte-finish-setting-spray.webp'],
    categorySlug: 'best-sellers',
    description: 'Keep your makeup locked in place all day with a beautiful, weightless matte finish setting spray.',
    tags: ['setting spray', 'makeup', 'matte', 'best seller']
  },

  // 10. Special Offers
  {
    name: 'Ultimate 7-Day Skincare Kit',
    slug: 'ultimate-skincare-kit',
    sku: 'SO-KIT-028',
    price: 3500,
    purchasePrice: 2200,
    stock: 30,
    images: ['/assets/images/products/ultimate-skincare-kit.webp'],
    categorySlug: 'special-offers',
    description: 'A premium travel-friendly box set containing cleanser, serum, and cream. Clean skincare on the go.',
    tags: ['skincare kit', 'gift set', 'skincare', 'special offer']
  },
  {
    name: 'Luxury Mini Perfume Set (4pcs)',
    slug: 'luxury-mini-perfume-set',
    sku: 'SO-PRF-029',
    price: 4200,
    purchasePrice: 2800,
    stock: 20,
    images: ['/assets/images/products/luxury-mini-perfume-set.webp'],
    categorySlug: 'special-offers',
    description: 'Experience four of our finest fragrance creations in a lovely velvet presentation gift box.',
    tags: ['perfume set', 'gift set', 'fragrance', 'special offer']
  },
  {
    name: 'Complete Glam Makeup Kit',
    slug: 'complete-glam-makeup-kit',
    sku: 'SO-GLM-030',
    price: 5500,
    purchasePrice: 3600,
    stock: 15,
    images: ['/assets/images/products/complete-glam-makeup-kit.webp'],
    categorySlug: 'special-offers',
    description: 'All-in-one glam vanity case loaded with eyeshadow palettes, highlighters, lipsticks, and tools.',
    tags: ['makeup kit', 'glam kit', 'makeup', 'special offer']
  }
];

async function seed() {
  try {
    await mongoose.connect(mongodbUri);
    console.log('Connected to MongoDB successfully.');

    // Clear existing products
    const deleteResult = await Product.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing products.`);

    // Fetch categories to map IDs
    const categories = await Category.find({});
    const categoryMap = {};
    categories.forEach(c => {
      categoryMap[c.slug] = c._id;
    });

    // Prepare products with correct ObjectIds and Section Flags
    const finalProducts = baseProducts.map((p, idx) => {
      const categoryId = categoryMap[p.categorySlug];
      if (!categoryId) {
        throw new Error(`Category with slug "${p.categorySlug}" not found in DB! Seed categories first.`);
      }

      const productCopy = { ...p };
      productCopy.categories = [categoryId];
      delete productCopy.categorySlug;

      // Assign exactly 10 products with isFeatured = true (index 0 to 9)
      if (idx >= 0 && idx < 10) {
        productCopy.isFeatured = true;
      }

      // Assign exactly 10 products with isNewArrival = true (index 10 to 19)
      if (idx >= 10 && idx < 20) {
        productCopy.isNewArrival = true;
      }

      // Assign exactly 10 products with isFlashSale = true (index 20 to 29)
      if (idx >= 20 && idx < 30) {
        productCopy.isFlashSale = true;
      }

      // Assign exactly 10 products as discounted (index 0 to 9)
      if (idx >= 0 && idx < 10) {
        const discountRate = 10; // 10% discount
        productCopy.discountRate = discountRate;
        productCopy.salePrice = Math.round(productCopy.price * (1 - discountRate / 100));
      }

      return productCopy;
    });

    // Insert new products
    const insertResult = await Product.insertMany(finalProducts);
    console.log(`Seeded ${insertResult.length} products successfully!`);

    // Verify constraints
    let featuredCount = 0;
    let newArrivalCount = 0;
    let flashSaleCount = 0;
    let discountedCount = 0;

    insertResult.forEach(prod => {
      if (prod.isFeatured) featuredCount++;
      if (prod.isNewArrival) newArrivalCount++;
      if (prod.isFlashSale) flashSaleCount++;
      if (prod.salePrice && prod.discountRate) discountedCount++;
    });

    console.log(`Seeding Verification:`);
    console.log(`- Featured Products: ${featuredCount} (Expected: 10)`);
    console.log(`- New Arrivals: ${newArrivalCount} (Expected: 10)`);
    console.log(`- Flash Sales: ${flashSaleCount} (Expected: 10)`);
    console.log(`- Discounted Products: ${discountedCount} (Expected: 10)`);

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seed();
