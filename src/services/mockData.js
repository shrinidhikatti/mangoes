export const mockCategories = [
  {
    id: 'cat-1',
    name: 'Mangoes',
    slug: 'mangoes',
    image: '/mango1.jpg',
    isActive: true,
    sortOrder: 1,
    description: 'Premium varieties from North Karnataka orchards'
  },
  {
    id: 'cat-2',
    name: 'Sweets',
    slug: 'sweets',
    image: '/mango5.jpg',
    isActive: true,
    sortOrder: 2,
    description: 'Traditional North Karnataka delicacies'
  },
  {
    id: 'cat-3',
    name: 'Fruits',
    slug: 'fruits',
    image: '/mango6.jpg',
    isActive: true,
    sortOrder: 3,
    description: 'Seasonal fresh fruits from local farms'
  }
];

export const mockProducts = [
  {
    id: 'prod-1',
    name: 'Alphonso Mango',
    category: 'mangoes',
    description: 'The king of mangoes. Premium Alphonso (Hapus) mangoes handpicked from our family orchards in North Karnataka. Known for their rich, creamy texture and intensely sweet flavor with hints of citrus. Each mango is naturally ripened for perfect taste.',
    images: ['/mango1.jpg', '/mango2.jpg'],
    variants: [
      { label: '1 Dozen (12 pcs)', price: 600, weight: 3 },
      { label: '2 Dozen (24 pcs)', price: 1100, weight: 6 },
      { label: '5 kg Box', price: 2200, weight: 5 }
    ],
    stockQuantity: 45,
    unit: 'pcs',
    isAvailable: true,
    sortOrder: 1,
    seasonStart: '2026-04-01',
    seasonEnd: '2026-07-31'
  },
  {
    id: 'prod-2',
    name: 'Badami Mango',
    category: 'mangoes',
    description: 'Also called Karnataka Alphonso, Badami mangoes are a regional pride. Slightly less sweet than Alphonso but incredibly aromatic. Their smooth, fiberless flesh melts in your mouth. Sourced from family-owned orchards in North Karnataka.',
    images: ['/mango3.jpg', '/mango4.jpg'],
    variants: [
      { label: '1 Dozen (12 pcs)', price: 400, weight: 3 },
      { label: '2 Dozen (24 pcs)', price: 750, weight: 6 },
      { label: '5 kg Box', price: 1500, weight: 5 }
    ],
    stockQuantity: 60,
    unit: 'pcs',
    isAvailable: true,
    sortOrder: 2,
    seasonStart: '2026-04-01',
    seasonEnd: '2026-07-31'
  },
  {
    id: 'prod-3',
    name: 'Totapuri Mango',
    category: 'mangoes',
    description: 'The versatile Totapuri mango with its distinctive parrot-beak shape. Perfect for making aam ras, mango dal, and pickles. Tangy-sweet flavor that brightens any dish. Farm-fresh from our orchards.',
    images: [
      '/mango5.jpg'
    ],
    variants: [
      { label: '2 kg', price: 200, weight: 2 },
      { label: '5 kg', price: 450, weight: 5 },
      { label: '10 kg', price: 800, weight: 10 }
    ],
    stockQuantity: 80,
    unit: 'kg',
    isAvailable: true,
    sortOrder: 3,
    seasonStart: '2026-04-01',
    seasonEnd: '2026-07-31'
  },
  {
    id: 'prod-4',
    name: 'Belagavi Kunda',
    category: 'sweets',
    description: 'The legendary Belagavi Kunda — a rich, caramelized milk sweet that\'s a hallmark of North Karnataka. Made with traditional methods by local artisans, this golden-brown delicacy is slow-cooked for hours to achieve its signature grainy texture and deep caramel flavor.',
    images: [
      '/mango6.jpg'
    ],
    variants: [
      { label: '250 gm Box', price: 200, weight: 0.25 },
      { label: '500 gm Box', price: 380, weight: 0.5 },
      { label: '1 kg Box', price: 700, weight: 1 }
    ],
    stockQuantity: 30,
    unit: 'gm',
    isAvailable: true,
    sortOrder: 1
  },
  {
    id: 'prod-5',
    name: 'Dharwad Pedha',
    category: 'sweets',
    description: 'Authentic Dharwad Pedha made from fresh milk, sugar, and cardamom. This GI-tagged sweet from neighbouring Dharwad has a distinctive taste that comes from the unique local milk and traditional preparation. Soft, melt-in-mouth texture.',
    images: [
      '/mango7.jpg'
    ],
    variants: [
      { label: '250 gm Box', price: 180, weight: 0.25 },
      { label: '500 gm Box', price: 340, weight: 0.5 },
      { label: '1 kg Box', price: 650, weight: 1 }
    ],
    stockQuantity: 25,
    unit: 'gm',
    isAvailable: true,
    sortOrder: 2
  },
  {
    id: 'prod-6',
    name: 'Black Grapes (Bangalore Blue)',
    category: 'fruits',
    description: 'Sweet and juicy Bangalore Blue grapes, freshly harvested from the vineyards of North Karnataka. Deep purple-black color with a rich, sweet-tangy flavor. Perfect for eating fresh or making juice.',
    images: [
      '/mango2.jpg'
    ],
    variants: [
      { label: '1 kg', price: 120, weight: 1 },
      { label: '2 kg', price: 220, weight: 2 },
      { label: '5 kg', price: 500, weight: 5 }
    ],
    stockQuantity: 0,
    unit: 'kg',
    isAvailable: false,
    sortOrder: 1,
    seasonStart: '2026-10-01',
    seasonEnd: '2027-02-28'
  }
];

export const mockConfig = {
  id: 'settings',
  serviceablePincodes: [
    '560001', '560002', '560003', '560004', '560005',
    '560008', '560009', '560010', '560011', '560017',
    '560034', '560038', '560041', '560047', '560050',
    '560068', '560069', '560070', '560078', '560095',
    '560100', '560102', '560103'
  ],
  deliveryCharges: {
    freeAbove: 500,
    flatRate: 50
  },
  orderCutoffTime: '20:00',
  minimumOrderValue: 300,
  contactPhone: '+919876543210',
  contactWhatsApp: '+919590677077',
  isStoreOpen: true,
  storeClosedMessage: 'We are currently closed for the season. See you next summer!'
};

export const mockOrders = [
  {
    id: 'ord-1',
    orderNumber: 'ORD-20260415-001',
    customer: {
      name: 'Rahul Sharma',
      phone: '+919876543210',
      email: 'rahul@example.com'
    },
    deliveryAddress: {
      fullAddress: '123, 4th Cross, Koramangala 4th Block',
      landmark: 'Near Forum Mall',
      pincode: '560034',
      city: 'Bangalore'
    },
    items: [
      {
        productId: 'prod-1',
        productName: 'Alphonso Mango',
        variantLabel: '2 Dozen (24 pcs)',
        price: 1100,
        quantity: 1,
        subtotal: 1100
      },
      {
        productId: 'prod-4',
        productName: 'Belagavi Kunda',
        variantLabel: '500 gm Box',
        price: 380,
        quantity: 2,
        subtotal: 760
      }
    ],
    subtotal: 1860,
    deliveryCharge: 0,
    totalAmount: 1860,
    paymentStatus: 'paid',
    razorpayPaymentId: 'pay_DEMO123456',
    razorpayOrderId: 'order_DEMO123456',
    orderStatus: 'confirmed',
    statusHistory: [
      { status: 'confirmed', timestamp: '2026-04-15T10:30:00Z', note: 'Order placed' }
    ],
    deliveryMode: 'self',
    estimatedDeliveryDate: '2026-04-16',
    createdAt: '2026-04-15T10:30:00Z',
    updatedAt: '2026-04-15T10:30:00Z'
  },
  {
    id: 'ord-2',
    orderNumber: 'ORD-20260415-002',
    customer: {
      name: 'Priya Nair',
      phone: '+919876543211'
    },
    deliveryAddress: {
      fullAddress: '45, 2nd Main, Indiranagar',
      landmark: 'Near 100ft Road',
      pincode: '560038',
      city: 'Bangalore'
    },
    items: [
      {
        productId: 'prod-2',
        productName: 'Badami Mango',
        variantLabel: '5 kg Box',
        price: 1500,
        quantity: 1,
        subtotal: 1500
      }
    ],
    subtotal: 1500,
    deliveryCharge: 0,
    totalAmount: 1500,
    paymentStatus: 'paid',
    razorpayPaymentId: 'pay_DEMO789012',
    razorpayOrderId: 'order_DEMO789012',
    orderStatus: 'packed',
    statusHistory: [
      { status: 'confirmed', timestamp: '2026-04-15T11:00:00Z', note: 'Order placed' },
      { status: 'packed', timestamp: '2026-04-15T14:00:00Z', note: 'Ready for delivery' }
    ],
    deliveryMode: 'porter',
    estimatedDeliveryDate: '2026-04-16',
    createdAt: '2026-04-15T11:00:00Z',
    updatedAt: '2026-04-15T14:00:00Z'
  }
];
