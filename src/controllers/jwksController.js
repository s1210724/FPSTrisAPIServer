const {
    getPublicJWKS,
} = require('../auth/jwtKeyManager');

function getJWKS(req, res) {
    return res.json(getPublicJWKS());
}

module.exports = {
    getJWKS,
};