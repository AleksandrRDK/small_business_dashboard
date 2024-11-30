
import { useNavigate } from "react-router-dom";
import "./LoginForm.scss"

const LoginForm = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/clients/')
    }


    return (
      <div className="login">
        <form className="login__form">
            <h2 className="login__header">Зарегестрируйтесь или войдите</h2>
            <input
                className="login__input"
                type="email"
                placeholder="Введите e-mail"
                autoComplete="username"
                aria-label="Email"
            />
            <input
                className="login__input"
                type="password"
                placeholder="Введите пароль"
                autoComplete="current-password"
                aria-label="Password"
            />
            <div className="login__input">
                <input
                    type="checkbox"
                    id="rememberMe"
                    aria-label="Запомнить меня"
                />
                <label htmlFor="rememberMe" className="login__label-chekbox">Запомнить меня</label>
            </div>
            <button type="submit" className="login__button" onClick={() => {handleClick()}}>Войти</button>
            <a href="/forgot-password" className="login__forgot-password">
                Забыли пароль?
            </a>
        </form>
      </div>
    );
  };

  export default LoginForm;
