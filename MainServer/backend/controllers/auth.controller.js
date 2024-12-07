import bcryptjs from 'bcryptjs'
import crypto from 'crypto'

import { createUser, deleteUserById, findUserByEmail, findUserById, findUserByResetPasswordToken, findUserByVerificationToken, forgotPasswordUser, resetPasswordUser, updateLastLogin, verifyUser } from "../models/user.model.js"
import { generateTokenAndSetCookies } from '../utils/generateTokenAndSetCookies.js'
import { formatDateToSQL } from '../utils/formatDateToSQL.js'
import { sendPasswordResetEmail, sendVerificationEmail } from '../mailtrap/emails.js'


export const signup = async (req, res) => {
    const {email, password} = req.body
    try{
        
        if(email.length < 3 || !email.includes('@') || !email.includes('.')){
            return res.status(400).json({success:false, message: "E-Mail must be valid"});
        }
        if(password.length < 6){
            return res.status(400).json({success:false, message: "Password must be more that 6 char"});
        }
        
        const userAlreadyExists = await findUserByEmail(email)
        if(userAlreadyExists != undefined){
            return res.status(400).json({success:false, message: "User already exists"});
        }

        const hashedPassword = await bcryptjs.hash(password, 10)
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()

        const now = new Date();
        const futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const sqlDate = formatDateToSQL(futureDate);
        const verificationTokenExpiresAt = sqlDate;
        

        let insertId = await createUser(
            {
                email: email, 
                password: hashedPassword, 
                verificationToken: verificationToken, 
                verificationTokenExpiresAt: verificationTokenExpiresAt
            })

        generateTokenAndSetCookies(res, insertId)

        try {
            await sendVerificationEmail(email, verificationToken)
        }
        catch (error) {
            await deleteUserById(insertId);
            res.status(400).json({success:false, message: "Sorry, something went wrong. Try again."});
            console.log(error)
            return;
        }

        res.status(201).json({
            success: true,
            message: "User create successfully",
            user: {
                id: insertId,
                verificationToken: verificationToken
            }
        })

    }catch (error){
        console.log("Error in sign up: ", error)
        res.status(400).json({success:false, message: error.message});
    }
}

export const verifyEmail = async (req, res) => {
    const { code } = req.body

    try{
        const user = await findUserByVerificationToken(code);
        if(user == undefined){
            return res.status(400).json({success: false, message: "Invalid or expired verification code"})
        }

        if(await verifyUser(user.id) == false){
            return res.status(400).json({success: false, message: "Email verified error"})
        }

        user.isVerified = true;
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                email: user.email,
                lastLogin: user.lastLogin,
                isVerified: user.isVerified
            }
        })

    } catch(error){
        console.log("Error in verifyEmail: ", error)
        res.status(500).json({success:false, message: "Server error"})
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    
    try {
        const user = await findUserByEmail(email)
        if(user == undefined){
            return res.status(400).json({success: false, message: "Invalid email"})
        }
        const isPasswordValide = await bcryptjs.compare(password, user.password)

        if(!isPasswordValide){
            return res.status(400).json({success: false, message: "Invalid password"})
        }

        generateTokenAndSetCookies(res, user.id)

        await updateLastLogin(user.id)

        res.status(200).json({
            success: true,
            message: "Log in successfully",
            user: {
                id: user.id,
                email: user.email,
                lastLogin: user.lastLogin,
                isVerified: user.isVerified
            }
        })

    } catch (error) {
        console.log("Error in log in: ", error)
        res.status(400).json({success:false, message: error.message});
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token")
    res.status(200).json({success:true, message:"Logged out successfully"})
}

export const forgotPassword = async (req, res) => {
    const {email} = req.body
    try {
        const user = await findUserByEmail(email)

        if(user == undefined){
            return res.status(400).json({success: false, message: "Invalid email"})
        }

        const resetToken = crypto.randomBytes(20).toString("hex")
        const now = new Date();
        const futureDate = new Date(now.getTime() + 1 * 60 * 60 * 1000);
        const resetTokenExpiresAt = formatDateToSQL(futureDate);

        await forgotPasswordUser(user.id, resetToken, resetTokenExpiresAt)

        try {
            await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)
        }
        catch (error) {
            res.status(400).json({success:false, error: "Sorry, something went wrong. Try again."});
            console.log(error)
            return;
        }

        res.status(200).json({success: true, message: "Password reset link send to your email"})

    } catch(error){
        console.log("Error in reset password: ", error)
        res.status(400).json({success:false, message: error.message});
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params
        const { password } = req.body

        const user = await findUserByResetPasswordToken(token)
        if(user == undefined){
            return res.status(400).json({success: false, message: "Invalid token"})
        }
        
        const hashedPassword = await bcryptjs.hash(password, 10)

        await resetPasswordUser(user.userId, hashedPassword)

        res.status(200).json({ success: true, message: "Password reset successfully" })

    } catch(error) {
        console.log("Error in reset password: ", error)
        res.status(400).json({success:false, message: error.message});
    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = await findUserById(req.userId)
        if(user == undefined){
            return res.status(400).json({success: false, message: "User not found"})
        }

        res.status(201).json({
            success: true,
            message: "User found successfully",
            user: {
                id: user.id,
                email: user.email,
                lastLogin: user.lastLogin,
                isVerified: user.isVerified
            }
        })
    } catch (error) {
        console.log("Error in check Auth: ", error)
        res.status(500).json({success:false, message: error.message});
    }
}