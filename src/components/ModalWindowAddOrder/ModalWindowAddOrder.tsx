import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { addOrder } from "../../store/slices/ordersSlice";
import { v4 as uuidv4 } from "uuid";

import "./ModalWindowAddOrder.scss";

type ModalProps = {
    onClose: () => void;
};

const ModalWindowAddOrder = ({onClose}: ModalProps) => {
    const clients = useSelector((state: RootState) => state.clients.clients);
    const dispatch: AppDispatch = useDispatch();

    const [formData, setFormData] = useState({
        clientId: "",
        total: "",
        notes: "",
    })

    const [errors, setErrors] = useState({
        clientId: "",
        total: "",
    });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };


    const validateForm = () => {
        const newErrors = {
            clientId: "",
            total: "",
        };

        if (!formData.clientId) {
            newErrors.clientId = "Пожалуйста, выберите клиента.";
        }

        if (!formData.total.trim() || Number(formData.total) <= 50) {
            newErrors.total = "Пожалуйста, введите корректную сумму (больше 50).";
        }

        setErrors(newErrors);
        return !newErrors.clientId && !newErrors.total;
    };

    const handleAddOrder = () => {
        if (!validateForm()) {
            return;
        }

        const newOrder = {
            id: uuidv4(),
            clientId: formData.clientId,
            orderNumber: `ORD${Math.random().toString().slice(2, 8)}`,
            status: "В процессе",
            date: new Date().toISOString().split("T")[0],
            total: formData.total,
            notes: formData.notes,
        };

        dispatch(addOrder(newOrder));
        onClose();
    };



    return(
        <div className="modal" onClick={handleOverlayClick}>
            <div className="modal__content">
                <button className="modal__close" onClick={onClose}>
                    ✖
                </button>
                <form className="modal__form">
                    <div className="modal__form-group">
                        <label>
                            Клиент
                            <select
                                name="clientId"
                                value={formData.clientId}
                                onChange={(e) => handleChange(e)}
                                required
                            >
                                <option value="">Выберите клиента</option>
                                {clients.map(client => (
                                <option key={client.id} value={client.id}>
                                    {client.name}
                                </option>
                                ))}
                            </select>
                            {errors.clientId && <p className="modal__error">{errors.clientId}</p>}
                        </label>
                    </div>
                    <div className="modal__form">
                        <label>
                            Сумма
                            <input
                                type="number"
                                name="total"
                                placeholder="Введите сумму"
                                value={formData.total}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        {errors.total && <p className="modal__error">{errors.total}</p>}
                    </div>
                    <div className="modal__form">
                        <label>
                            Oписание
                            <input
                                type="text"
                                name="notes"
                                placeholder="Введите описание"
                                value={formData.notes}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <button
                        type="button"
                        className="modal__add-btn"
                        onClick={handleAddOrder}
                    >
                        Добавить заказ
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ModalWindowAddOrder;