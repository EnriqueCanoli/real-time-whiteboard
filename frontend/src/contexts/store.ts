import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth/authSlice'
import { persistStore, persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: 'root', // Key for storing the persisted state
    storage, // The storage to use (localStorage in this case)
};

//create a persistReducer using the persist configuration
const persistedReducer = persistReducer(persistConfig, authReducer);



//configure the store using the persisted reducer
const store = configureStore({
    reducer:{
        auth: persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/FLUSH', 'persist/PAUSE', 'persist/PURGE', 'persist/REGISTER'],
                ignoredPaths: ['persist'],
            },
        })
})

// Create a persistor instance
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;