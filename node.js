// Backend API endpoints (Node.js/Express)
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: 'rzp_live_YOUR_RAZORPAY_KEY_ID',
  key_secret: 'YOUR_RAZORPAY_KEY_SECRET'
});

// Endpoint 1: Create Razorpay Order
app.post('/create-razorpay-order', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount, // amount in paise
      currency: req.body.currency || 'INR',
      receipt: req.body.receipt,
      notes: req.body.notes
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Endpoint 2: Verify Payment
app.post('/verify-razorpay-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    // Generate signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment is legitimate
      res.json({ success: true });
    } else {
      // Payment verification failed
      res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, error: 'Payment verification failed' });
  }
});