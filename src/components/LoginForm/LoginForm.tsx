import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
} from "firebase/auth";
import "./LoginForm.scss";
import "../../styles/Spinner.scss";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [resetEmailSent, setResetEmailSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email) {
      setError("Введите email.");
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Некорректный email.");
      setIsLoading(false);
      return;
    }

    if (password.trim().length < 8) {
      setError("Пароль должен быть не менее 8 символов.");
      setPassword("");
      setIsLoading(false);
      return;
    }

    const auth = getAuth();
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password.trim());
      navigate("/dashboard/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        const errorCode = (err as { code?: string }).code;
        switch (errorCode) {
          case "auth/user-not-found":
            setError("Пользователь не найден. Проверьте введённый email.");
            break;
          case "auth/wrong-password":
            setError("Неверный пароль. Проверьте, не ошиблись ли вы при вводе.");
            break;
          case "auth/invalid-credential":
            setError("Неверные учетные данные. Проверьте, что email и пароль введены корректно.");
            break;
          default:
            setError("Произошла ошибка. Попробуйте снова.");
        }
      } else {
        setError("Произошла ошибка. Попробуйте снова.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    const auth = getAuth();
    if (!email) {
      setError("Введите e-mail для сброса пароля.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      setError("");
    } catch (err: unknown) {
      const errorMessage = (err as { message?: string }).message || "Ошибка при сбросе пароля.";
      setError(errorMessage);
      setResetEmailSent(false);
    }
  };

  return (
    <div className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <h2 className="login__header">Войдите</h2>
        {error && <p className="login__error">{error}</p>}
        {resetEmailSent && <p className="login__success">Письмо для сброса пароля отправлено!</p>}

        <input
          className="login__input"
          type="email"
          placeholder="Введите e-mail"
          autoComplete="username"
          aria-label="Email"
          value={email}
          onChange={(e) => {
            const sanitizedEmail = e.target.value.replace(/\s/g, "");
            setEmail(sanitizedEmail);
          }}
        />

        <input
          className="login__input"
          type="password"
          placeholder="Введите пароль"
          autoComplete="current-password"
          aria-label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value.replace(/\s/g, ""))}
        />

        <div className="login__field">
          <div className="login__checkbox-container">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Запомнить меня
            </label>
          </div>
          <button
            type="button"
            className="login__forgot-password"
            onClick={handlePasswordReset}
          >
            Забыли пароль?
          </button>
        </div>
        <button type="submit" className="login__button" disabled={isLoading}>
          {isLoading ? <div className="spinner"></div> : "Войти"}
        </button>
        <div className="login__register-link">
          <span>Нет аккаунта? </span>
          <Link to="/register">Зарегистрироваться</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
