import crypto, { privateDecrypt } from "crypto"
import fs from "fs/promises"
import path from "path"
import dotenv from "dotenv"

const PrivateKeyPath = path.join(process.cwd(), "./security/private_key.pem")
dotenv.config()
const secretKey = process.env.PRIVATE_KEY_PASSPHRASE

const decrypted = async (encrypt) => {
    const privateKey = await fs.readFile(PrivateKeyPath, 'utf8');
    const decrypt = privateDecrypt(
        {
            key: await privateKey,
            passphrase: secretKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        Buffer.from(encrypt, "base64")
    )
    return decrypt.toString("utf8")
}

export default decrypted;