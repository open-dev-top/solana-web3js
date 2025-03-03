import { Keypair } from "@solana/web3.js"; 
import fs from "fs"

// 导入钱包
const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync("wallet.json", "utf-8")));
const wallet = Keypair.fromSecretKey(secretKey);

console.log("钱包公钥:", wallet.publicKey.toString());
console.log("钱包私钥:", wallet.secretKey);
console.log("钱包私钥(base64):", Buffer.from(secretKey).toString("base64"));