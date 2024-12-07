import { pool, poolConnect } from '../db/db.config.js'

import sql from 'mssql';
import dotenv from 'dotenv'
dotenv.config()

export async function selectMenu(categoryName) {
    await poolConnect;

    const requestCategory = pool.request();
    const resultCategory = await requestCategory.query(`SELECT id, name FROM [${process.env.DB_DATABASE}].[dbo].MenuCategory`);
    
    const categoryId = isInArr(resultCategory, categoryName, 'name');
    if(categoryId == false) {
        return [];
    }

    const requestMenu = pool.request();
    const resultMenu = await requestMenu.query(`SELECT * FROM [${process.env.DB_DATABASE}].[dbo].Menu where categoryId=${categoryId}`);
    return resultMenu.recordset; // Return or undefined
}

export async function selectMenuItem(itemName) {
    await poolConnect;

    const requestMenuItems = pool.request();
    const resultMenuItems = await requestMenuItems.query(`SELECT id, imagePath FROM [${process.env.DB_DATABASE}].[dbo].Menu`);
    
    const itemId = isInArr(resultMenuItems, itemName, 'imagePath');
    if(itemId == false) {
        return [];
    }

    const requestItem = pool.request();
    const resultitem = await requestItem.query(`SELECT * FROM [${process.env.DB_DATABASE}].[dbo].Menu where id=${itemId}`);
    return resultitem.recordset; // Return or undefined
}

function isInArr(arr, item, property) {
    for (const category of arr.recordset) {
        if (category[property] === item) {
            return category.id;
        }
    }
    return false;
}

export async function insertOrder(userId, userInfo, idOrderList) {
    await poolConnect;
    const request = pool.request();

    let query = 
        `
        DECLARE @OrderId INT;
        INSERT INTO [${process.env.DB_DATABASE}].[dbo].Orders (userId, name, phoneNumber, city, address, paymentMethod)
        VALUES (${userId}, '${userInfo.name}', '${userInfo.phoneNumber}', '${userInfo.city}', '${userInfo.address}', '${userInfo.paymentMethod}');
        SET @OrderId = SCOPE_IDENTITY();
        BEGIN TRY
            INSERT INTO [Database].[dbo].OrderItem (userId, orderId, productId, quantity)
            VALUES
        `;
        idOrderList.forEach(element => {
            query += `(${userId}, @OrderId, ${element.id}, ${element.count}),`
        });
        query = query.slice(0, -1) + `SELECT CAST(1 AS BIT) AS Result;`;
        query += `
        END TRY
        BEGIN CATCH
            DELETE FROM [Database].[dbo].Orders WHERE id = @OrderId;
            SELECT CAST(0 AS BIT) AS Result;
        END CATCH
        `;
    
    const response = await request.query(query);
    return response.recordset[0].Result;
}

export async function selectUserOrders(userId) {
    let resultOrdersInfo, resultOrdersItem;
    await poolConnect;

    const requestOrdersInfo = pool.request();
    resultOrdersInfo = await requestOrdersInfo.query(`
        SELECT o.id, o.userId, o.name, o.phoneNumber, o.city, o.address, o.paymentMethod, o.date, os.statusName 
        FROM [${process.env.DB_DATABASE}].[dbo].Orders as o 
        INNER JOIN [${process.env.DB_DATABASE}].[dbo].OrderStatus as os 
        ON o.statusId=os.id 
        WHERE o.userId=${userId}
        ORDER BY o.id DESC
        `);
        resultOrdersInfo.recordset = resultOrdersInfo.recordset.map(order => {
            const formattedDate = new Date(order.date)
                .toISOString()
                .slice(0, 16)
                .replace("T", " ");
            return { ...order, date: formattedDate };
        });

    const requestOrdersItem = pool.request();
    resultOrdersItem = await requestOrdersItem.query(`
        SELECT oi.orderId, oi.productId, oi.quantity, m.name, m.description, m.price, m.imagePath 
        FROM [${process.env.DB_DATABASE}].[dbo].OrderItem as oi
        INNER JOIN [Database].[dbo].Menu as m
        ON oi.productId = m.id 
        WHERE oi.userId = ${userId}
        `);

    return { info: resultOrdersInfo.recordset, order: resultOrdersItem.recordset };
}