import "./Header.scss";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Header: React.FC = () => {
    const location = useLocation();
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
    const validPaths = ["/dashboard", "/clients", "/orders", "/statistic"];

    useEffect(() => {
        const activeItem = document.querySelector(".nav-item.is-active") as HTMLElement | null;
        if (activeItem) {
            const { offsetWidth, offsetLeft } = activeItem;
            setIndicatorStyle({
                width: `${offsetWidth}px`,
                left: `${offsetLeft}px`,
            });
        }
    }, [location]);

    const getActiveClass = (path: string): string => {
        if (!validPaths.includes(location.pathname) && path === "/dashboard") {
            return "is-active";
        }
        return location.pathname === path ? "is-active" : "";
    };

    return (
        <header className="header">
            <div className="header__logo">
                <Link to="/dashboard">Dashboard</Link>
            </div>
            <nav className="nav">
                <Link to="/dashboard" className={`nav-item ${getActiveClass("/dashboard")}`}>
                    Главная
                </Link>
                <Link to="/clients" className={`nav-item ${getActiveClass("/clients")}`}>
                    Клиенты
                </Link>
                <Link to="/orders" className={`nav-item ${getActiveClass("/orders")}`}>
                    Заказы
                </Link>
                <Link to="/statistic" className={`nav-item ${getActiveClass("/statistic")}`}>
                    Аналитика
                </Link>
                <span className="nav-indicator" style={indicatorStyle}></span>
            </nav>
        </header>
    );
};

export default Header;