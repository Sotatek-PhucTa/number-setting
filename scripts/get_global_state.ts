import * as anchor from "@coral-xyz/anchor";
import { NumberSetting } from "../target/types/number_setting";
import { Program } from "@coral-xyz/anchor";
import { getDefaultWallet } from "./helpers";
(async () => {
  const wallet = getDefaultWallet();
  const connection = new anchor.web3.Connection(
    "https://api.devnet.solana.com",
    { commitment: "confirmed" }
  );
  const provider = new anchor.AnchorProvider(
    connection,
    new anchor.Wallet(wallet),
    { commitment: "confirmed" }
  );
  anchor.setProvider(provider);

  const program = anchor.workspace.NumberSetting as Program<NumberSetting>;
  const [global] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("global")],
    program.programId
  );
  console.log("Global account is ", global.toBase58());

  const globalAccount = await program.account.state.fetch(global);
  console.log(globalAccount);
})();
