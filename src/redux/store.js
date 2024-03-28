import { configureStore } from '@reduxjs/toolkit';
import { categoriesReducer } from './slices/categories';
import { authReducer } from './slices/auth';
import { itemsReducer } from './slices/items';
import { collectionsReducer } from './slices/collections';

const store = configureStore({
    reducer: {
        categories: categoriesReducer,
        auth: authReducer,
        items: itemsReducer,
        collections: collectionsReducer
    }
})

export default store;