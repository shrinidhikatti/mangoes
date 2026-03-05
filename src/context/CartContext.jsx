import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'belgaum-fresh-cart';

function loadCart() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function cartReducer(state, action) {
  let newState;

  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(
        item => item.productId === action.payload.productId &&
                item.variantLabel === action.payload.variantLabel
      );
      if (existing) {
        newState = state.map(item =>
          item.productId === action.payload.productId &&
          item.variantLabel === action.payload.variantLabel
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newState = [...state, { ...action.payload, id: Date.now().toString() }];
      }
      break;
    }
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        newState = state.filter(item => item.id !== action.payload.id);
      } else {
        newState = state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        );
      }
      break;
    }
    case 'REMOVE_ITEM':
      newState = state.filter(item => item.id !== action.payload.id);
      break;
    case 'CLEAR_CART':
      newState = [];
      break;
    default:
      return state;
  }

  saveCart(newState);
  return newState;
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart);

  const addItem = (product, variant, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        productId: product.id,
        productName: product.name,
        productImage: product.images?.[0] || '',
        variantLabel: variant.label,
        variantWeight: variant.weight,
        price: variant.price,
        quantity
      }
    });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      itemCount,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
