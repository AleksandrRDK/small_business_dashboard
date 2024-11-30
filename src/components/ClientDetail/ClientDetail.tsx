import { useParams, useNavigate, useLocation  } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import "./ClientDetail.scss";
import { removeClient, updateClient, Client } from "../../store/slices/clientsSlice";
import { RootState, AppDispatch } from "../../store/store";

const ClientDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const location = useLocation();

    const clients = useSelector((state: RootState) => state.clients.clients);
    const client = clients.find((c) => c.id === id);
    const orders = useSelector((state: RootState) => state.orders.orders);
    const clientOrders = orders.filter((order) => String(order.clientId) === id)

    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState<Omit<Client, "id" | "registrationDate">>({
        name: client?.name || "",
        phone: client?.phone || "",
        email: client?.email || "",
        address: client?.address || "",
        notes: client?.notes || "",
        favorites: client?.favorites || false,
    });

    // Перенаправление, если клиента нет
    useEffect(() => {
        if (!client) {
            navigate("/clients");
        }
    }, [client, navigate]);

    // Обработчик изменения полей формы
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Включение режима редактирования
    const handleEdit = () => setIsEditing(true);

    // Сохранение изменений
    const handleSave = () => {
        if (!formData.name.trim() || !formData.phone.trim()) {
            alert("Имя и телефон обязательны для заполнения.");
            return;
        }
        if (!client) {
            console.error("Client not found during save operation.");
            return;
        } // Если client не найден, ничего не делаем

        const updatedClient: Client = {
            ...client, // Берём id и registrationDate из существующего клиента
            ...formData, // Обновляем остальные поля из формы
        };

        dispatch(updateClient(updatedClient)); // Передаём объект с типом Client в Redux
        setIsEditing(false); // Завершаем редактирование
    };

    // Отмена изменений
    const handleCancel = () => {
        setFormData({
            name: client?.name || "",
            phone: client?.phone || "",
            email: client?.email || "",
            address: client?.address || "",
            notes: client?.notes || "",
            favorites: client?.favorites || false,
        });
        setIsEditing(false);
    };

    // Удаление клиента
    const handleDelete = () => {
        dispatch(removeClient(client!.id));
        navigate("/clients");
    };

    // Переход назад
    const handleBack = () => navigate("/clients");

    if (!client) {
        return null; // Или лучше return <p>Загрузка...</p> до выполнения useEffect
    }

    // переход на каждый заказ отдельно

    const handleOrder = (id: string) => {
      navigate(`/order/${id}`, {state: { from: location.pathname}});
    }

    return (
        <div className="client-detail">
          <header className="client-detail__header">
            {!isEditing ? <button
              className="client-detail__btn client-detail__btn--back"
              onClick={handleBack}
            >
              ←
            </button> : <div></div>}
            <h2>{isEditing ? "Редактирование клиента" : client.name}</h2>
            <div className="client-detail__actions">
              {isEditing ? (
                <>
                  <button
                    className="client-detail__btn client-detail__btn--save"
                    onClick={handleSave}
                  >
                    💾
                  </button>
                  <button
                    className="client-detail__btn client-detail__btn--cancel"
                    onClick={handleCancel}
                  >
                    ❌
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="client-detail__btn client-detail__btn--edit"
                    onClick={handleEdit}
                  >
                    ✏️
                  </button>
                  <button
                    className="client-detail__btn client-detail__btn--delete"
                    onClick={handleDelete}
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
          </header>

          <div className="client-detail__content">
          {isEditing ? (
            <form className="client-detail__form">
              <div className="client-detail__form-group">
                <label htmlFor="name" className="client-detail__form-label">
                  Имя:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="client-detail__form-input"
                />
              </div>
              <div className="client-detail__form-group">
                <label htmlFor="phone" className="client-detail__form-label">
                  Телефон:
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="client-detail__form-input"
                />
              </div>
              <div className="client-detail__form-group">
                <label htmlFor="email" className="client-detail__form-label">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="client-detail__form-input"
                />
              </div>
              <div className="client-detail__form-group">
                <label htmlFor="address" className="client-detail__form-label">
                  Адрес:
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="client-detail__form-input"
                />
              </div>
              <div className="client-detail__form-group">
                <label htmlFor="notes" className="client-detail__form-label">
                  Заметки:
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="client-detail__form-textarea"
                />
              </div>
              <div className="client-detail__form-group">
                <label htmlFor="favorites" className="client-detail__form-label">
                  Избранный:
                </label>
                <input
                  type="checkbox"
                  id="favorites"
                  name="favorites"
                  checked={formData.favorites}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      favorites: e.target.checked,
                    }))
                  }
                  className="client-detail__form-checkbox"
                />
              </div>
            </form>
          ) : (
            <div className="client-detail__info">
              <p>
                <strong>Телефон:</strong> {client.phone}
              </p>
              <p>
                <strong>Email:</strong> {client.email}
              </p>
              <p>
                <strong>Адрес:</strong> {client.address}
              </p>
              <p>
                <strong>Дата регистрации:</strong> {client.registrationDate}
              </p>
              <p>
                <strong>Заметки:</strong> {client.notes || "Нет заметок"}
              </p>
              <p>
                <strong>Избранный:</strong> {client.favorites ? "Да" : "Нет"}
              </p>
            </div>
          )}
              {/* Секция заказов */}
            {isEditing ? <></> :
            <section className="client-detail__orders">
            <h3>Заказы клиента</h3>
            {clientOrders.length > 0 ? (
                <ul className="client-detail__orders-list">
                    {clientOrders.map((order) => (
                        <li key={order.id} className="client-detail__orders-item" onClick={() => handleOrder(order.id)}>
                            <p><strong>Номер заказа:</strong> {order.orderNumber}</p>
                            <p><strong>Дата:</strong> {order.date}</p>
                            <p><strong>Сумма:</strong> {order.total} ₽</p>
                            <p><strong>Статус:</strong> {order.status}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>У клиента пока нет заказов.</p>
            )}
        </section>
            }
          </div>
        </div>
      );


};

export default ClientDetail;