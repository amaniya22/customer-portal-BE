import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const signAccessToken = (user) => {
    const payload = { userId: user.user_id, role: user.user_role };
    return jwt.sign(payload, process.env.JWT_SECRET_ACCESS_TOKEN, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' })
}

export const signRefreshToken = (user) => {
    const payload = {userId: user.user_id};
    return jwt.sign(payload, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' })
}

export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN);
}

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET_REFRESH_TOKEN)
}