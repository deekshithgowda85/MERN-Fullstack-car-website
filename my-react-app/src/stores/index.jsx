import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './Cart';
import searchReducer from './Search';
import userReducer from './userSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        search: searchReducer,
        user: userReducer,
        // user: ...
    }
})