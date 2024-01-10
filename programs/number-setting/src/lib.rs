use anchor_lang::prelude::*;
use std::borrow::BorrowMut;

declare_id!("4givkSHuinrWG49gm8xs1xPmZ5E6E7haMFwxyLdw23Ct");

#[program]
pub mod number_setting {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn initialize_account_state(ctx: Context<InitializeAccountState>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.number = 0;
        Ok(())
    }

    pub fn set_global_number(ctx: Context<SetGlobalNumber>, number: u64) -> Result<()> {
        let global = &mut ctx.accounts.global;
        global.number = number;
        Ok(())
    }

    pub fn set_state_number(ctx: Context<SetStateNumber>, number: u64) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.number = number;
        Ok(())
    }

    pub fn increase_state_number(ctx: Context<SetStateNumber>, number: u64) -> Result<()> {
        let state = &mut ctx.accounts.state;
        msg!("state.number: {}", state.number);
        msg!("Number {}", number);
        state.number = state.number + number;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = signer,
        space = 8 + 8,
        seeds = [b"global"],
        bump,
    )]
    pub global: Account<'info, State>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeAccountState<'info> {
    #[account(
        init,
        payer = signer,
        space = 8 + 8,
        seeds = [b"state", signer.key().as_ref()],
        bump,
    )]
    pub state: Account<'info, State>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SetStateNumber<'info> {
    #[account(
        mut,
        seeds = [b"state", signer.key().as_ref()],
        bump,
    )]
    pub state: Account<'info, State>,
    #[account(mut)]
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct SetGlobalNumber<'info> {
    #[account(
        mut,
        seeds = [b"global"],
        bump,
    )]
    pub global: Account<'info, State>,
    #[account(mut)]
    pub signer: Signer<'info>,
}

#[account]
pub struct State {
    pub number: u64,
}
