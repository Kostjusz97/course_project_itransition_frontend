import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios';

export const fetchCollections = createAsyncThunk('collections/fetchCollections', async () => {
    const { data } = await axios.get('/api/collection');
    return data
});

export const fetchOneCollection = createAsyncThunk('collections/fetchOneCollection', async (id) => {
    const { data } = await axios.get(`/api/collection/${id}`);
    return data
});

export const fetchRemoveCollection = createAsyncThunk('posts/fetchRemoveCollection', async (id) => {
    await axios.delete(`/api/collection/remove/${id}`)
});

export const fetchMyCollections = createAsyncThunk('collections/fetchMyCollections', async (id) => {
    const { data } = await axios.get(`/api/collection/user/${id}`);
    return data
});

const initialState = {
    data: null,
    status: 'loading'
};

const collectionsSlice = createSlice({
    name: 'collections',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchCollections.pending, (state) => {
                state.data = null
                state.status = 'loading'
            })
            .addCase(fetchCollections.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'loaded'
            })
            .addCase(fetchCollections.rejected, (state) => {
                state.data = null;
                state.status = 'error'
            })
            .addCase(fetchOneCollection.pending, (state) => {
                state.data = null
                state.status = 'loading'
            })
            .addCase(fetchOneCollection.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'loaded'
            })
            .addCase(fetchOneCollection.rejected, (state) => {
                state.data = null;
                state.status = 'error'
            })
            .addCase(fetchRemoveCollection.pending, (state) => {
                state.data = null
                state.status = 'loading'
            })
            .addCase(fetchRemoveCollection.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'loaded'
            })
            .addCase(fetchRemoveCollection.rejected, (state) => {
                state.data = null;
                state.status = 'error'
            })
            .addCase(fetchMyCollections.pending, (state) => {
                state.data = null
                state.status = 'loading'
            })
            .addCase(fetchMyCollections.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'loaded'
            })
            .addCase(fetchMyCollections.rejected, (state) => {
                state.data = null;
                state.status = 'error'
            });
    }
});

export const myCollections = (state) => state.collections.data

export const collectionsReducer = collectionsSlice.reducer;
