const bcrypt = require('bcrypt');

const userService = require('../services/userService');

const {
    createAccessToken,
} = require('../auth/jwtService');

async function login(req, res) {
    try {
        console.log('Login request received with body:', req.body);
        const { username, password } = req.body;
        console.log(username, password);

        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required',
            });
        }

        const user = await userService.getUserByUsername(username);

        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials',
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user[0].password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Invalid credentials',
            });
        }

        const claims = await userService.getUserClaims(user[0].id);
        const token = createAccessToken(user[0], claims);

        return res.status(200).json({
            token,
        });
    }
    catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Login failed',
        });
    }
}

module.exports = {
    login,
};