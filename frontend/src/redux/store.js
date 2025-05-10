import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./authSlice";
import jobReducer from "./jobSlice";
import companySlice from "./companySlice";
import applicationSlice from "./applicationSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    job: jobReducer,
    company: companySlice,
    application: applicationSlice
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth", "job"] // persist both auth and job states
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"]
            }
        })
});

export const persistor = persistStore(store);