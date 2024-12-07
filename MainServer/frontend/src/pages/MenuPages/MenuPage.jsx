import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMenuStore, IMAGE_STORAGE_API_URL } from "../../store/menuStore";
import styles from './MenuPage.module.css';
import Header from "../Header.jsx"

import trashIcon from '../../pictures/Trash_ICON.png';

const MenuPage = () => {
    const { showMenu, error, message, menuList } = useMenuStore();
    const { categoryName } = useParams();
    const [orderList, setOrderList] = useState([]);

    const ShowMenu = async () => {
        try {
            await showMenu(categoryName);
        } catch (error) {
            console.log(error);
        }
    };

    const removeFromCart = (index) => {
        const updatedOrderList = orderList.filter((_, i) => i !== index);
        setOrderList(updatedOrderList);
        localStorage.setItem('orderList', JSON.stringify(updatedOrderList));
    };

    const updateQuantity = (index, delta) => {
        const updatedOrderList = [...orderList];
        updatedOrderList[index].quantity += delta;
        if (updatedOrderList[index].quantity <= 0) {
            updatedOrderList.splice(index, 1);
        }
        setOrderList(updatedOrderList);
        localStorage.setItem('orderList', JSON.stringify(updatedOrderList));
    };

    useEffect(() => {
        const storedOrderList = JSON.parse(localStorage.getItem('orderList')) || [];
        setOrderList(storedOrderList);

        ShowMenu();
    }, []);

    return (
        <div>
            {error && <p>Error: {error}</p>}
            {message && <p>Message: {message}</p>}

            <Header/>
            <div className="underHeader"></div>

            {menuList && menuList.length > 0 ? (
                <div className={styles.marketplace}>
                    {menuList.map((item, index) => (
                        <div className={styles.product} key={index}>
                            <img src={`${IMAGE_STORAGE_API_URL}/${item.imagePath}`} alt={item.name} />
                            <h2>{item.name}</h2>
                            <p>{item.description}</p>
                            <p className={styles.price}>${item.price}</p>
                            <a href={`/menu/item/${item.imagePath}`}>Show more</a>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles['no-menu-body']}>
                    <div className={styles['no-menu-container']}>
                        <h1>No Menu Available</h1>
                        <p>We are currently updating our menu. Please check back later!</p>
                    </div>
                </div>
            )}

            <div className={styles.orderMenu}>
                <div className={styles.minimizedMenu}>
                    {orderList.map((orderItem, index) => (
                        <img
                            key={index}
                            src={`${IMAGE_STORAGE_API_URL}/${orderItem.imagePath}`}
                            alt="Product"
                            className={styles['order-item-image']}
                        />
                    ))}
                </div>
                <div className={styles.expandedMenu}>
                    <a href="/checkout" className={styles.checkoutButton}>Checkout</a>
                    {orderList.map((orderItem, index) => (
                        <div className={styles['order-item']} key={index}>
                            <img src={`${IMAGE_STORAGE_API_URL}/${orderItem.imagePath}`} alt="Product Image" className={styles['order-item-image']} />
                            <h2 className={styles['order-item-name']}>{orderItem.name}</h2>
                            <p className={styles['order-item-description']}>{orderItem.description}</p>
                            <div className={styles['quantity-controls']}>
                                <span className={styles['order-item-price']}>${(orderItem.price * orderItem.quantity).toFixed(2)}</span>
                                <button className={styles['quantity-button']} onClick={() => updateQuantity(index, -1)}>-</button>
                                <span className={styles['order-item-quantity']}>{orderItem.quantity}</span>
                                <button className={styles['quantity-button']} onClick={() => updateQuantity(index, 1)}>+</button>
                                <button className={styles['remove-button']} onClick={() => removeFromCart(index)}> <img src={trashIcon} alt="" /> </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MenuPage;
