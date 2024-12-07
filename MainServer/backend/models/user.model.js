import { pool, poolConnect } from '../db/db.config.js'

import sql from 'mssql';
import dotenv from 'dotenv'
dotenv.config()

export async function createUser({ email, password, verificationToken, verificationTokenExpiresAt }) {
    await poolConnect;
    const request = pool.request();
    
    request.input('email', sql.VarChar, email);
    request.input('password', sql.VarChar, password);

    const userInsertResult = await request.query(
        `INSERT INTO [${process.env.DB_DATABASE}].[dbo].users (email, password) 
        VALUES (@email, @password); 
        SELECT SCOPE_IDENTITY() AS insertId;`
    );

    const insertId = userInsertResult.recordset[0].insertId;

    const secondRequest = pool.request();
    await secondRequest.query(`DELETE FROM [Database].[dbo].EmailVerificationTokens WHERE userId=${insertId}`);

    const thirdRequest = pool.request();
    thirdRequest.input('userId', sql.Int, insertId);
    thirdRequest.input('verificationToken', sql.VarChar, verificationToken);
    thirdRequest.input('verificationTokenExpiresAt', sql.DateTime, verificationTokenExpiresAt);

    await thirdRequest.query(
        `INSERT INTO [${process.env.DB_DATABASE}].[dbo].EmailVerificationTokens (userId, verificationToken, verificationTokenExpiresAt) 
        VALUES (@userId, @verificationToken, @verificationTokenExpiresAt);`
    );

    return insertId;
}

export async function deleteUserById(id) {
    await poolConnect;
    const request = pool.request();

    await request.query(`DELETE FROM [Database].[dbo].users WHERE id=${id}`);
}

export async function findUserById(id) {
    await poolConnect;
    const request = pool.request();
    request.input('id', sql.Int, id);

    const result = await request.query(`SELECT * FROM [${process.env.DB_DATABASE}].[dbo].users WHERE id = @id`);
    return result.recordset[0];
}

export async function findUserByEmail(email) {
    await poolConnect;
    const request = pool.request();
    request.input('email', sql.VarChar, email);

    const result = await request.query(`SELECT id, email, password, lastLogin, isVerified FROM [${process.env.DB_DATABASE}].[dbo].users WHERE email = @email`);
    return result.recordset[0]; 
}

export async function findUserByVerificationToken(token) {
    await poolConnect;
    const request = pool.request();
    request.input('verificationToken', sql.VarChar, token);

    const result = await request.query(`
        SELECT id, email, lastLogin, isVerified
        FROM [${process.env.DB_DATABASE}].[dbo].users INNER JOIN [${process.env.DB_DATABASE}].[dbo].EmailVerificationTokens 
        ON [${process.env.DB_DATABASE}].[dbo].EmailVerificationTokens.userId = [${process.env.DB_DATABASE}].[dbo].users.id WHERE verificationToken = @verificationToken
        `);
    return result.recordset[0]; 
}

export async function findUserByResetPasswordToken(token) {
    await poolConnect;
    const request = pool.request();
    request.input('resetPasswordToken', sql.VarChar, token);

    const result = await request.query(`SELECT userId, resetPasswordToken, resetPasswordExpiresAt FROM [${process.env.DB_DATABASE}].[dbo].PasswordResetTokens WHERE resetPasswordToken = @resetPasswordToken`);
    return result.recordset[0];
}

export async function updateLastLogin(userId) {
    await poolConnect;
    const request = pool.request();
    request.input('userId', sql.Int, userId);

    const result = await request.query(`UPDATE [${process.env.DB_DATABASE}].[dbo].users SET lastLogin = GETDATE() WHERE id = @userId`);
    return result.rowsAffected[0] > 0;
}

export async function verifyUser(userId) {
    await poolConnect;
    const request = pool.request();
    request.input('userId', sql.Int, userId);

    const result = await request.query(`UPDATE [${process.env.DB_DATABASE}].[dbo].users SET isVerified = 1 WHERE id = @userId`);

    const secondRequest = pool.request();

    await secondRequest.query(`DELETE FROM [Database].[dbo].EmailVerificationTokens WHERE userId=${userId}`);
    return result.rowsAffected[0] > 0; 
}

export async function forgotPasswordUser(userId, resetPasswordToken, resetPasswordExpiresAt) {
    await poolConnect;
    const request = pool.request();
    request.input('userId', sql.Int, userId);
    request.input('resetPasswordToken', sql.VarChar, resetPasswordToken);
    request.input('resetPasswordExpiresAt', sql.DateTime, resetPasswordExpiresAt);

    const secondRequest = pool.request();
    await secondRequest.query(`DELETE FROM [Database].[dbo].PasswordResetTokens WHERE userId=${userId}`);

    const result = await request.query(`
        INSERT INTO [${process.env.DB_DATABASE}].[dbo].PasswordResetTokens 
        (userId, resetPasswordToken, resetPasswordExpiresAt) VALUES (@userId, @resetPasswordToken, @resetPasswordExpiresAt)
        `);
    return result.rowsAffected[0] > 0;
}

export async function resetPasswordUser(userId, hashedPassword) {
    await poolConnect;
    const request = pool.request();
    request.input('userId', sql.Int, userId);

    const result = await request.query(`UPDATE [${process.env.DB_DATABASE}].[dbo].users SET password = '${hashedPassword}' WHERE id = @userId`);


    const secondRequest = pool.request();
    secondRequest.input('userId', sql.Int, userId);
    await secondRequest.query(`DELETE FROM [Database].[dbo].PasswordResetTokens WHERE userId = @userId`);
    return result.rowsAffected[0] > 0; 
}
