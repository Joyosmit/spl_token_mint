import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "/home/joyosmit/.config/solana/id.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("C1UYebjAt4gUj3WPcDmGLWLqmDnyYGfLxbKm2GdmBAUs");

// Recipient address
const to = new PublicKey("EVecz3g8m3yLNrneCvNXyhhvrMXndhEhXwZQo275X5bQ");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromAta = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        );
        console.log(`Your ATA: ${fromAta.address.toBase58()}`);

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toAta = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to
        );
        console.log(`Recipient ATA: ${toAta.address.toBase58()}`);

        // Transfer the new token to the "toTokenAccount" we just created
        const transferTx = await transfer(
            connection,
            keypair,
            fromAta.address,
            toAta.address,
            keypair.publicKey,
            7_000_000n // 7 tokens with 6 decimals
        );
        console.log(`Transfer txid: ${transferTx}`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();