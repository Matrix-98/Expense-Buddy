# Personal Finance Management System

A comprehensive, feature-rich financial tracking application designed to give users complete control over their multi-wallet assets, debts, savings goals, and monthly analytics.

---

## 🚀 Key Features

### 1. Multi-Wallet Transfers

* **Seamless Fund Transfers:** Easily log a "Transfer" to move funds between wallets (e.g., withdrawing cash from Bank to Cash).
* **Net Worth Integrity:** Automatically updates both affected wallets without altering the user's Total Net Worth and without classifying the transfer as an income or expense.

### 2. Debt & IOU Management

* **Comprehensive Tracking:** Track "Money Lent" (amounts owed to you) and "Money Borrowed" (amounts you owe others).
* **Detailed Records:** Every debt record captures the Person's Name, Amount, Date, and Debt Type.
* **Partial Repayments:** Log partial repayments against active debts, which automatically update the remaining balance (`remaining_amount`) and adjust the selected wallet balance accordingly.
* **Automated Status Updates:** When a repayment brings a debt's remaining amount to zero, the system automatically transitions the debt status to **"Settled"** and removes it from the active UI list.
* **Direct Reminders:** Features a "Friendly Reminder" button on active "Money Lent" records that generates a pre-filled WhatsApp or SMS text using standard mobile URI schemes (`whatsapp://send?text=...`) containing the exact remaining amount owed.

### 3. Savings Goals

* **Goal Setting:** Create specific Savings Goals (e.g., "New PC") tied directly to your Savings wallet balance.
* **Progress Tracking:** Tracks both a `target_amount` and a `current_saved_amount` for each goal.
* **Visual Progress:** The UI renders a real-time visual progress bar for each active goal, calculated as a percentage.

### 4. Analytics & Reporting

* **Monthly Aggregation:** Aggregates and displays all financial data cleanly by calendar month.
* **Visualized Expenses:** Renders visual charts (such as pie or donut charts) to show the distribution of expenses across different categories.
* **Export Reports:** Includes an "Export Report" feature capable of generating downloadable PDF or CSV files.
* **Comprehensive Summaries:** Exported reports contain the selected month's complete transaction history, total income, total expenses, and ending balances.

---

## 🛠️ Getting Started

### Prerequisites

* Ensure you have your preferred backend/frontend runtime or framework environment set up (e.g., Node.js, Python, Flutter, or React depending on your implementation).

### Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/personal-finance-manager.git
cd personal-finance-manager

```


2. Install dependencies:
```bash
# Example for Node.js-based projects
npm install

```


3. Configure your environment variables and database connections.
4. Run the application:
```bash
npm run dev

```



---

## 📱 Usage Guide

* **Managing Wallets:** Set up your primary accounts (Bank, Cash, Savings) and use the transfer feature to move capital safely without skewing your profit/loss metrics.
* **Tracking Debts:** Head to the Debt section to record who owes you money or who you need to pay back. Use the WhatsApp/SMS reminder button to quickly follow up on pending IOUs.
* **Reaching Goals:** Fund your savings wallets and assign them to specific milestones to watch your progress bars fill up.
* **Exporting Data:** Navigate to Analytics at the end of every month to inspect category charts and generate your monthly PDF/CSV financial report.

---

## 📄 License

MIT License

Copyright (c) [2026] [Afm Abdur Rahman]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
