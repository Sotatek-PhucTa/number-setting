import * as anchor from "@coral-xyz/anchor";
import {BN, Program} from "@coral-xyz/anchor";
import { NumberSetting } from "../target/types/number_setting";
import {assert} from "chai";

describe("number-setting", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.NumberSetting as Program<NumberSetting>;
  const [global] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("global")],
        program.programId,
  )

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize()
        .accounts({ global})
        .rpc();
    console.log("Your transaction signature", tx);
  });

  it("Set global state value", async () => {
    // Add your test here.
    const tx = await program.methods
        .setGlobalNumber(new BN(42))
        .accounts({ global})
        .rpc();
    console.log("Your transaction signature", tx);


    const globalAccount = await program.account.state.fetch(global);
    assert(globalAccount.number.toNumber() === 42);
  });

  it("Initialized account state", async () => {
    // Add your test here.
    const newWallet = anchor.web3.Keypair.generate();
    await provider.connection.requestAirdrop(newWallet.publicKey, 10000000000);
    const [state ] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("state"), newWallet.publicKey.toBuffer()],
        program.programId,
    );
    await delay(5000);
    const tx = await program.methods
        .initializeAccountState()
        .accounts({ state, signer: newWallet.publicKey })
        .signers([newWallet])
        .rpc();
    console.log("Your transaction signature", tx);

    await program.methods.setStateNumber(new BN(42))
        .accounts({
          state,
          signer: newWallet.publicKey,
        })
        .signers([newWallet])
        .rpc();

    const stateAccount = await program.account.state.fetch(state);
    assert(stateAccount.number.toNumber() === 42);
  });
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
