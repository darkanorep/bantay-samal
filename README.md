# Bantay Samal

Bantay Samal is a React and TypeScript web application for viewing crime mapping and statistics for Samal, Bataan.

## Requirements

Install the following software before running the project:

- [Node.js](https://nodejs.org/) 20 or newer (the LTS version is recommended)
- npm (included with Node.js)

To check whether Node.js and npm are installed, open a terminal (Command Prompt, PowerShell, or Terminal) and run:

```bash
node --version
npm --version
```

## Run the project on your computer

### 1. Open the project folder

Extract the downloaded ZIP file, if necessary, then open a terminal in the `bantay-samal` project folder.

### 2. Install dependencies

Run this command from the project folder:

```bash
npm install
```

This installs the packages listed in `package.json`. You only need to run it again when the project dependencies change or after removing the `node_modules` folder.

### 3. Start the development server

```bash
npm run dev
```

Vite will display a local address in the terminal, usually:

```text
http://localhost:5173/
```

Open that address in a web browser. Keep the terminal running while using the application. Press `Ctrl+C` in the terminal to stop the development server.

## Create and preview a production build

To check that the application can be built for production:

```bash
npm run build
```

After the build completes, preview the production build locally:

```bash
npm run preview
```

Open the local address shown in the terminal.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Type-check and create a production build in `dist` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check the source code with ESLint |

## Troubleshooting

- **`npm` or `node` is not recognized:** Install Node.js from [nodejs.org](https://nodejs.org/), then close and reopen the terminal.
- **The address is already in use:** Stop the other process using port `5173`, or follow the different local address Vite displays.
- **The page does not update:** Stop the server with `Ctrl+C`, run `npm install`, and start it again with `npm run dev`.
- **The browser shows a blank page after a dependency change:** Stop the server, remove `node_modules`, run `npm install`, and start the server again.

## Technology

- React
- TypeScript
- Vite
- Material UI
- React Leaflet
