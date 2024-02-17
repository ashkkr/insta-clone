import jwt from "jsonwebtoken"
const SECRETKEY = 'SECRET_KEY';

export const getToken = (payload: object) => {
    const token = jwt.sign(payload, SECRETKEY, {
        expiresIn: '1h'
    });
    return token;
}

