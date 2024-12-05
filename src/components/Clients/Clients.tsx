import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { toggleFavorite } from "../../store/slices/clientsSlice";
import ModalWindowAddClient from "../ModalWindowAddClient/ModalWindowAddClient";
import { FaStar } from "react-icons/fa";
import "./Clients.scss";

const Clients: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const clients = useSelector((state: RootState) => state.clients.clients);

  const filteredClients = clients.filter((client) => {
    const normalizedPhone = client.phone.replace(/[\s()-]/g, "");
    const normalizedQuery = searchQuery.replace(/\s+/g, "").toLowerCase();

    return (
      client.name.toLowerCase().includes(normalizedQuery) ||
      normalizedPhone.includes(normalizedQuery) ||
      client.email.toLowerCase().includes(normalizedQuery)
    );
  });

  const handleClientClick = (id: string) => {
    navigate(`/client/${id}`);
  };

  const handleToggleFavorite = (id: string) => {
    dispatch(toggleFavorite(id));
  };

  return (
    <div className="clients">
      <header className="clients__wrapper">
        <input
          type="text"
          placeholder="Поиск по имени, телефону или e-mail..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="clients__search"
        />
        <button
          className="clients__add-btn"
          onClick={() => setIsModalOpen(true)}
        >
          Добавить клиента
        </button>
      </header>

      <ul className="clients__list">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <li
              key={client.id}
              className="clients__item"
              onClick={() => handleClientClick(client.id)}
            >
              <div className="clients__span__wrapper">
                <span className="clients__name">{client.name}</span>
                <span className="clients__phone">{client.phone}</span>
                <span className="clients__email">{client.email}</span>
              </div>
              <div className="clients__actions">
                <button
                  className={`clients__favorite-btn ${
                    client.favorites ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(client.id);
                  }}
                  aria-label="Добавить в избранное"
                >
                  <FaStar />
                </button>
                <button
                  className="clients__edit-btn"
                  aria-label="Редактировать клиента"
                >
                  ⚙️
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="clients__no-data">Ничего не найдено</li>
        )}
      </ul>

      {isModalOpen && (
        <ModalWindowAddClient onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default Clients;
