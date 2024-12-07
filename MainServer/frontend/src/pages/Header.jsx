import React from "react";
import { useAuthStore } from "../store/authStore"
import './Header.css'

const Header = () => {
    const { user, logout } = useAuthStore();
    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await logout();
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <header>
            <div className="container">
                <a href="/"><div className="logo"></div></a>
                <nav>
                    <ul className="nav-menu">
                        <li><a href="/">Home</a></li>
                        <li className="dropdown">
                            <a href="#">Menu</a>
                            <ul className="dropdown-content">
                                <li><a href="/menu/sushi">Sushi</a></li>
                                <li><a href="/menu/pizza">Pizza</a></li>
                                <li><a href="/menu/burgers">Burgers</a></li>
                            </ul>
                        </li>
                        <li><a href="/myorders">My orders</a></li>
                        <li><a href="#">More</a></li>
                    </ul>
                </nav>
                <div className="user-menu">
                    {user && (
                        <>
                            <p>{user.email}</p>
                            <ul className="dropdown-content">
                                <li onClick={handleLogout}>
                                    <a href="/login">Log out</a>
                                </li>
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
