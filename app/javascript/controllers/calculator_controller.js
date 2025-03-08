// app/javascript/controllers/calculator_controller.js

import { Controller } from "@hotwired/stimulus";
import init, * as wasmModule from "mortgage"; // Load from import-mapped pin

export default class extends Controller {
  static targets = ["loanAmount", "interestRate", "years", "result"];

  async connect() {
    console.log("CalculatorController connected!");

    try {
      // Initialize the WASM module
      await init();

      // Assign the WASM module
      this.wasm = wasmModule;

      console.log("WASM Module:", this.wasm);
      console.log("WASM Module loaded and instantiated!");
    } catch (error) {
      console.error("Failed to load WASM module:", error);
    }
  }

  async calculate(event) {
    event.preventDefault();

    if (!this.wasm) {
      console.error("WASM module not loaded yet.");
      return;
    }

    try {
      // Get values from input fields
      const loanAmount = parseFloat(this.loanAmountTarget.value);
      const interestRate = parseFloat(this.interestRateTarget.value);
      const years = parseInt(this.yearsTarget.value, 10);

      // Validate input
      if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(years)) {
        this.resultTarget.textContent = "Invalid input!";
        return;
      }

      // Check if the `calculate_mortgage` function is available
      if (typeof this.wasm.calculate_mortgage !== 'function') {
        console.error("calculate_mortgage function is not available.");
        this.resultTarget.textContent = "Calculation failed: Function not found.";
        return;
      }

      // Assuming calculate_mortgage is an exported function from your WASM module
      const monthlyPayment = this.wasm.calculate_mortgage(loanAmount, interestRate, years);

      // Display the result
      this.resultTarget.textContent = `Monthly Payment: $${monthlyPayment.toFixed(2)}`;
    } catch (error) {
      console.error("Error calculating mortgage:", error);
      this.resultTarget.textContent = "Calculation failed: " + error.message;
    }
  }
}
