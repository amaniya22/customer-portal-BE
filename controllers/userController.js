import { getAllUsersService } from "../models/userModel.js";

// Standardized response function
const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    })
};

export const getAllUsers = async(req, res, next) => {
    try {
        const users = await getAllUsersService();
        handleResponse(res, 200, "Users fetched successfully", users)
    } catch(err) {
        next(err)
    }
}