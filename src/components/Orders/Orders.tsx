import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";

import ModalWindowAddOrder from "../ModalWindowAddOrder/ModalWindowAddOrder";
import "./Orders.scss";

const Orders = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const { orders } = useSelector((state: RootState) => state.orders);
    const { clients } = useSelector((state: RootState) => state.clients);

    // Функция для получения имени клиента по clientId
    const getClientNameById = (clientId: string) => {
        const client = clients.find(client => client.id === clientId);
        return client ? client.name : "Неизвестный клиент";
    };

    // Фильтрация заказов по поисковому запросу
    const filteredOrders = orders.filter(order => {
        const clientName = getClientNameById(order.clientId).toLowerCase();
        return (
            clientName.includes(searchQuery.toLowerCase()) ||
            order.orderNumber.includes(searchQuery)
        );
    });

    // Статистика заказов
    const totalOrders = orders.length;
    const completedOrders = orders.filter(order => order.status === "Завершен").length;
    const inProgressOrders = orders.filter(order => order.status === "В процессе").length;
    const cancelledOrders = orders.filter(order => order.status === "Отменен").length;

    // Возврат иконок статусов
    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Завершен":
                return (
                    <div className="status-icon-wrapper completed">
                        <FaCheckCircle />
                    </div>
                );
            case "В процессе":
                return (
                    <div className="status-icon-wrapper in-progress">
                        <FaHourglassHalf />
                    </div>
                );
            case "Отменен":
                return (
                    <div className="status-icon-wrapper cancelled">
                        <FaTimesCircle />
                    </div>
                );
            default:
                return null;
        }
    };

    const handleOrderClick = (id: string) => {
        navigate(`/order/${id}`);
    };

    return (
        <div className="orders">
            <header className="orders__header">
                <input
                    type="text"
                    placeholder="Поиск по клиенту или номеру заказа"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="orders__search"
                />
                <button className="orders__add-btn" onClick={() => setIsModalOpen(true)}>
                    Добавить заказ
                </button>
            </header>

            <section className="orders__stats">
                <div className="orders__stats-item">
                    <span className="orders__stats-number">{totalOrders}</span>
                    <span className="orders__stats-label">Всего заказов</span>
                </div>
                <div className="orders__stats-item">
                    <span className="orders__stats-number">{completedOrders}</span>
                    <span className="orders__stats-label">Выполнено</span>
                </div>
                <div className="orders__stats-item">
                    <span className="orders__stats-number">{inProgressOrders}</span>
                    <span className="orders__stats-label">В процессе</span>
                </div>
                <div className="orders__stats-item">
                    <span className="orders__stats-number">{cancelledOrders}</span>
                    <span className="orders__stats-label">Отменено</span>
                </div>
            </section>

            <div className="orders__list">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                        <div
                            key={order.id}
                            className="orders__card"
                            onClick={() => handleOrderClick(order.id)}
                        >
                            <div className="orders__status">{getStatusIcon(order.status)}</div>
                            <div className="orders__info">
                                <p className="orders__total">{order.total} ₽</p>
                                <p className="orders__date">
                                {order.date.split("-").reverse().join(".")}
                                </p>
                                <p className="orders__client">{getClientNameById(order.clientId)}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="orders__no-data">Ничего не найдено</p>
                )}
            </div>
            {isModalOpen && <ModalWindowAddOrder onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default Orders;
