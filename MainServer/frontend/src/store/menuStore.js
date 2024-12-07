import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = "http://localhost:22903";
export const IMAGE_STORAGE_API_URL = "http://localhost:33903/download";

export const useMenuStore = create((set) => ({
    error: null,
    message: null,
    menuList: [],
    menuItem: null,
	isSuccessOrder: false,
    userOrders: [],

    showMenu: async (categoryName) => {
        set({ error: null });
        try {
            const response = await axios.get(`${API_URL}/menu/${categoryName}`);
            set({ error: null, menuList: response.data.menuList });
        } catch (error) {
            set({ error: error.response.data.message || "Error showMenu"});
            throw error;
        }
    },
    showMenuItem: async (itemName) => {
        set({ error: null });
        try {
            const response = await axios.get(`${API_URL}/menu/item/${itemName}`);
            console.log(response)
            set({ error: null, menuItem: response.data.menuItem});
        } catch (error) {
            set({ error: error.response.data.message || "Error showMenu"});
            throw error;
        }
    },
    placeOrder: async (userInfo, idOrderList) => {
        set({ error: null });
        try {
            const requestBody = {
                userInfo,
                idOrderList
            };

            const response = await axios.post(`${API_URL}/checkout`, requestBody);
            set({ error: null, message: "Successful checkout", isSuccessOrder: true });
        } catch (error) {
            if (error.response && error.response.data) {
                set({ error: error.response.data.message || "Fill all field correctly." });
            } else {
                set({ error: "An unknown error occurred." });
            }
            throw error;
        }
    },
    showMyOrders: async () => {
        set({ error: null });
        try {
            const response = await axios.get(`${API_URL}/myorders`);
            let result = [];
            response.data.userOrders.info.forEach(element => {
                const items = response.data.userOrders.order.filter(item => item.orderId === element.id);
                result.push({info: element, products: items})
            });
            console.log(result)
            set({ error: null, userOrders: result});
        } catch (error) {
            set({ error: error.response.data.message || "Error showMenu"});
            throw error;
        }
    }
}));