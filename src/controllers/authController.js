const bcrypt = require('bcrypt');

const userService = require('../services/userService');
const authService = require('../services/authService');

const {
    createAccessToken,
} = require('../auth/jwtService');

async function login(req, res) {
    try {
        const { username, password } = req.body;

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
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Invalid credentials',
            });
        }

        const claims = await userService.getUserClaims(user.id);
        const token = createAccessToken(user, claims);

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

function logout(_req, res) {
    res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax');
    return res.status(200).json({
        message: 'Logged out successfully',
    });
}

async function requestPasswordReset(req, res) {
    try {
        const { email } = req.body;

        if (!email || typeof email !== 'string') {
            return res.status(400).json({
                message: 'A valid email address is required',
            });
        }

        await authService.requestPasswordReset(email);

        return res.status(200).json({
            message: 'If that email is registered, a password reset link has been sent.',
        });
    }
    catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Password reset request failed',
        });
    }
}

async function resetPassword(req, res) {
    try {
        const { email, code, password } = req.body;

        if (!email || !code || !password || typeof password !== 'string') {
            return res.status(400).json({
                message: 'Email, code, and new password are required',
            });
        }

        await authService.resetPassword(email, code, password);

        return res.status(200).json({
            message: 'Password has been reset successfully',
        });
    }
    catch (error) {
        console.error(error);

        return res.status(500).json({
            message: error.message || 'Password reset failed',
        });
    }
}

module.exports = {
    login,
    logout,
    requestPasswordReset,
    resetPassword,
};