import { generateKeyPair } from "crypto"
import dotenv from "dotenv"
import fs from "fs/promises"
import path from "path"

dotenv.config()

const GenerateKeyPair = async () => {
    const PrivateKeyPath = path.join(process.cwd(), "./security/private_key.pem")
    const PublicKeyPath = path.join(process.cwd(), "./security/public_key.pem")
    const secretKey = process.env.PRIVATE_KEY_PASSPHRASE

    const securityFolder = path.join(process.cwd(), "./security")

    try {
        await fs.access(securityFolder)
    } catch (error) {
        await fs.mkdir(securityFolder);
    }

    const fileExists = async () => {
        try {
            await fs.access(PrivateKeyPath)
            await fs.access(PublicKeyPath)
            return true
        } catch (error) {
            return false
        }
    }

    const generateKeys = async () => {
        return new Promise((resolve, reject) => {
            generateKeyPair(
                'rsa',
                {
                    modulusLength: 2048,
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'pem',
                    },
                    privateKeyEncoding: {
                        type: 'pkcs8',
                        format: 'pem',
                        cipher: 'aes-256-cbc',
                        passphrase: secretKey,
                    },
                },
                async (err, publicKey, privateKey) => {
                    if (err) return reject(err);
                    await fs.writeFile(PrivateKeyPath, privateKey);
                    await fs.writeFile(PublicKeyPath, publicKey);
                    resolve();
                }
            );
        });
    };
    if (!(await fileExists())) {
        await generateKeys();
    }
}

export default GenerateKeyPair
