import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios';

export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
    const { data } = await axios.get('/api/item');
    return data
});

export const fetchOneItem = createAsyncThunk('items/fetchOneItem', async (id) => {
    const { data } = await axios.get(`/api/item/${id}`);
    return data
});

export const fetchCollectionItems = createAsyncThunk('items/fetchCollectionItems', async (id) => {
    const { data } = await axios.get(`/api/item/collection/${id}`);
    return data
});

const initialState = {
    data: null,
    status: 'loading'
};

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchItems.pending, (state) => {
                state.data = null
                state.status = 'loading'
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'loaded'
            })
            .addCase(fetchItems.rejected, (state) => {
                state.data = null;
                state.status = 'error'
            })
            .addCase(fetchOneItem.pending, (state) => {
                state.data = null
                state.status = 'loading'
            })
            .addCase(fetchOneItem.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'loaded'
            })
            .addCase(fetchOneItem.rejected, (state) => {
                state.data = null;
                state.status = 'error'
            })
            .addCase(fetchCollectionItems.pending, (state) => {
                state.data = null
                state.status = 'loading'
            })
            .addCase(fetchCollectionItems.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'loaded'
            })
            .addCase(fetchCollectionItems.rejected, (state) => {
                state.data = null;
                state.status = 'error'
            });
    }
});

export const collectionItems = (state) => state.items.data

export const itemsReducer = itemsSlice.reducer;
