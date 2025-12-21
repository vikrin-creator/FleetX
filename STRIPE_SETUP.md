# Stripe Integration Setup Instructions

## Backend Setup

1. **Set Environment Variables on your server:**
   
   Add these to your hosting environment (Hostinger):
   ```
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   STRIPE_PUBLIC_KEY=your_stripe_public_key_here
   ```

2. **Install Stripe PHP SDK:**
   ```bash
   cd backend
   composer require stripe/stripe-php
   ```

3. **Or manually set in .htaccess or php.ini if your host doesn't support environment variables:**
   Create a `.env` file in backend folder or use the `.env.stripe` template

## Frontend Setup

The public key is configured in `.env`:
```
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key_here
```

## API Endpoints

- **Create Payment Intent:** `POST /api/stripe.php?action=create_payment_intent`
  ```json
  {
    "amount": 10000,
    "orderId": "123",
    "userId": "456"
  }
  ```

- **Confirm Payment:** `POST /api/stripe.php?action=confirm_payment`
  ```json
  {
    "paymentIntentId": "pi_xxx"
  }
  ```

## Usage in Checkout

Import and use the Stripe service:
```javascript
import { getStripe, createPaymentIntent } from '../services/stripeService';

// Create payment intent
const { clientSecret } = await createPaymentIntent(totalAmount, orderId, userId);

// Use with Stripe Elements
const stripe = await getStripe();
// ... rest of Stripe payment flow
```

## Test Cards

Use these test cards for testing:
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- 3D Secure: 4000 0027 6000 3184

Any future date for expiry, any 3-digit CVC, any postal code.

## Important Security Notes

- Never commit `.env.stripe` to version control
- The secret key should only be on your server
- The public key can be in frontend code
- Test keys start with `sk_test_` and `pk_test_`
- Production keys start with `sk_live_` and `pk_live_`
