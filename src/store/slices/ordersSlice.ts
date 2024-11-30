import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export interface Order {
  id: string;
  clientId: string;
  orderNumber: string;
  status: string;
  date: string;
  total: string;
  notes: string;
}

interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = {
  orders: [
    {
      id: uuidv4(),
      clientId: "1",
      orderNumber: "ORD12345",
      status: "В процессе",
      date: "2024-11-01",
      total: "5000",
      notes: "описание к заказу",
    },
    {
      id: uuidv4(),
      clientId: "2",
      orderNumber: "ORD12346",
      status: "Завершен",
      date: "2024-11-02",
      total: "7500",
      notes: "описание к заказу",
    },
    {
      id: uuidv4(),
      clientId: "1",
      orderNumber: "ORD12347",
      status: "Отменен",
      date: "2024-11-05",
      total: "3200",
      notes: "описание к заказу",
    },
    {
      id: uuidv4(),
      clientId: "3",
      orderNumber: "ORD12348",
      status: "В процессе",
      date: "2024-11-06",
      total: "12000",
      notes: "описание к заказу",
    },
    {
      id: uuidv4(),
      clientId: "2",
      orderNumber: "ORD12349",
      status: "Завершен",
      date: "2024-11-07",
      total: "3000",
      notes: "описание к заказу",
    },
    {
      id: uuidv4(),
      clientId: "3",
      orderNumber: "ORD12350",
      status: "Отменен",
      date: "2024-11-10",
      total: "4500",
      notes: "описание к заказу",
    },
  ],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.push(action.payload);
    },
    removeOrder(state, action: PayloadAction<string>) {
      state.orders = state.orders.filter(order => order.id !== action.payload);
    },
    updateOrder(state, action: PayloadAction<Order>) {
      const index = state.orders.findIndex(order => order.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
  },
});

export const { addOrder, removeOrder, updateOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
