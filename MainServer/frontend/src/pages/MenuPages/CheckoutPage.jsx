import React, { useEffect, useState } from "react";
import { useMenuStore, IMAGE_STORAGE_API_URL } from "../../store/menuStore";
import styles from './CheckoutPage.module.css';
import Header from "../Header.jsx"

const CheckoutPage = () => {
    const { error, message, isSuccessOrder, placeOrder } = useMenuStore();
    const [orderList, setOrderList] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        city: '',
        address: '',
        paymentMethod: 'Credit Card',
    });
    const [fieldErrors, setFieldErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFieldErrors({ ...fieldErrors, [name]: '' });
    };

    const CalculateTotal = () => {
        return orderList.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    const PlaceOrder = async () => {
        try {
            const idOrderList = orderList.map(item => ({
                id: item.id,
                count: item.quantity
            }));
            console.log(idOrderList)
            await placeOrder(formData, idOrderList);
            setOrderList([]);
            localStorage.removeItem('orderList');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.fieldErrors) {
                setFieldErrors(error.response.data.fieldErrors);
            }
        }
    };

    useEffect(() => {
        const storedOrderList = JSON.parse(localStorage.getItem('orderList')) || [];
        setOrderList(storedOrderList);
    }, []);

    return (
        <div>
            <Header/>
            <div className="underHeader"></div>

            <div className={styles['checkout-container']}>
                {!isSuccessOrder &&
                    <section>
                        <div className={styles['checkout-form']}>
                            <h2>Customer Information</h2>
                            <label>
                                Name:
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                                {fieldErrors.name && <p className={styles['error-message']}>{fieldErrors.name}</p>}
                            </label>
                            <label>
                                Phone Number:
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                                {fieldErrors.phoneNumber && <p className={styles['error-message']}>{fieldErrors.phoneNumber}</p>}
                            </label>
                            <label>
                                City:
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                                {fieldErrors.city && <p className={styles['error-message']}>{fieldErrors.city}</p>}
                            </label>
                            <label>
                                Address:
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                                {fieldErrors.address && <p className={styles['error-message']}>{fieldErrors.address}</p>}
                            </label>
                            <label>
                                Payment Method:
                                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange}>
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="PayPal">PayPal</option>
                                    <option value="Cash on Delivery">Cash on Delivery</option>
                                </select>
                            </label>
                        </div>

                        <div id="checkout-order-list-menu" className={styles['checkout-order-list-menu']}>
                            {orderList.map((orderItem, index) => (
                                <div className={styles['order-item']} key={index}>
                                    <div className={styles['order-item-image-container']}>
                                        <img
                                            src={`${IMAGE_STORAGE_API_URL}/${orderItem.imagePath}`}
                                            alt="Product"
                                            className={styles['order-item-image']}
                                        />
                                    </div>
                                    <div className={styles['order-item-details']}>
                                        <h2 className={styles['order-item-name']}>{orderItem.name}</h2>
                                        <p className={styles['order-item-description']}>{orderItem.description}</p>
                                        <span className={styles['order-item-price']}>${(orderItem.price * orderItem.quantity).toFixed(2)} x{orderItem.quantity}</span>
                                    </div>
                                </div>
                            ))}
                            <h1>Total: ${CalculateTotal()}</h1>
                        </div>

                        <button className={styles['checkout-button']} onClick={PlaceOrder}>Place Order</button>
                    </section>
                }

                {error && <p className={styles['error-message']}>Error: {error}</p>}
                {isSuccessOrder && (
                    <div className={styles['success-message']}>
                        <div className={styles['check-mark']}>&#10004;</div>
                        <div className={styles['message-text']}>Success! Your order was placed successfully.</div>
                        <a href="/" className={styles['menu-button']}>Go to Home</a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutPage;
