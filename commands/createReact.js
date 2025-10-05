#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, ans => resolve(ans.trim())));
}

async function createProject() {
  try {
    const projectName = await ask("Enter your React project name: ");
    const useTS = await ask("Use TypeScript? (y/n): ");

    const template = useTS.toLowerCase() === "y" ? "react-ts" : "react";
    execSync(`npm create vite@latest ${projectName} -- --template ${template}`, { stdio: "inherit" });

    process.chdir(projectName);
    execSync("npm install", { stdio: "inherit" });

    fs.mkdirSync("src/pages", { recursive: true });
    fs.mkdirSync("src/components", { recursive: true });

    const ext = useTS.toLowerCase() === "y" ? "tsx" : "jsx";

    // -------------------- Axios -------------------- //
    const axios = await ask("Install Axios? (y/n): ");
    if (axios.toLowerCase() === "y") {
      execSync("npm install axios", { stdio: "inherit" });
    }

    // -------------------- React Router -------------------- //
    const router = await ask("Install React Router DOM? (y/n): ");
    if (router.toLowerCase() === "y") {
      execSync("npm install react-router-dom", { stdio: "inherit" });

      fs.mkdirSync("src/routes", { recursive: true });

      fs.writeFileSync(`src/routes/AppRoutes.${ext}`, `
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default AppRoutes;
`);

      fs.writeFileSync(`src/App.${ext}`, `
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
`);
    }

    // -------------------- Tailwind -------------------- //
    const tailwind = await ask("Install Tailwind CSS? (y/n): ");
    if (tailwind.toLowerCase() === "y") {
      execSync("npm install -D tailwindcss @tailwindcss/vite", { stdio: "inherit" });

      const viteConfigFile = useTS.toLowerCase() === "y" ? "vite.config.ts" : "vite.config.js";
      fs.writeFileSync(viteConfigFile, `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
`);

      fs.writeFileSync("src/index.css", `@import "tailwindcss";`);

      fs.writeFileSync(`src/pages/Home.${ext}`, `
export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <div className="backdrop-blur-lg bg-white/20 p-10 rounded-2xl shadow-2xl text-center">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg">
          👑 Welcome Mughal Zaada 👑
        </h1>
        <p className="mt-4 text-white/90">React + Tailwind Project</p>
      </div>
    </div>
  );
}
`);
    }

    // -------------------- Material-UI -------------------- //
    const mui = await ask("Install Material-UI (MUI)? (y/n): ");
    if (mui.toLowerCase() === "y") {
      execSync("npm install @mui/material @emotion/react @emotion/styled", { stdio: "inherit" });

      fs.writeFileSync("src/index.css", `/* Material-UI project - no Tailwind CSS here */`);

      fs.writeFileSync(`src/pages/Home.${ext}`, `
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

export default function Home() {
  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "20vh" }}>
      <Paper elevation={6} style={{ padding: "40px", borderRadius: "20px", backdropFilter: "blur(10px)" }}>
        <Typography variant="h4" gutterBottom>
          👑 Welcome Mughal Zaada 👑
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          React + Material UI Project
        </Typography>
        <Button variant="contained" color="primary">
          Click Me
        </Button>
      </Paper>
    </Container>
  );
}
`);
    }

    rl.close();
    console.log("✅ Setup complete!");
    execSync("npm run dev", { stdio: "inherit" });

  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

createProject();
