import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["loanAmount", "interestRate", "years", "result"];

  async connect() {
    console.log("CalculatorController connected!");

    try {
      // Dynamically load the WASM module
      const wasmModule = await import("/assets/wasm/mortgage.js");

      // Initialize the wasm-bindgen glue code (this is where `wbg` is defined)
      await wasmModule.default();

      // The WASM module is now initialized. We can proceed to call the exported functions.
      this.wasm = wasmModule;

      // Log the contents of the WASM module
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
