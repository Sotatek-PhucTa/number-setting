import * as anchor from "@coral-xyz/anchor";
import { NumberSetting } from "../target/types/number_setting";
import { BN, Program } from "@coral-xyz/anchor";
import { getDefaultWallet } from "./helpers";
(async () => {
  const wallet = getDefaultWallet();
  const connection = new anchor.web3.Connection(
    "https://api.devnet.solana.com",
    { commitment: "finalized" }
  );
  const provider = new anchor.AnchorProvider(
    connection,
    new anchor.Wallet(wallet),
    { commitment: "finalized" }
  );
  anchor.setProvider(provider);

  const program = anchor.workspace.NumberSetting as Program<NumberSetting>;
  const [global] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("global")],
    program.programId
  );
  const [state] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("state"), wallet.publicKey.toBuffer()],
    program.programId
  );

  try {
    // let tx = await program.methods
    //     .initializeAccountState()
    //     .accounts({ state, signer: wallet.publicKey})
    //     .signers([wallet])
    //     .rpc();
    // console.log("Initialize account state ", tx);
    // await delay(5000);

    // let tx = await program.methods.setStateNumber(new BN(42))
    //     .accounts({
    //         state,
    //         signer: wallet.publicKey,
    //     })
    //     .signers([wallet])
    //     .rpc();
    // console.log("Set account state ", tx);
    // await delay(5000);
    let tx = await program.methods
      .increaseStateNumber(
        new BN("18446744073709551615")
        // new BN("10"),
      )
      .accounts({
        state,
        signer: wallet.publicKey,
      })
      .signers([wallet])
      .rpc();
    console.log("Increase state number ", tx);
    await delay(5000);
    const stateAccount = await program.account.state.fetch(state);
    console.log(stateAccount.number.toNumber());
  } catch (error) {
    console.error(error);
  }
})();

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
