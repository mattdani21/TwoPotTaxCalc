const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the static HTML file
app.use(express.static(path.join(__dirname, '/')));

// Function to calculate the tax rate based on taxable income
function getTaxRate(taxableIncome) {
    let taxRate = 0;

    // Determine the tax rate based on taxable income
    if (taxableIncome <= 237100) {
        taxRate = 0.18;
    } else if (taxableIncome <= 370500) {
        taxRate = 0.26;
    } else if (taxableIncome <= 512800) {
        taxRate = 0.31;
    } else if (taxableIncome <= 673000) {
        taxRate = 0.36;
    } else if (taxableIncome <= 857900) {
        taxRate = 0.39;
    } else if (taxableIncome <= 1817000) {
        taxRate = 0.41;
    } else {
        taxRate = 0.45;
    }

    console.log(`Taxable Income: ${taxableIncome}, Tax Rate: ${taxRate}`);
    return taxRate;
}

// Endpoint to handle tax calculation
app.post('/calculate-tax', (req, res) => {
    try {
        const monthlySalary = parseFloat(req.body.income) || 0;
        const monthlyDeductions = parseFloat(req.body.deductions) || 0;
        const withdrawal = parseFloat(req.body.withdrawal) || 0;
        const taxYear = req.body.taxYear || "N/A";  // Ensure tax year is correctly captured

        // Calculate annual salary and deductions
        const annualSalary = monthlySalary * 12;
        const annualDeductions = monthlyDeductions * 12;

        // Calculate taxable income (Annual Salary - Annual Deductions)
        const taxableIncome = annualSalary - annualDeductions;

        // Add the withdrawal amount to the taxable income to determine the tax rate
        const totalTaxableIncome = taxableIncome + withdrawal;

        console.log(`Annual Salary: ${annualSalary}`);
        console.log(`Annual Deductions: ${annualDeductions}`);
        console.log(`Taxable Income (without withdrawal): ${taxableIncome}`);
        console.log(`Total Taxable Income (with withdrawal): ${totalTaxableIncome}`);

        // Get the correct tax rate based on total taxable income
        const taxRate = getTaxRate(totalTaxableIncome);

        // Apply the correct tax rate to the withdrawal amount (tax applies only to withdrawal)
        const tax = withdrawal * taxRate;
        console.log(`Withdrawal Amount: ${withdrawal}`);
        console.log(`Tax on Withdrawal: ${tax}`);
        console.log(`Tax Year: ${taxYear}`);

        res.json({ tax });
    } catch (error) {
        console.error('Error calculating tax:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
