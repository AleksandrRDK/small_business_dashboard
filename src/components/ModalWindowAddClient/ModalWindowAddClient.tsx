import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { addClient } from "../../store/slices/clientsSlice";
import { v4 as uuidv4 } from "uuid";
import "./ModalWindowAddClient.scss";

type ModalProps = {
  onClose: () => void;
};

const ModalWindowAddClient = ({ onClose }: ModalProps) => {
  const dispatch: AppDispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // Закрытие по нажатию на Esc
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Закрытие по клику вне модального окна
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Обработчик изменения input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Добавление нового клиента
  const validateForm = () => {
    const newErrors = {
      name: "",
      phone: "",
      email: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Пожалуйста, введите ФИО.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Пожалуйста, введите телефон.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Пожалуйста, введите почту.";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.phone && !newErrors.email;
  };

  const handleAddClient = () => {
    if (!validateForm()) {
      return;
    }

    const newClient = {
      id: uuidv4(),
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: "Адрес не указан",
      registrationDate: new Date().toISOString().split("T")[0],
      notes: "",
      favorites: false,
    };

    dispatch(addClient(newClient));
    onClose();
  };

  return (
    <div className="modal" onClick={handleOverlayClick}>
      <div className="modal__content">
        <button className="modal__close" onClick={onClose}>
          ✖
        </button>
        <form className="modal__form" onSubmit={(e) => e.preventDefault()}>
          <label>
            <strong>ФИО</strong>
            <input
              type="text"
              name="name"
              placeholder="Введите ФИО"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            {errors.name && <p className="modal__error">{errors.name}</p>}
          </label>
          <label>
            <strong>Телефон</strong>
            <input
              type="tel"
              name="phone"
              placeholder="Введите телефон"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            {errors.phone && <p className="modal__error">{errors.phone}</p>}
          </label>
          <label>
            <strong>Почта</strong>
            <input
              type="email"
              name="email"
              placeholder="Введите почту"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            {errors.email && <p className="modal__error">{errors.email}</p>}
          </label>
          <button
            type="button"
            className="modal__add-btn"
            onClick={handleAddClient}
          >
            Добавить клиента
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalWindowAddClient;
