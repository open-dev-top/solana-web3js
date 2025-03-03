import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection("https://devnet.helius-rpc.com/?api-key=5478b127-a6be-4172-87cb-f36d697a8c6b", "confirmed")
// const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
// const connection = new Connection("https://mainnet-ams.chainbuff.com", "confirmed");

async function main() {

    // 1. onAccountChange
    // connection.onAccountChange(new PublicKey("CKRpaht6jbuNMyWURMmw8CuNqFZfcjKEK6YLuiNjePCQ"), (accountInfo) => {
    //     console.log(`账户变化: ${JSON.stringify(accountInfo)}\n`);
    // });

    // 2. onLogs
    connection.onLogs(new PublicKey("CKRpaht6jbuNMyWURMmw8CuNqFZfcjKEK6YLuiNjePCQ"), (logs) => {
        console.log(`日志: ${JSON.stringify(logs)}\n`);
    });

}

main();