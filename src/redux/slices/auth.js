import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios';
import { jwtDecode } from "jwt-decode";

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params) => {
    const { data } = await axios.post('/api/user/login', params);
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
});

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
    const { data } = await axios.post('/api/user/registration', params);
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
});


export const fetchCheck = createAsyncThunk('auth/fetchCheck', async () => {
    const { data } = await axios.get('/api/user');
    return jwtDecode(data.token)
});

const initialState = {
    data: null,
    status: 'loading'
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchAuth.pending, (state) => {
                state.data = null
                state.status = 'loading'
            })
            .addCase(fetchAuth.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'loaded'
            })
            .addCase(fetchAuth.rejected, (state) => {
                state.data = null;
                state.status = 'error'
            })
            .addCase(fetchRegister.pending, (state) => {
                state.data = null
                state.status = 'loading'
            })
            .addCase(fetchRegister.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'loaded'
            })
            .addCase(fetchRegister.rejected, (state) => {
                state.data = null;
                state.status = 'error'
            })
            .addCase(fetchCheck.pending, (state) => {
                state.data = null
                state.status = 'loading'
            })
            .addCase(fetchCheck.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'loaded'
            })
            .addCase(fetchCheck.rejected, (state) => {
                state.data = null;
                state.status = 'error'
            });
    }
});

export const selectIsAuth = (state) => Boolean(state.auth.data)

export const { logout } = authSlice.actions
export const authReducer = authSlice.reducer;
