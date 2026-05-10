require('dotenv').config();

const app = require('./app');

const {
    initializeKeyManager,
} = require('./auth/jwtKeyManager');

const PORT = process.env.PORT;

async function startServer() {
    await initializeKeyManager();

    app.listen(PORT, () => {
        console.log(`API Server running on port ${PORT}`);
    });
}

startServer();