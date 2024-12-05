import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import "./RegistrationForm.scss";

const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!validateName(name)) {
      setError("Имя должно содержать не менее 2 символов.");
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Некорректный email.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Пароль должен быть не менее 8 символов.");
      setIsLoading(false);
      return;
    }

    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name.trim() });
      navigate("/dashboard/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        const errorCode = (err as { code?: string }).code;
        switch (errorCode) {
          case "auth/email-already-in-use":
            setError("Этот email уже используется.");
            break;
          case "auth/weak-password":
            setError("Пароль слишком слабый. Попробуйте более сложный.");
            break;
          case "auth/invalid-email":
            setError("Некорректный email.");
            break;
          default:
            setError("Произошла ошибка. Попробуйте снова.");
        }
      } else {
        setError("Неизвестная ошибка. Попробуйте снова.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <h2 className="login__header">Зарегистрируйтесь</h2>
        {error && <p className="login__error">{error}</p>}

        <input
          className="login__input"
          type="text"
          placeholder="Введите ваше имя"
          autoComplete="name"
          aria-label="Name"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value.replace(/\s/g, ""))}
        />

        <input
          className="login__input"
          type="email"
          placeholder="Введите e-mail"
          autoComplete="username"
          aria-label="Email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value.replace(/\s/g, ""))}
        />

        <input
          className="login__input"
          type="password"
          placeholder="Введите пароль"
          autoComplete="current-password"
          aria-label="Password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value.replace(/\s/g, ""))}
        />

        <button type="submit" className="login__button" disabled={isLoading}>
          {isLoading ? <div className="spinner"></div> : "Зарегистрироваться"}
        </button>
        <div className="login__register-link">
          <span>Есть аккаунт? </span>
          <Link to="/login">Войти</Link>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
