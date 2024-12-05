import { configureStore } from "@reduxjs/toolkit";
import clientsReducer from "./slices/clientsSlice";
import ordersReducer from "./slices/ordersSlice";
import type { ClientsState } from "./slices/clientsSlice";
import type { OrdersState } from "./slices/ordersSlice";

const loadState = (): { clients: ClientsState; orders: OrdersState } | undefined => {
  try {
    const serializedState = localStorage.getItem("dashboardState");
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (error) {
    console.error("Не удалось загрузить состояние из localStorage:", error);
    return undefined;
  }
};

const saveState = (state: { clients: ClientsState; orders: OrdersState }) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("dashboardState", serializedState);
  } catch (error) {
    console.error("Не удалось сохранить состояние в localStorage:", error);
  }
};

const preloadedState = loadState();

const store = configureStore({
  reducer: {
    clients: clientsReducer,
    orders: ordersReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState({
    clients: store.getState().clients,
    orders: store.getState().orders,
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
