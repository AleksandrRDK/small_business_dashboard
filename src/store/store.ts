import { configureStore } from "@reduxjs/toolkit";
import clientsReducer from "./slices/clientsSlice";
import ordersReducer from "./slices/ordersSlice";

const store = configureStore({
  reducer: {
    clients: clientsReducer,
    orders: ordersReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

