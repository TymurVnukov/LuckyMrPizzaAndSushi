import React, { useEffect, useState } from "react";
import { useMenuStore, IMAGE_STORAGE_API_URL } from "../../store/menuStore";
import styles from './MyOrdersPage.module.css';

import Header from "../Header.jsx"

const MyOrdersPage = () => {
    const { error, message, showMyOrders, userOrders } = useMenuStore();
    const [loading, setLoading] = useState(true);

    const [expandedOrder, setExpandedOrder] = useState(null);

    const toggleOrderDetails = (index) => {
        setExpandedOrder(expandedOrder === index ? null : index);
    };

    const ShowMyOrders = async () => {
        try {
            await showMyOrders();
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        ShowMyOrders();
    }, []);

    return (
        <div>
            <Header/>
            <div className="underHeader">s</div>
            {loading ? (
                <div className={styles.loading}>Loading...</div>
            ) : error ? (
                <div className={styles.error}>Error: {error}</div>
            ) : (
                <div className={styles.orderContainer}>
                    {userOrders.map((order, index) => (
                        <div key={index} className={styles.order}>
                            <div
                                className={styles.orderHeader}
                                onClick={() => toggleOrderDetails(index)}
                            >
                                <p>Date: {order.info.date} &darr;</p>
                                <p><strong>Status:</strong> {order.info.statusName}</p>
                            </div>
                            <div
                                className={`${styles.orderDetails} ${
                                    expandedOrder === index ? styles.expanded : ''
                                }`}
                            >
                                <p><strong>Name:</strong> {order.info.name}</p>
                                <p><strong>Phone:</strong> {order.info.phoneNumber}</p>
                                <p><strong>City:</strong> {order.info.city}</p>
                                <p><strong>Address:</strong> {order.info.address}</p>
                                <p><strong>Payment Method:</strong> {order.info.paymentMethod}</p>
                            </div>
                            <div className={styles.products}>
                                {order.products.map((product, ind) => (
                                    <div key={ind} className={styles.product}>
                                        <img
                                            src={`${IMAGE_STORAGE_API_URL}/${product.imagePath}`}
                                            alt={product.name}
                                            className={styles.productImage}
                                        />
                                        <div>
                                            <p className={styles.productName}>{product.name}</p>
                                            <p>{product.quantity} x ${product.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default MyOrdersPage;
