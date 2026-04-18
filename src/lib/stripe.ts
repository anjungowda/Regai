import { loadStripe } from '@stripe/stripe-js';

// The key will evaluate correctly when compiled if standard VITE syntax is used.
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_not_provided_for_mvp');
