# 🛡️ FRAUD-ANT
### Guardians of Digital Space

**Fraud-Ant** is a web-based digital security platform designed to help users identify potential online scams, suspicious links, and fraudulent digital interactions.

The platform provides tools to analyze screenshot evidence and inspect website URLs, helping users become more aware of potential digital threats.

---

## 🌐 About The Project

Online fraud continues to be a concern as cybercriminals use increasingly sophisticated techniques to deceive internet users.

Fraud-Ant aims to provide an accessible platform that helps users recognize suspicious digital activities through a simple and intuitive interface.

Our goal is to encourage safer digital behavior through accessible technology, security awareness, and risk analysis.

## ✨ Main Features

### 1. TrapScan — Screenshot Analysis
- Upload suspicious conversation screenshots.
- Analyze digital evidence for potential scam indicators.
- Identify suspicious messages and possible fraudulent patterns.
- Display risk assessment results.

### 2. TrapLink — URL Security Checker
- Submit website URLs for inspection.
- Examine potential phishing indicators.
- Identify suspicious URL characteristics.
- Display URL risk assessment results.

### 3. Digital Security Education
- Learn about common online fraud techniques.
- Understand phishing and suspicious digital activities.
- Improve awareness of online security.

### 4. User-Friendly Interface
- Responsive web interface.
- Simple navigation.
- Accessible analysis tools.
- Clean and intuitive design.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend interface |
| Vite | Development and build tools |
| TypeScript | Application development |
| Tailwind CSS | Interface styling |
| Node.js | Backend runtime |
| Express / API server | Backend services |

## 📂 Project Structure

```text
FRAUD-ANT/
│
├── public/
│   ├── favicon.png
│   └── logo-chattrap.png
│
├── server/
│   ├── src/
│   ├── package.json
│   └── .env.example
│
├── src/
│   ├── assets/
│   ├── App.tsx
│   ├── App.css
│   ├── CardNav.tsx
│   ├── index.css
│   └── main.tsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/leonardoelian2008-web/FRAUDD-ANT.git
```

### 2. Enter the Project Directory

```bash
cd FRAUDD-ANT
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Install Backend Dependencies

```bash
cd server
npm install
```

Configure the backend environment using the provided `.env.example` file. Add the required environment variables according to the backend configuration.

### 5. Run the Backend

Inside the `server` directory:

```bash
npm run dev
```

The backend API is expected to run at:

```text
http://localhost:4000
```

### 6. Run the Frontend

Open another terminal in the main project directory:

```bash
npm run dev
```

Open the local development website:

```text
http://localhost:5173
```

## 🔌 API Endpoints

The backend provides API routes for application health and analysis services.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check API availability |
| POST | `/api/scan` | Screenshot analysis |
| POST | `/api/url-check` | URL inspection |

Request formats and required parameters depend on the backend implementation.

## 🔒 Security & Privacy

Fraud-Ant is designed with security awareness and responsible digital analysis in mind.

- Do not upload sensitive personal information unnecessarily.
- Never expose API keys or credentials in public repositories.
- Keep environment variables in `.env` files.
- Do not assume every website marked low-risk is completely safe.

## ⚠️ Disclaimer

Fraud-Ant is a digital security assistance project intended to help identify potential indicators of online fraud.

Its assessment results are not a guarantee of website or message safety. Users should independently verify suspicious information before making financial transactions or sharing personal information.

## 🎯 Project Goals

- Increase digital literacy.
- Promote awareness of online scams.
- Encourage safer internet usage.
- Make basic digital risk assessment more accessible.

## 👨‍💻 Developer

**Project:** FRAUD-ANT  
**Tagline:** Guardians of Digital Space  
**Repository:** [GitHub - FRAUDD-ANT](https://github.com/leonardoelian2008-web/FRAUDD-ANT)

---

<p align="center">
  <b>FRAUD-ANT — Guardians of Digital Space</b><br/>
  Protecting Digital Space, One Scan at a Time.
</p>
