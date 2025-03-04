import {
    Connection,
    PublicKey,
    Keypair,
    TransactionMessage,
    VersionedTransaction,
    SystemProgram,
    AddressLookupTableProgram
} from '@solana/web3.js';
import fs from "fs";

// 创建RPC连接
const connection = new Connection("https://devnet.helius-rpc.com/?api-key=5478b127-a6be-4172-87cb-f36d697a8c6b", "confirmed")
// const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
// const connection = new Connection("https://mainnet-ams.chainbuff.com", "confirmed");

// 本地导入钱包
const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync("wallet.json", "utf-8")));
// const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync("web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2.json")));
const payer = Keypair.fromSecretKey(secretKey);

async function createALT() {

    // 获取当前slot
    const slot = await connection.getSlot("confirmed");

    // 创建ALT
    const [lookupTableInstruction, lookupTableAddress] =
        AddressLookupTableProgram.createLookupTable({
            authority: payer.publicKey,
            payer: payer.publicKey,
            recentSlot: slot,
        });

    console.log("lookup table address:", lookupTableAddress.toBase58());

    // 创建v0 message
    const { blockhash } = await connection.getLatestBlockhash();
    const messageV0 = new TransactionMessage({
        payerKey: payer.publicKey,
        recentBlockhash: blockhash, // 最近的区块hash
        instructions: [lookupTableInstruction], // 指令数组
    }).compileToV0Message();

    // 创建v0交易并签名
    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([payer]);

    // 模拟交易
    const simulateResult = await connection.simulateTransaction(transaction);
    console.log("模拟交易结果: ", simulateResult);

    // 发送交易
    const signature = await connection.sendTransaction(transaction);
    console.log(`交易已发送: https://solscan.io/tx/${signature}`);
}

async function addAddresses() {

    const lookupTableAddress = new PublicKey('7HJtG6KXFwvLYHjXoa6vvk1YU6FQo1VcS8vHdhCQZRmp')

    // 添加账户到ALT
    const extendInstruction = AddressLookupTableProgram.extendLookupTable({
        lookupTable: lookupTableAddress,
        payer: payer.publicKey,
        authority: payer.publicKey,
        addresses: [
            payer.publicKey,
            new PublicKey('CKRpaht6jbuNMyWURMmw8CuNqFZfcjKEK6YLuiNjePCQ'),
            SystemProgram.programId, // 
        ],
    });

    // 创建v0 message
    const { blockhash } = await connection.getLatestBlockhash();
    const messageV0 = new TransactionMessage({
        payerKey: payer.publicKey,
        recentBlockhash: blockhash, // 最近的区块hash
        instructions: [extendInstruction], // 指令数组
    }).compileToV0Message();

    // 创建v0交易并签名
    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([payer]);

    // 模拟交易
    const simulateResult = await connection.simulateTransaction(transaction);
    console.log("模拟交易结果: ", simulateResult);

    // 发送交易
    const signature = await connection.sendTransaction(transaction);
    console.log(`交易已发送: https://solscan.io/tx/${signature}`);

}

async function transfer() {

    const lookupTableAddress = new PublicKey('7HJtG6KXFwvLYHjXoa6vvk1YU6FQo1VcS8vHdhCQZRmp')

    // 获取ALT
    const ALT = await connection.getAddressLookupTable(lookupTableAddress);
    const lookupTableAccount = ALT.value;
    if (!ALT.value) {
        throw new Error("lookupTableAccount不存在");
    }
    console.log('lookupTableAccount:', lookupTableAccount)

    // 目标地址
    const toAddress = new PublicKey('Fs9yoikaDDrkhZxYcy9RUvzn7ksGxLxdfLdredykeg5S');

    // 转账指令
    const instruction = SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: toAddress,
        lamports: 1000, // 1000 lamports
    });

    // 创建v0 message
    const { blockhash } = await connection.getLatestBlockhash();
    const messageV0 = new TransactionMessage({
        payerKey: payer.publicKey,
        recentBlockhash: blockhash, // 最近的区块hash
        instructions: [instruction], // 指令数组
    }).compileToV0Message([lookupTableAccount]);

    // 创建v0交易并签名
    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([payer]);

    // 模拟交易
    const simulateResult = await connection.simulateTransaction(transaction);
    console.log("模拟交易结果: ", simulateResult);

    // 发送交易
    const signature = await connection.sendTransaction(transaction);
    console.log(`交易已发送: https://solscan.io/tx/${signature}`);

}

async function parseTx() {

    const parsedTransaction1 = await connection.getParsedTransaction('ySKnyUddVmBK9Q1yE2YnWx2WBunNjzB28G8gmByTwzES8YutDZB2qpxmski5AYjFQDbyYdGG39JEKvBeJabp2PF', {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0
    });
    console.log(`已解析的v0交易: ${JSON.stringify(parsedTransaction1)}\n`);

}


// 创建ALT
// createALT();

// 为ALT添加账户
// addAddresses();

// 使用ALT的转账
// transfer();

// 获取解析的v0交易
parseTx();