# Sealprotocol Frontend

This is the frontend project for **Sealprotocol**, a CLMM (Concentrated Liquidity Market Maker) DEX built on the [Sui blockchain](https://sui.io).  
It is based on the `@mysten/create-dapp` starter template and provides a modern React-based UI for interacting with the Sealprotocol smart contracts.

GitHub Repository: [https://github.com/sealprotocol/Front-end.git](https://github.com/sealprotocol/Front-end.git)

## Features

This dApp is built using the following technologies:

- [React](https://react.dev/) — UI framework  
- [TypeScript](https://www.typescriptlang.org/) — static type checking  
- [Vite](https://vitejs.dev/) — fast build tool  
- [Radix UI](https://www.radix-ui.com/) — pre-built accessible UI components  
- [ESLint](https://eslint.org/) — linting  
- [`@mysten/dapp-kit`](https://sdk.mystenlabs.com/dapp-kit) — wallet connection and on-chain data loading  
- [pnpm](https://pnpm.io/) — fast package manager  

## Getting Started

To use this project locally:

### 1. Clone the repository

```bash
git clone https://github.com/sealprotocol/Front-end.git
cd Front-end
```
### 2. Install dependencies
```bash
pnpm install
```
### 3.Start the development server
```bash
pnpm dev
```
The app will be available at http://localhost:5173 by default.
### Building for Production
To build the dApp for deployment, run:
```bash
pnpm build
```
This will generate a production-ready build in the dist/ directory.
### License
This project is open-sourced under the MIT license.
