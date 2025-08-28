import User from "../models/user.js";
export const createUser = async (userData) => {
    return User.create(userData);
};

export const findUserByEmail = async (email) => {
    return User.findOne({ where: { email } });
};