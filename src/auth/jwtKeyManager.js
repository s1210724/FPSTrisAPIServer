const crypto = require('crypto');

const {
    exportJWK,
    importSPKI,
} = require('jose');

const ACTIVE_KEYS = new Map();

let currentKid = null;

const KEY_ROTATION_INTERVAL =
    1000 * 60 * 60;

async function generateNewKeyPair() {

    const {
        publicKey,
        privateKey,
    } = crypto.generateKeyPairSync('rsa', {

        modulusLength: 2048,

        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },

        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });

    const kid = `kid-${Date.now()}`;

    // Convert PEM public key into JWK
    const importedPublicKey =
        await importSPKI(publicKey, 'RS256');

    const publicJwk =
        await exportJWK(importedPublicKey);

    publicJwk.kid = kid;
    publicJwk.alg = 'RS256';
    publicJwk.use = 'sig';

    ACTIVE_KEYS.set(kid, {

        kid,

        publicKey,
        privateKey,

        publicJwk,

        createdAt: Date.now(),
    });

    currentKid = kid;

    cleanupOldKeys();
}

function cleanupOldKeys() {

    const maxAge =
        KEY_ROTATION_INTERVAL * 2;

    for (const [kid, key] of ACTIVE_KEYS.entries()) {

        if (
            Date.now() - key.createdAt > maxAge
        ) {
            ACTIVE_KEYS.delete(kid);
        }
    }
}

function getCurrentSigningKey() {

    return ACTIVE_KEYS.get(currentKid);
}

function getPublicJWKS() {

    return {
        keys: [...ACTIVE_KEYS.values()].map(
            (key) => key.publicJwk
        ),
    };
}

async function initializeKeyManager() {

    await generateNewKeyPair();

    setInterval(async () => {

        await generateNewKeyPair();

    }, KEY_ROTATION_INTERVAL);
}

module.exports = {
    initializeKeyManager,
    getCurrentSigningKey,
    getPublicJWKS,
};