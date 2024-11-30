import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import "./Statistic.scss";

const Statistic = () => {
    const orders = useSelector((state: RootState) => state.orders.orders);
    const clients = useSelector((state: RootState) => state.clients.clients);

    // Данные для графика по количеству заказов за день/неделю/месяц
    const orderCountData = orders.reduce((acc, order) => {
        const date = new Date(order.date).toLocaleDateString('ru-RU');
        const existingDate = acc.find(item => item.date === date);
        if (existingDate) {
            existingDate.count += 1;
        } else {
            acc.push({ date, count: 1 });
        }
        return acc;
    }, [] as { date: string, count: number }[]);

    // Средняя сумма заказа
    const averageOrderAmount = orders.reduce((acc, order) => acc + parseFloat(order.total), 0) / orders.length;

    // Частота повторных покупок
    const repeatBuyersCount = clients.filter(client => {
        const clientOrders = orders.filter(order => String(order.clientId) === client.id);
        return clientOrders.length > 1;
    }).length;
    const totalClients = clients.length;
    const repeatPurchaseRate = (repeatBuyersCount / totalClients) * 100;

    // Среднее количество заказов на клиента
    const averageOrdersPerClient = totalClients > 0 ? orders.length / totalClients : 0;

    // Данные для диаграммы распределения клиентов
    const clientDistributionData = [
        { name: "Постоянные", value: clients.filter(client => client.favorites).length },
        { name: "Новые", value: clients.length - clients.filter(client => client.favorites).length }
    ];
    const COLORS = ["#1E90FF", "#FF6347"];

    return (
        <div className="statistic">
            <h1 className="statistic__title">Аналитика</h1>

            <div className="statistic__cards">
                <div className="statistic__card">
                    <h3>Клиенты</h3>
                    <p>{totalClients}</p>
                </div>
                <div className="statistic__card">
                    <h3>Заказы</h3>
                    <p>{orders.length}</p>
                </div>
                <div className="statistic__card">
                    <h3>Общий доход</h3>
                    <p>{orders.reduce((acc, order) => acc + parseFloat(order.total), 0).toLocaleString()} ₽</p>
                </div>
                <div className="statistic__card">
                    <h3>Средний чек</h3>
                    <p>{averageOrderAmount.toFixed(2)} ₽</p>
                </div>
                <div className="statistic__card">
                    <h3>Частота повторных покупок</h3>
                    <p>{repeatPurchaseRate.toFixed(2)}%</p>
                </div>
                <div className="statistic__card">
                    <h3>Среднее количество заказов на клиента</h3>
                    <p>{averageOrdersPerClient.toFixed(2)}</p>
                </div>
            </div>

            <div className="statistic__charts">
                <div className="statistic__chart">
                    <h3>Динамика заказов</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={orderCountData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#1E90FF" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="statistic__diagram">
                    <h3>Распределение клиентов</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={clientDistributionData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label
                            >
                                {clientDistributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Statistic;
