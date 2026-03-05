/**
 * Razorpay Payment Integration
 *
 * Phase 1: Client-side only flow (no server-side verification)
 * - Creates order directly via Razorpay checkout
 * - Stores payment details in Firestore
 *
 * Phase 2: Add Firebase Cloud Function for:
 * - Server-side order creation
 * - Payment signature verification
 */

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_XXXXXXXXXX';

/**
 * Load Razorpay checkout script dynamically
 */
function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });
}

/**
 * Open Razorpay payment popup
 *
 * @param {Object} options
 * @param {number} options.amount - Amount in rupees (will be converted to paise)
 * @param {string} options.orderId - Your internal order number
 * @param {string} options.customerName
 * @param {string} options.customerPhone
 * @param {string} options.customerEmail
 * @param {string} options.description
 * @returns {Promise<{razorpay_payment_id, razorpay_order_id, razorpay_signature}>}
 */
export async function initiatePayment({
  amount,
  orderId,
  customerName,
  customerPhone,
  customerEmail = '',
  description = 'Mango Mane - Fresh Produce Order'
}) {
  await loadRazorpayScript();

  return new Promise((resolve, reject) => {
    const options = {
      key: RAZORPAY_KEY,
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      name: 'Mango Mane',
      description,
      image: '', // Add your logo URL here
      // order_id: razorpayOrderId, // Uncomment when using server-side order creation
      prefill: {
        name: customerName,
        contact: customerPhone,
        email: customerEmail
      },
      notes: {
        order_id: orderId
      },
      theme: {
        color: '#D4870E'
      },
      handler: function (response) {
        // Payment successful
        resolve({
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id || '',
          razorpaySignature: response.razorpay_signature || ''
        });
      },
      modal: {
        ondismiss: function () {
          reject(new Error('Payment cancelled by user'));
        },
        escape: true,
        confirm_close: true
      },
      retry: {
        enabled: true,
        max_count: 3
      }
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (response) {
      reject(new Error(
        response.error.description ||
        response.error.reason ||
        'Payment failed'
      ));
    });

    rzp.open();
  });
}
