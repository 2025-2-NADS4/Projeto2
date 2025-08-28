import { registerUser, loginUser } from "../services/authService.js";
import { createUserDTO } from "../dtos/userDTO.js";

export const register = async (req, res) => {
    try {
        const userData = createUserDTO(req.body);
        const user = await registerUser(userData);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });

    }
}