pub fn add(left: u64, right: u64) -> u64 {
    left + right
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}

use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    program_error::ProgramError,
    pubkey::Pubkey,
};
use spl_token::instruction::transfer; // Import fungsi transfer dari spl-token
use arrayref::array_ref;

entrypoint!(process_instruction);

fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let source_account = next_account_info(accounts_iter)?;
    let destination_account = next_account_info(accounts_iter)?;
    let authority_account = next_account_info(accounts_iter)?;
    let token_program = next_account_info(accounts_iter)?;

    // Validasi SPL Token Program
    if *token_program.key != spl_token::id() {
        return Err(ProgramError::IncorrectProgramId);
    }

    let (recipient_address, amount) = parse_instruction_data(instruction_data)?;

    if destination_account.key != &recipient_address {
        return Err(ProgramError::InvalidAccountData);
    }

    // Instruksi transfer menggunakan SPL Token
    let transfer_ix = transfer(
        token_program.key,
        source_account.key,
        destination_account.key,
        authority_account.key,
        &[authority_account.key],
        amount,
    )?;

    invoke(
        &transfer_ix,
        &[
            source_account.clone(),
            destination_account.clone(),
            authority_account.clone(),
            token_program.clone(),
        ],
    )?;

    msg!("Transfer berhasil!");
    Ok(())
}

fn parse_instruction_data(data: &[u8]) -> Result<(Pubkey, u64), ProgramError> {
    if data.len() != 32 + 8 {
        return Err(ProgramError::InvalidInstructionData);
    }
    let recipient_address = Pubkey::new_from_array(*array_ref![data, 0, 32]);
    let amount = u64::from_le_bytes(*array_ref![data, 32, 8]);
    Ok((recipient_address, amount))
}