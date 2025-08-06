const crypto = require('crypto');
const { fetchAESKey } = require('./kmsClient');
const ivLength = 16;

function sha256Hash(text) {
    return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

async function encrypt(text) {
    const key = await fetchAESKey();
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const hash = sha256Hash(text);
    // Return encrypted data with hash appended separated by ':'
    return iv.toString('base64') + ':' + encrypted + ':' + hash;
}

async function decrypt(encryptedText) {
    const key = await fetchAESKey();
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
        throw new Error('Invalid encrypted text format');
    }
    const [ivBase64, encryptedData, hash] = parts;
    const iv = Buffer.from(ivBase64, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    // Verify hash
    const decryptedHash = sha256Hash(decrypted);
    if (decryptedHash !== hash) {
        throw new Error('Data integrity check failed: hash mismatch');
    }
    return decrypted;
}

module.exports = { encrypt, decrypt, sha256Hash };
