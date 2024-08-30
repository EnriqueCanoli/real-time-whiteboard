import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    user: {
        name: string;
        email: string;
    } | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    status: 'idle',
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginRequest(state) {
            state.status = 'loading';
        },
        loginSuccess(state, action: PayloadAction<{ user: { name: string; email: string } }>) {
            state.status = 'succeeded';
            state.user = action.payload.user;
            state.error = null;
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.status = 'failed';
            state.error = action.payload;
        },
        logout(state) {
            state.user = null;
            state.status = 'idle';
            state.error = null;
        },
    }
});

export const { loginRequest, loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;
