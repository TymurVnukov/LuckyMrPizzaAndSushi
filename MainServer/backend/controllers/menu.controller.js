import axios from 'axios';
import { selectMenu, selectMenuItem, insertOrder, selectUserOrders } from '../models/menu.model.js';

export const showMenu = async (req, res) => {
    const { categoryName } = req.params

    try {
        const menuList = await selectMenu(categoryName);
        
        res.status(201).json({
            success: true,
            message: 'Show menu successfully',
            menuList: menuList,
        });
    } catch (error) {
        console.log('Error in show menu: ', error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const showMenuItem = async (req, res) => {
    const { itemName } = req.params

    try {
        const menuItem = await selectMenuItem(itemName);
        
        res.status(201).json({
            success: true,
            message: 'Show menu successfully',
            menuItem: menuItem,
        });
    } catch (error) {
        console.log('Error in show menu: ', error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const checkout = async (req, res) => {
    const { userInfo, idOrderList } = req.body;
    const userId = req.userId;
    try {
        const fieldErrors = {};
        if (!userInfo.name || userInfo.name.trim() === "") {
            fieldErrors.name = "Name is required";
        }
        if (!userInfo.phoneNumber || !/^\d{10}$/.test(userInfo.phoneNumber)) {
            fieldErrors.phoneNumber = "Phone number is invalid";
        }
        if (!userInfo.city || userInfo.city.trim() === "") {
            fieldErrors.city = "City is required";
        }
        if (!userInfo.address || userInfo.address.trim() === "") {
            fieldErrors.address = "Address is required";
        }
        if(!idOrderList || idOrderList == [] || idOrderList.length <= 0) {
            fieldErrors.orderList = "Product is required"
        }
        if (Object.keys(fieldErrors).length > 0) {
            return res.status(400).json({ fieldErrors });
        }

        const insertResult = await insertOrder(userId, userInfo, idOrderList);
        if(insertResult == true){
            res.status(200).json({ success: true, message: "Checkout successful" });
        }
        else {
            res.status(400).json({ success: false, message: "Product id out of range" });
        }
    } catch (error) {
        console.log("Error in checkout: ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const myorders = async (req, res) => {
    const userId = req.userId;
    let userOrders = null;
    try {
        let response = await selectUserOrders(userId);
        if(response != undefined) {
            userOrders = response;
        }
        res.status(200).json({ 
            success: true, 
            message: "My orders show successful",
            userOrders: userOrders
        });
    } catch (error) {
        console.log("Error in my orders: ", error);
        res.status(400).json({ success: false, message: error.message });
    }
}