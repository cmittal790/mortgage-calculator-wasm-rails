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

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn calculate_mortgage(loan_amount: f64, annual_interest_rate: f64, years: u32) -> f64 {
    let monthly_rate = annual_interest_rate / 100.0 / 12.0;
    let num_payments = (years * 12) as f64;
    (loan_amount * monthly_rate) / (1.0 - (1.0 + monthly_rate).powf(-num_payments))
}
