import "./Dashboard.scss";
import { getAuth, signOut, updatePassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [newName, setNewName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();

    const getGreeting = (): string => {
        const currentHour = new Date().getHours();
        if (currentHour >= 5 && currentHour < 12) return "Доброе утро";
        if (currentHour >= 12 && currentHour < 18) return "Добрый день";
        if (currentHour >= 18 && currentHour < 22) return "Добрый вечер";
        return "Доброй ночи";
    };

    const formatName = (name: string | null | undefined): string => {
        if (!name) return "пользователь";
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    };

    const handlePasswordChange = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (newPassword.length < 8) {
            setError("Пароль должен быть минимум 8 символов.");
            return;
        }

        try {
            if (user) {
                await updatePassword(user, newPassword);
                setSuccess("Пароль успешно изменен!");
                setError(null);
                setIsEditingPassword(false);
                setNewPassword("");
            } else {
                setError("Пользователь не авторизован.");
            }
        } catch (err: unknown) {
            setError((err as Error).message || "Ошибка при обновлении пароля.");
            setSuccess(null);
        }
    };

    const handleNameChange = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (newName.length < 2) {
            setError("Имя должно быть минимум 2 символа.");
            return;
        }

        try {
            if (user) {
                await updateProfile(user, { displayName: newName });
                setSuccess("Имя успешно обновлено!");
                setError(null);
                setIsEditingName(false);
                setNewName("");
            } else {
                setError("Пользователь не авторизован.");
            }
        } catch (err: unknown) {
            setError((err as Error).message || "Ошибка при обновлении имени.");
            setSuccess(null);
        }
    };

    const handleLogout = async (): Promise<void> => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (err: unknown) {
            setError("Ошибка при выходе из аккаунта.");
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard__wrapper">
                <h1 className="dashboard__title">
                    {getGreeting()}, <span>{formatName(user?.displayName)}</span>!
                </h1>

                <div className="dashboard__section">
                    <h2>Хотите изменить имя?</h2>
                    {isEditingName ? (
                        <form onSubmit={handleNameChange} className="dashboard__form">
                            <input
                                type="text"
                                id="newName"
                                className="dashboard__input"
                                placeholder="Введите новое имя"
                                value={newName}
                                onChange={(e) =>
                                    setNewName(e.target.value.replace(/\s/g, ""))
                                }
                                required
                            />
                            <div className="dashboard__buttons">
                                <button type="submit" className="dashboard__form-button">
                                    Сохранить
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditingName(false);
                                        setNewName("");
                                        setError(null);
                                    }}
                                    className="dashboard__form-button dashboard__form-button--cancel"
                                >
                                    Отмена
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            onClick={() => setIsEditingName(true)}
                            className="dashboard__form-button"
                        >
                            Изменить имя
                        </button>
                    )}
                </div>

                <div className="dashboard__section">
                    <h2>Хотите изменить пароль?</h2>
                    {isEditingPassword ? (
                        <form onSubmit={handlePasswordChange} className="dashboard__form">
                            <input
                                type="password"
                                id="newPassword"
                                className="dashboard__input"
                                placeholder="Введите новый пароль"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value.replace(/\s/g, ""))
                                }
                                required
                            />
                            <div className="dashboard__buttons">
                                <button type="submit" className="dashboard__form-button">
                                    Сохранить
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditingPassword(false);
                                        setNewPassword("");
                                        setError(null);
                                    }}
                                    className="dashboard__form-button dashboard__form-button--cancel"
                                >
                                    Отмена
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            onClick={() => setIsEditingPassword(true)}
                            className="dashboard__form-button"
                        >
                            Изменить пароль
                        </button>
                    )}
                </div>

                {success && <p className="dashboard__success">{success}</p>}
                {error && <p className="dashboard__error">{error}</p>}

                <div className="dashboard__section">
                    <button onClick={handleLogout} className="dashboard__logout-button">
                        Выйти из аккаунта
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
