import "./Header.scss";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

const Header = () => {
    const location = useLocation();
    const indicatorRef = useRef<HTMLSpanElement | null>(null);

    const handleIndicator = (activeItem: HTMLElement) => {
        const indicator = indicatorRef.current;

        if (indicator) {
            indicator.style.width = `${activeItem.offsetWidth}px`;
            indicator.style.left = `${activeItem.offsetLeft}px`;
        }
    };

    useEffect(() => {
        const activeItem = document.querySelector<HTMLAnchorElement>(".is-active");
        if (activeItem) {
            handleIndicator(activeItem);
        }
    }, [location]);

    return (
        <div className="header">
            <div className="header__logo">
                <span>Dashboard</span>
            </div>
            <nav className="nav">
                <Link
                    to="/clients"
                    className={`nav-item ${location.pathname.startsWith("/clients") ? "is-active" : ""}`}
                >
                    Клиенты
                </Link>
                <Link
                    to="/orders"
                    className={`nav-item ${location.pathname === "/orders" ? "is-active" : ""}`}
                >
                    Заказы
                </Link>
                <Link
                    to="/statistic"
                    className={`nav-item ${location.pathname.startsWith("/statistic") ? "is-active" : ""}`}
                >
                    Аналитика
                </Link>
                <span className="nav-indicator" ref={indicatorRef}></span>
            </nav>
        </div>
    );
};

export default Header;
