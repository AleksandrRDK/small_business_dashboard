import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  registrationDate: string;
  notes: string;
  favorites: boolean,
}

export interface ClientsState {
  clients: Client[];
}

const initialState: ClientsState = {
  clients: [
    {
      id: "1",
      name: "Иван Иванов",
      phone: "+7 (123) 456-78-90",
      email: "ivanov@example.com",
      address: "Москва, ул. Тверская, д. 1",
      registrationDate: "2024-01-01",
      notes: "Тестовый клиент 1",
      favorites: true,
    },
    {
      id: "2",
      name: "Мария Петрова",
      phone: "+7 (321) 654-32-10",
      email: "petrova@example.com",
      address: "Санкт-Петербург, ул. Невский, д. 2",
      registrationDate: "2024-02-01",
      notes: "Тестовый клиент 2",
      favorites: false,
    },
    {
      id: "3",
      name: "Сергей Смирнов",
      phone: "+7 (456) 789-01-23",
      email: "smirnov@example.com",
      address: "Екатеринбург, ул. Ленина, д. 3",
      registrationDate: "2024-03-01",
      notes: "Тестовый клиент 3",
      favorites: false,
    },
  ],
};

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    addClient(state, action: PayloadAction<Client>) {
      state.clients.push(action.payload);
    },
    removeClient(state, action: PayloadAction<string>) {
      state.clients = state.clients.filter(client => client.id !== action.payload);
    },
    updateClient(state, action: PayloadAction<Client>) {
      const index = state.clients.findIndex(client => client.id === action.payload.id);
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
    },
    toggleFavorite(state, action) {
      const client = state.clients.find(c => c.id === action.payload);
      if (client) {
        client.favorites = !client.favorites;
      }
    }
  },
});

export const { addClient, removeClient, updateClient, toggleFavorite } = clientsSlice.actions;
export default clientsSlice.reducer;
