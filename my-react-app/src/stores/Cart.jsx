import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    items: localStorage.getItem("carts") ? JSON.parse(localStorage.getItem("carts")) : [],
    statusTab: false,
    total: 0
}
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            console.log('addToCart reducer called with payload:', action.payload);
            const { productId, quantity, source } = action.payload;
            console.log('Current cart items before adding:', JSON.parse(JSON.stringify(state.items)));
            const indexProductId = (state.items).findIndex(item => item.productId === productId && item.source === source);

            if (source === 'memberships') {
                // For services, always add with quantity 1 if not already in cart
                if (indexProductId === -1) {
                    state.items.push({ productId, quantity: 1, source });
                    console.log('New service item added to cart with quantity 1:', { productId, quantity: 1, source });
                } else {
                    // If service is already in cart, do not change quantity
                    console.log('Service item already in cart, quantity remains 1.');
                }
            } else {
                // For cars/accessories, handle quantity increment
                if (indexProductId >= 0) {
                    state.items[indexProductId].quantity += quantity;
                    console.log('Item already in cart, updated quantity:', state.items[indexProductId].quantity);
                } else {
                    state.items.push({ productId, quantity, source });
                    console.log('New item added to cart:', { productId, quantity, source });
                }
            }

            console.log('Cart items after adding:', JSON.parse(JSON.stringify(state.items)));
            localStorage.setItem("carts", JSON.stringify(state.items));
            console.log('Cart items saved to localStorage');
        },
        changeQuantity(state, action) {
            const { productId, quantity, source } = action.payload;
            const indexProductId = (state.items).findIndex(item => item.productId === productId && item.source === source);
            if (indexProductId >= 0) {
                // Only allow quantity change for non-service items
                if (source !== 'memberships') {
                    if (quantity > 0) {
                        state.items[indexProductId].quantity = quantity;
                    } else {
                        // Remove if quantity is 0 or less for non-service items
                        state.items = (state.items).filter(item => !(item.productId === productId && item.source === source));
                    }
                    localStorage.setItem("carts", JSON.stringify(state.items));
                } else {
                    console.log('Attempted to change quantity for service item, operation ignored.');
                }
            }
        },
        toggleStatusTab(state) {
            if (state.statusTab === false) {
                state.statusTab = true;
            } else {
                state.statusTab = false;
            }
        },
        removeFromCart(state, action) {
            // Need to remove by both productId and source
            const { productId, source } = action.payload;
            state.items = state.items.filter(item => !(item.productId === productId && item.source === source));
            localStorage.setItem("carts", JSON.stringify(state.items));
        },
        updateQuantity(state, action) {
            const { productId, quantity, source } = action.payload;
            const item = state.items.find(item => item.productId === productId && item.source === source);
            if (item) {
                // Only allow quantity update for non-service items
                if (source !== 'memberships') {
                    item.quantity = quantity;
                    localStorage.setItem("carts", JSON.stringify(state.items));
                } else {
                    console.log('Attempted to update quantity for service item, operation ignored.');
                }
            }
        },
        clearCart(state) {
            state.items = [];
            state.total = 0;
            localStorage.removeItem("carts");
        }
    }
})
export const { addToCart, changeQuantity, toggleStatusTab, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;