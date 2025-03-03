import {
    Connection,
    PublicKey,
    Keypair,
    TransactionMessage,
    VersionedTransaction,
    SystemProgram,
} from '@solana/web3.js';
import fs from "fs";

// 创建RPC连接
const connection = new Connection("https://devnet.helius-rpc.com/?api-key=5478b127-a6be-4172-87cb-f36d697a8c6b", "confirmed")
// const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
// const connection = new Connection("https://mainnet-ams.chainbuff.com", "confirmed");

// 本地导入钱包
const fromSecretKey = Uint8Array.from(JSON.parse(fs.readFileSync("wallet.json", "utf-8")));
// const fromSecretKey = Uint8Array.from(JSON.parse(fs.readFileSync("web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2.json")));
const fromWallet = Keypair.fromSecretKey(fromSecretKey);

async function main() {

    // 目标地址
    const toAddress = new PublicKey('Fs9yoikaDDrkhZxYcy9RUvzn7ksGxLxdfLdredykeg5S');

    // 转账指令
    const instruction = SystemProgram.transfer({
        fromPubkey: fromWallet.publicKey,
        toPubkey: toAddress,
        lamports: 1000, // 1000 lamports
    });

    // 创建v0 message
    const { blockhash } = await connection.getLatestBlockhash();
    const messageV0 = new TransactionMessage({
        payerKey: fromWallet.publicKey,
        recentBlockhash: blockhash, // 最近的区块hash
        instructions: [instruction], // 指令数组
    }).compileToV0Message();

    // 创建v0交易并签名
    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([fromWallet]);

    // 模拟交易
    const simulateResult = await connection.simulateTransaction(transaction);
    console.log("模拟交易结果: ", simulateResult);

    // 发送交易
    const signature = await connection.sendTransaction(transaction);
    console.log(`交易已发送: https://solscan.io/tx/${signature}`);
}

main();