# 🚀 Proposal, Quotation, and Invoice Generator 

## 📌 Project Overview

Every minute spent manually crafting proposals, quotations, and invoices is a minute lost to inefficiency — and for many businesses, the cost is staggering. Studies show companies lose up to **$30 per invoice** and up to **$4.5 million each month** due to poor processing workflows (Chargezoom, DepositFix). In today’s fast-paced economy, **automation isn’t just a competitive edge — it’s a survival tool.**

## 💡 The Big Idea

Meet the **AI-Powered Proposal, Quotation & Invoice Generator** — your all-in-one solution for transforming how businesses handle client documentation. Designed to eliminate the bottlenecks of manual paperwork, this tool automates the creation of three critical documents in just a few clicks:

- ✍️ A **customized proposal** tailored to your client’s needs  
- 💰 A **professional quotation** with precision and clarity  
- 🧾 A **formal invoice** ready for immediate delivery  

Each document is intelligently generated based on your input, drastically reducing the time, cost, and errors associated with manual workflows.

## 🌟 Why It Matters

This isn’t just about saving time — it’s about empowering businesses to scale, serve clients faster, and focus on what truly matters. Whether you’re a growing startup or a scaling enterprise, this tool brings **efficiency, accuracy, and professionalism** to your client communication — with zero hassle.

> ⚡ Automate the boring. Impress with polish. Win back your time.


## 🛠 Tech Stack

- **Frontend:** React.js (TypeScript), Tailwind CSS  
- **Backend:** Express JS  
- **PDF Generation:** HTML-to-PDF via DOM rendering  
- **AI Content Logic:** Azure AI Foundry

---

## 🖥️ Architecture Diagram
![architecture-diagram](https://github.com/user-attachments/assets/9048890d-e875-460a-93a7-96815db40e6f)

---

## 🤝 How to Contribute
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Add feature-name"`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## 📚 Dependencies
### Backend (Express JS)
- `@azure/ai-projects`– `^1.0.0-beta.5`
- `@azure/identity`– `^4.9.1`
- `cookie-parser`– `~1.4.4`
- `cors`– `^2.8.5`
- `debug`– `~2.6.9`
- `dotenv`– `^16.5.0`
- `express`– `~4.16.1`
- `http-errors`– `~1.6.3`
- `jade`– `~1.11.0`
- `morgan`– `~1.9.1`
- `nodemon`– `^3.1.10`

### Frontend (React + TypeScript)
- `typescript`– `~5.7.2`
- `vite`– `^6.3.1`
- `axios` – `^1.9.0`
- `html2pdf.js`– `^0.10.3`
- `postcss`– `^8.5.3`
- `react`– `^19.0.0`
- `react-dom`– `^19.0.0`
- `tailwindcss`– `3`

---

## 📦 Installation
### Clone the repository: `git clone https://github.com/temantrip/azurehackathon.git`
### Backend 
```bash
cd azurehackathon
cd azurehackathon-backend
yarn
```
### Frontend 
```bash
cd azurehackathon
cd azurehackathon=frontend
yarn
```
### Set Up Agent  [check `agent.txt` file]
1. Agent Pricing
3. Agent Quotation
4. Agent Proposal
5. Agent Invoice

## ▶️ Run and Demo 

### Backend
1. Make sure the `.env` is added.
2. Start the application: `yarn start`.
3. Access the demo at: `http://localhost:3000`.

### Frontend
1. Make sure the `.env` is added.
2. Start the application: `yarn dev`.
3. Access the demo at: `http://localhost:5173`.

## 📄 License
This project is licensed under the [EZQuote](LICENSE).
