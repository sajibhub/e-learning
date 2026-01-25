import forge from 'node-forge';
import { Buffer } from 'buffer';

export const EncryptedToken = async () => {
  try {
    const publicKeyPem = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAo6rCnz3sqHAP0P2yXoFf
IJL8M0IKgVMcDrlxtAlkN6ewnfVLyAeVKNc/Tgde6aPQXejDFjKxO6KJbpcr0VmX
snDA5iOOhI8WnXKPxk4gNNWQjOlAghLek2FDppzA36Vv24CuaETgCieDn5AXMJE/
F55YWtXH/P5YXxEpQbuOuP1xEwSeiCpMUKamUxX0lW9b6VNEnkb1oCHdJubgl5pj
8+AWSKAagVfi/vN4TOlsoAQJf4StvtF77d5/l4U7IHBSxaqKCDz0bXjuicCzE+6F
zDUe4rjZfkeyXpbORbaWgZEZprgxOv9w54rvDHv84KDDoGCX1rg+RErd5CGAAg3X
KwIDAQAB
-----END PUBLIC KEY-----`;

    const encrypted = await new Promise((resolve, reject) => {
      try {
        const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
        const payloadString = JSON.stringify({ expired: new Date().getTime() + 5 * 60 * 60 * 1000 });

        const encryptedData = publicKey.encrypt(payloadString, 'RSA-OAEP', {
          md: forge.md.sha256.create(),
        });

        const base64Encrypted = forge.util.encode64(encryptedData);
        resolve(Buffer.from(base64Encrypted, "base64").toString("hex"));
      } catch (err) {
        reject(err);
      }
    });

    return encrypted;
  } catch (err) {
    console.error("Encryption failed:", err.message);
    throw err;
  }
};