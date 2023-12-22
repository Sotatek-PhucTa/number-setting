use anchor_lang::prelude::*;

declare_id!("4givkSHuinrWG49gm8xs1xPmZ5E6E7haMFwxyLdw23Ct");

#[program]
pub mod number_setting {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
