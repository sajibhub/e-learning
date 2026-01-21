import jwt from "jsonwebtoken"
import fs from "fs/promises"
import path from "path"
import dotenv from "dotenv"

dotenv.config()

const secretKey = process.env.PRIVATE_KEY_PASSPHRASE

const PrivateKeyPath = path.join(process.cwd(), "./security/private_key.pem")

const generateToken = async (id,time) => {
    const privateKey = await fs.readFile(PrivateKeyPath, "utf8");
    return new Promise((resolve, reject) => {
        jwt.sign(
            { id },
            { key: privateKey, passphrase: secretKey },
            { algorithm: "RS256", expiresIn: time },
            (err, token) => {
                if (err) return reject(err)
                resolve(token)
            }
        )
    })
}

export default generateToken;