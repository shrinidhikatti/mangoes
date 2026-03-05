export const ORDER_STATUSES = {
  CONFIRMED: 'confirmed',
  PACKED: 'packed',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const ORDER_STATUS_LABELS = {
  confirmed: 'Confirmed',
  packed: 'Packed',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

export const ORDER_STATUS_COLORS = {
  confirmed: '#D4870E',
  packed: '#5AA843',
  out_for_delivery: '#E8652A',
  delivered: '#3D7A2E',
  cancelled: '#B84415'
};

export const DELIVERY_MODES = {
  SELF: 'self',
  PORTER: 'porter'
};

export const DEFAULT_CONFIG = {
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
  contactPhone: '+91XXXXXXXXXX',
  contactWhatsApp: '+91XXXXXXXXXX',
  isStoreOpen: true,
  storeClosedMessage: 'We are currently closed for the season. See you next summer!'
};

export const CURRENCY_SYMBOL = '\u20B9';
