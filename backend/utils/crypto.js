const crypto = require("crypto");
const { fetchAESKey } = require("./kmsClient");
const ivLength = 16;

async function encrypt(text) {
  const key = await fetchAESKey();
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return iv.toString("base64") + ":" + encrypted;
}

async function decrypt(encryptedText) {
  const key = await fetchAESKey();
  const parts = encryptedText.split(":");
  if (parts.length !== 2) {
    throw new Error("Invalid encrypted text format");
  }
  const [ivBase64, encryptedData] = parts;
  const iv = Buffer.from(ivBase64, "base64");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedData, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { encrypt, decrypt };
