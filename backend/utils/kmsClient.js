/**
 * Simulated KMS client module to fetch AES-256 encryption key securely.
 * In a real implementation, this would interface with an actual KMS provider
 * such as AWS KMS, Google Cloud KMS, Azure Key Vault, or HashiCorp Vault.
 */

const fetchAESKey = async () => {
  // Simulate asynchronous retrieval of the AES key from a secure KMS
  // For demonstration, we read from an environment variable as a placeholder
  const base64Key = process.env.AES_SECRET_KEY;
  if (!base64Key) {
    console.warn("AES_SECRET_KEY not found in environment variables. Using fallback key.");
    // Fallback key for development - "development-key-32-chars-long" in base64
    return Buffer.from("ZGV2ZWxvcG1lbnQta2V5LTMyLWNoYXJzLWxvbmc=", "base64");
  }

  try {
    // Return the key as a Buffer
    return Buffer.from(base64Key, "base64");
  } catch (error) {
    console.error("Invalid AES_SECRET_KEY format:", error.message);
    throw new Error("Invalid AES key format. Please provide a valid base64 encoded 32-byte key.");
  }
};

module.exports = { fetchAESKey };
