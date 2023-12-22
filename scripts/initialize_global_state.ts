import * as anchor from "@coral-xyz/anchor";
import { NumberSetting } from "../target/types/number_setting";
import {Program} from "@coral-xyz/anchor";
import {getDefaultWallet} from "./helpers";
(async () => {
    const wallet = getDefaultWallet();
    const connection = new anchor.web3.Connection('https://api.devnet.solana.com', { commitment: "confirmed"});
    const provider = new anchor.AnchorProvider(
        connection,
        new anchor.Wallet(wallet),
        { commitment: "confirmed"},
    );
    anchor.setProvider(provider);

    const program = anchor.workspace.NumberSetting as Program<NumberSetting>;
    const [global] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("global")],
        program.programId,
    );

    const tx = await program.methods.initialize()
        .accounts({ global })
        .rpc();
    console.log("Your transaction signature is ", tx);
})()