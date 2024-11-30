import { FaCheckCircle, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Order, removeOrder, updateOrder } from "../../store/slices/ordersSlice";
import { RootState, AppDispatch } from "../../store/store";
import "./OrderDetail.scss";

const OrderDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const location = useLocation();

    const orders = useSelector((state: RootState) => state.orders.orders);
    const clients = useSelector((state: RootState) => state.clients.clients);

    const order = orders.find((o) => o.id === id);

    // Селектор для получения имени клиента по его ID
    const selectClientNameById = (clientId: string) => {
        const client = clients.find((client) => client.id === clientId);
        return client ? client.name : "Неизвестный клиент";
    };

    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState<Omit<Order, "id" | "date" | "orderNumber">>({
        clientId: order?.clientId || "",
        status: order?.status || "",
        total: order?.total || "",
        notes: order?.notes || "",
    });

    if (!order) {
        return <p className="order-detail__error">Заказ не найден</p>;
    }

    const handleEdit = () => setIsEditing(true);

    const handleStatusChange = (newStatus: string) => {
        setFormData((prev) => ({ ...prev, status: newStatus }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.clientId.trim() || !formData.total.trim()) {
            alert("Все поля обязательны для заполнения.");
            return;
        }

        const updatedOrder: Order = {
            ...order, // Сохраняем неизменные данные
            ...formData, // Обновляем поля из формы
        };

        dispatch(updateOrder(updatedOrder));
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            clientId: order?.clientId || "",
            status: order?.status || "",
            total: order?.total || "",
            notes: order?.notes || "",
        });
        setIsEditing(false);
    };

    const handleDelete = () => {
        dispatch(removeOrder(order.id));
        navigate("/orders");
    };

    const handleBack = () => {
        const fromPath = location.state?.from || "/orders";
        navigate(fromPath);
    }

    return (
        <div className="order-detail">
            <header className="order-detail__header">
                {!isEditing ? (
                    <button className="order-detail__btn order-detail__btn--back" onClick={handleBack}>
                        ←
                    </button>
                ) : (
                    <div></div>
                )}
                <h2>{isEditing ? "Редактирование заказа" : `Заказ №${order.orderNumber}`}</h2>
                <div className="order-detail__actions">
                    {isEditing ? (
                        <>
                            <button className="order-detail__btn order-detail__btn--save" onClick={handleSave}>
                                🗃️
                            </button>
                            <button className="order-detail__btn order-detail__btn--cancel" onClick={handleCancel}>
                                ❌
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="order-detail__btn order-detail__btn--edit" onClick={handleEdit}>
                                ✏️
                            </button>
                            <button className="order-detail__btn order-detail__btn--delete" onClick={handleDelete}>
                                🗑️
                            </button>
                        </>
                    )}
                </div>
            </header>

            <div className="order-detail__content">
                {isEditing ? (
                    <form className="order-detail__form">
                        <div className="order-detail__form-group">
                            <label htmlFor="clientId" className="order-detail__form-label">
                                Клиент:
                            </label>
                            <select
                                id="clientId"
                                name="clientId"
                                value={formData.clientId}
                                onChange={handleChange}
                                className="order-detail__form-input"
                            >
                                <option value="">Выберите клиента</option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="order-detail__form-group">
                            <label className="order-detail__form-label">Статус:</label>
                            <div className="order-detail__status-icons">
                                <div
                                    className={`status-icon-wrapper completed ${formData.status === "Завершен" ? "selected" : ""}`}
                                    onClick={() => handleStatusChange("Завершен")}
                                >
                                    <FaCheckCircle />
                                </div>
                                <div
                                    className={`status-icon-wrapper in-progress ${formData.status === "В процессе" ? "selected" : ""}`}
                                    onClick={() => handleStatusChange("В процессе")}
                                >
                                    <FaHourglassHalf />
                                </div>
                                <div
                                    className={`status-icon-wrapper cancelled ${formData.status === "Отменен" ? "selected" : ""}`}
                                    onClick={() => handleStatusChange("Отменен")}
                                >
                                    <FaTimesCircle />
                                </div>
                            </div>
                        </div>
                        <div className="order-detail__form-group">
                            <label htmlFor="total" className="order-detail__form-label">
                                Сумма:
                            </label>
                            <input
                                type="number"
                                id="total"
                                name="total"
                                className="order-detail__form-input"
                                value={formData.total}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="order-detail__form-group">
                            <label htmlFor="notes" className="order-detail__form-label">
                                Заметки:
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="order-detail__form-textarea"
                            />
                        </div>
                    </form>
                ) : (
                    <div className="order-detail__info">
                        <p>
                            <strong>Клиент:</strong>
                            <Link to={`/client/${order.clientId}`} className="order-detail__client-link">
                                {selectClientNameById(order.clientId)}
                            </Link>
                        </p>
                        <p>
                            <strong>Статус:</strong> {order.status}
                        </p>
                        <p>
                            <strong>Дата:</strong> {order.date}
                        </p>
                        <p>
                            <strong>Сумма:</strong> {order.total} ₽
                        </p>
                        <p>
                            <strong>Заметки:</strong> {order.notes || "Нет заметок"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetail;
