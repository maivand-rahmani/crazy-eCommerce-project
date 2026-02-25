# Guest Cart Feature

This feature allows users to add items to cart without logging in, with cart persisted in localStorage. When users log in, they can merge their guest cart with their account.

## Components

### 1. useGuestCart Hook
Manages guest cart entirely in localStorage.

```jsx
import { useGuestCart } from '@/features/guest-cart/model/useGuestCart';

function MyComponent() {
  const { items, addItem, removeItem, clearCart, totalCents } = useGuestCart();
  
  // Add item
  addItem({
    variantId: '123',
    productId: '456',
    name: 'Product Name',
    priceCents: 9999,
    quantity: 1,
  });
}
```

### 2. useCartWithGuest Hook
Enhanced cart that works for both guest and logged-in users. Automatically handles merging.

```jsx
import { useCartWithGuest } from '@/features/guest-cart/model/useCartWithGuest';

function CartPage() {
  const { 
    items, 
    addToCart, 
    removeFromCart, 
    itemCount, 
    totalCents,
    showMergePrompt,
    mergeCarts,
    dismissMerge,
    isSignedIn 
  } = useCartWithGuest();
  
  return (
    <div>
      <p>Cart: {itemCount} items</p>
      <p>Total: ${(totalCents / 100).toFixed(2)}</p>
    </div>
  );
}
```

### 3. GuestCartIndicator Component
Shows a prompt to merge guest cart when user logs in.

```jsx
import { GuestCartIndicator } from '@/features/guest-cart/ui/GuestCartIndicator';

function App() {
  const handleMerge = (items) => {
    // Called when user clicks "Save to Account"
    // Should send items to server and merge
  };
  
  return (
    <div>
      <GuestCartIndicator onMerge={handleMerge} isLoggedIn={false} />
    </div>
  );
}
```

## Features

- **localStorage persistence**: Cart survives browser refresh
- **Max 50 items**: Prevents localStorage overflow
- **Quantity management**: Update/remove items
- **Auto-merge prompt**: When user logs in with guest cart
- **Server sync**: Optional merge with server cart on login
