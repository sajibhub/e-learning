import crypto, { publicEncrypt } from "crypto";
import fs from "fs/promises";
import path from "path";

const PublicKeyPath = path.join(process.cwd(), "./security/public_key.pem");

const encrypted = async (payload) => {
  const publicKey = await fs.readFile(PublicKeyPath, "utf8");

  const encrypt = publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(payload, "utf8")
  );

  return encrypt.toString("base64");
};

export default encrypted;
