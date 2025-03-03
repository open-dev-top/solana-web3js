import {
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    SystemProgram,
    ComputeBudgetProgram,
    sendAndConfirmTransaction
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

    // 创建交易
    const transaction = new Transaction();

    // CU价格
    // 0.000005 * 200000 / 10000000000 = 0.000000001
    const computeUnitPriceInstruction = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 5
    });
    transaction.add(computeUnitPriceInstruction);

    // CU数量
    // const computeUnitLimitInstruction = ComputeBudgetProgram.setComputeUnitLimit({
    //     units: 500,
    // });
    // transaction.add(computeUnitLimitInstruction);

    // 目标地址
    const toAddress = new PublicKey('Fs9yoikaDDrkhZxYcy9RUvzn7ksGxLxdfLdredykeg5S');

    // 添加转账指令
    const instruction1 = SystemProgram.transfer({
        fromPubkey: fromWallet.publicKey,
        toPubkey: toAddress,
        lamports: 1000, // 1000 lamports
    });
    transaction.add(instruction1);

    // // 添加转账指令
    // const instruction2 = SystemProgram.transfer({
    //     fromPubkey: fromWallet.publicKey,
    //     toPubkey: toAddress,
    //     lamports: 1000, // 1000 lamports
    // });
    // transaction.add(instruction2);

    // 模拟交易
    const simulateResult = await connection.simulateTransaction(transaction, [fromWallet]);
    console.log("模拟交易结果: ", simulateResult);

    // 发送交易
    const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
    console.log(`交易已发送: https://solscan.io/tx/${signature}`);
}

main();