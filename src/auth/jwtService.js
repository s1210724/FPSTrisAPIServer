const jwt = require('jsonwebtoken');

const {
    getCurrentSigningKey,
} = require('./jwtKeyManager');

function createAccessToken(user, claims = []) {
    const keyData = getCurrentSigningKey();

    const payload = {
        userId: user.id,
        username: user.username,
        claims: claims,
    };

    return jwt.sign(payload, keyData.privateKey, {
        algorithm: 'RS256',
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
        keyid: keyData.kid,
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
    });
}

module.exports = {
    createAccessToken,
};