# Cart Session Model

This document describes the cart-session schema and API contract expected by the updated storefront. You can copy it into the backend repo for reference.

## MongoDB Schema

```ts
import { Schema, Types, model } from 'mongoose';

const CartItemSchema = new Schema({
  pluginId: {
    type: Types.ObjectId,
    ref: 'Plugin',
    required: true,
  },
  variantId: {
    type: String, // Shopify variant GID
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number, // store as decimal or cents (NumberInt) based on preference
    required: true,
  },
  image: String,
  mediaType: {
    type: String,
    enum: ['image', 'video'],
  },
  mimeType: String,
  category: String,
  featured: Boolean,
  size: {
    type: String,
    enum: ['small', 'medium', 'large'],
    default: 'medium',
  },
  metadata: Schema.Types.Mixed,
  quantity: {
    type: Number,
    min: 1,
    required: true,
  },
});

const CartSchema = new Schema(
  {
    status: {
      type: String,
      enum: ['open', 'completed', 'abandoned'],
      default: 'open',
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    pendingOrderId: {
      type: Types.ObjectId,
      ref: 'PendingOrder',
    },
    customerId: {
      type: Types.ObjectId,
      ref: 'Customer',
    },
    sessionFingerprint: String, // optional device/session identifier
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Cart = model('Cart', CartSchema);
```

### Notes
- `_id` doubles as the session identifier. The frontend stores it in the `cart_session_id` cookie.
- `metadata` can hold arbitrary JSON (e.g., `internalUrl`, privacy consent flags, pending order custom IDs).
- `lastActivityAt` helps you expire abandoned carts.
 
## REST Contract (`/api/cart/session`)
The Next.js app proxies all cart operations to your backend using these REST endpoints. Responses must always include the canonical cart shape `{ id: string, items: CartItem[] }` unless an error occurs.

### 1. Create Session
```
POST /api/cart/session
Body (optional): { items?: CartItem[] }
```
- Creates a new cart or migrates legacy cookie items.
- Returns `{ id, items }`. Store `id` in `cart_session_id` (httpOnly, 30-day TTL).

### 2. Read Session
```
GET /api/cart/session/:id
```
- Returns `{ id, items }`.
- Respond with `404` if the cart does not exist (frontend clears cookie and starts fresh).

### 3. Mutate Session
```
PATCH /api/cart/session/:id
Body: {
  action: 'addItem' | 'removeItem' | 'updateQuantity',
  item?: CartItem,
  pluginId?: string,
  quantity?: number
}
```
- `addItem`: merge by `pluginId` (increment quantity if already present).
- `removeItem`: delete item entirely.
- `updateQuantity`: set exact quantity; remove if quantity <= 0.
- Return updated `{ id, items }` after each mutation.

### 4. Delete Session
```
DELETE /api/cart/session/:id
```
- Clears cart, sets status to `abandoned`/`completed`, and responds `{ success: true }`.
- Frontend will drop the cookie once it receives success.

### Error Handling
- Use JSON errors: `{ error: string }` with appropriate HTTP status.
- Frontend retries on network errors; do not return HTML.

## Pending Order Integration
When checkout begins, the frontend posts to `/api/orders/pending` with:
```json
{
  "shopifyProductIds": ["..."],
  "metadata": {
    "internalUrl": "https://example.squarespace.com",
    "agreedToPrivacy": true,
    "agreedAt": "2025-11-27T18:00:00.000Z",
    "cartId": "<cart _id>"
  }
}
```
Your backend can use `cartId` to mark the cart as `completed` once the webhook confirms the Shopify order.

## Migration Steps
1. Deploy the model + endpoints in the backend solution.
2. Ensure the proxy route (`/app/api/cart/session`) can reach them via `BECOMING_API_URL`.
3. After the backend is live, clear any existing `cart_session_id` cookies to start fresh.
4. Monitor logs for `Failed to fetch cart session` or `Cart request failed` to catch integration issues.
