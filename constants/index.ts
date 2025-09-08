import {LocationEdit, Brain, Gauge, NotebookPen, Network, ChartLine} from 'lucide-react'
import { DocumentType } from '@/types/index.d';
import { amethyst, sandpackDark , atomDark, cyberpunk} from "@codesandbox/sandpack-themes";

export const domeDocuments = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
]

type SandpackFiles = {
    [filePath: string]: {
        code: string;
        hidden?: boolean;
        readOnly?: boolean;
    };
};

export type mockFilesDataTypes = {
    fullPath: string,
    type: 'file' | 'folder',
    name: string,
    content?: string
}

export type mockWorkSpaceProjectsType = {
    id: string,
    projectName: string,
}

export const mockWorkSpaceProjects: mockWorkSpaceProjectsType[] = [
    {
        id: 'c15acf41-1bd7-4899-be74-7f70551e644c',
        projectName: 'my-next-app'
    },
    {
        id: 'da334acf41-1bd7-4899-be74-1234567890',
        projectName: 'server'
    }
]

export const mockFileDatas: mockFilesDataTypes[] = [
    {
        fullPath: 'simplify/App.ts',
        content: `import React, { useState } from 'react';
import './styles.css';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app-container">
      <h1>Hello Sandpack!</h1>
      <p>You clicked the button {count} times.</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}`,
        type: 'file',
        name: 'App.ts'
    },
    {
        fullPath: 'simplify/index.html',
        type: 'file',
        name: 'index.html',
        content: `<!DOCTYPE html>
<html>
  <head>
    <title>Hello Sandpack</title>
    <meta charset="UTF-8" />
  </head>
  <body>
    <div id="root"></div>
    <script src="src/index.js"></script>
  </body>
</html>`
    },
    {
        fullPath: 'simplify/package.json',
        type: 'file',
        name: 'package.json',
        content: `{
  "name": "simplify-col",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "dev:next": "next dev",
    "dev:ws": "concurrently \\"npm run dev:next\\" \\"npm run start:ws\\"",
    "start:ws": "ts-node ./server/ws-server.ts",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@ai-sdk/google": "^2.0.3"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcs
  },
  "overrides": {
    "@types/react": "19.0.12"
  }
}`
    },
    {
        fullPath: 'simplify/components',
        type: 'folder',
        name: 'components',
    },
    {
        fullPath: 'simplify/components/button.tsx',
        type: 'file',
        name: 'button.tsx',
        content: ''
    },
    {
        fullPath: 'simplify/components/Header.tsx',
        type: 'file',
        name: 'Header.tsx',
        content: ''
    },
    {
        fullPath: 'simplify/lib',
        type: 'folder',
        name: 'lib',
    },
    {
        fullPath: 'simplify',
        type: 'folder',
        name: 'simplify'
    }
]

export const mockFileData: mockFilesDataTypes[] = [
    {
        fullPath: 'my-next-app',
        type: 'folder',
        name: 'my-next-app'
    },
    {
        fullPath: 'my-next-app/app',
        type: 'folder',
        name: 'app'
    },
    {
        fullPath: 'my-next-app/app/layout.tsx',
        content: `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Next.js App',
  description: 'A Next.js application powered by the platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-900 text-white">
          {children}
        </div>
      </body>
    </html>
  );
}`,
        type: 'file',
        name: 'layout.tsx'
    },
    {
        fullPath: 'my-next-app/app/page.tsx',
        content: `import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center p-24">
      <h1 className="text-5xl font-bold text-center mb-4">
        Welcome to your new Next.js app
      </h1>
      <p className="text-xl text-center text-gray-400 mb-8">
        This project was created with a blank template on the platform.
      </p>
      <div className="relative w-64 h-64 mb-8">
        <Image 
          src="/nextjs.svg" 
          alt="Next.js Logo" 
          layout="fill" 
          objectFit="contain"
        />
      </div>
      <a 
        href="https://nextjs.org/docs" 
        className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more about Next.js
      </a>
    </main>
  );
}`,
        type: 'file',
        name: 'page.tsx'
    },
    {
        fullPath: 'my-next-app/app/globals.css',
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 255, 255, 255;
  --background-start-rgb: 0, 0, 0;
  --background-end-rgb: 0, 0, 0;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}
`,
        type: 'file',
        name: 'globals.css'
    },
    {
        fullPath: 'my-next-app/components',
        type: 'folder',
        name: 'components',
    },
    {
        fullPath: 'my-next-app/components/Header.tsx',
        content: `import React from 'react';

export default function Header() {
  return (
    <header className="w-full py-4 px-6 bg-gray-800 border-b border-gray-700">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="text-2xl font-bold">
          Platform
        </div>
        <ul className="flex space-x-4">
          <li>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a>
          </li>
          <li>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Docs</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}`,
        type: 'file',
        name: 'Header.tsx'
    },
    {
        fullPath: 'my-next-app/public',
        type: 'folder',
        name: 'public'
    },
    {
        fullPath: 'my-next-app/public/nextjs.svg',
        type: 'file',
        name: 'nextjs.svg',
        content: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rocket"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.75-.75 1.09-2.28.69-4.24L4.5 16.5Zm9.8-.8c1.38 1.55 3.12 3.25 5.67 5.75 1.55 1.55 5 1-2-2-2.5-2.5-4.25-4.2-5.75-5.67-1.45-1.45-1.92-3.8-1.45-5.65.47-1.85-.36-3.8-2.6-5.85-2.2-2.05-4.1-2.9-5.85-2.6-1.85.47-4.2 1.95-5.65 3.4-1.45 1.45-2.9 3.3-2.6 5.65.36 1.85 1.2 3.8 2.6 5.85z"/></svg>`
    },
    {
        fullPath: 'my-next-app/lib',
        type: 'folder',
        name: 'lib'
    },
    {
        fullPath: 'my-next-app/package.json',
        type: 'file',
        name: 'package.json',
        content: `{
  "name": "my-next-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.2.4",
    "react": "19.1.0",
    "react-dom": "19.1.0",
  },
  "devDependencies": {
    "@types/node": "^18.11.9",
    "@types/react": "19.0.12",
    "@types/react-dom": "^19",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.1.0",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}`
    },
    {
        fullPath: 'my-next-app/tsconfig.json',
        type: 'file',
        name: 'tsconfig.json',
        content: `{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "noEmit": true,
    "incremental": true,
    "esModuleInterop": true,
    "module": "esnext",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ],
    "forceConsistentCasingInFileNames": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`
    },
    {
        fullPath: 'my-next-app/next.config.mjs',
        type: 'file',
        name: 'next.config.mjs',
        content: `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
  // Set output to 'standalone' for optimized Docker builds
  output: 'standalone',
  experimental: {
    // This setting is required for standalone output to work correctly
    // with file-system-based routing and static assets.
    outputFileTracingIgnores: ['**'],
  },
};

export default nextConfig;`
    },
    {
        fullPath: 'my-next-app/tailwind.config.ts',
        type: 'file',
        name: 'tailwind.config.ts',
        content: `import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;`
    },
    {
        fullPath: 'my-next-app/postcss.config.mjs',
        type: 'file',
        name: 'postcss.config.mjs',
        content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`
    },
    {
        fullPath: 'my-next-app/README.md',
        type: 'file',
        name: 'README.md',
        content: `# My Next.js Project

This is a sample project created on the platform.

### Getting Started

First, run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.`
    },
    {
        fullPath: 'my-next-app/.gitignore',
        type: 'file',
        name: '.gitignore',
        content: `
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies
node_modules/
.pnpm-store/
.npm/

# Next.js build output
.next/
out/
.vercel/

# TypeScript
*.tsbuildinfo
.next/

# Environment files
.env
.env.local
.env.development.local
.env.production.local

# Local
.idea/
.vscode/
*.js.map
`
    }
];


const mockSandpackFiless = {
    "/App.js": {
        code: `import React, { useState } from 'react';
import './styles.css';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app-container">
      <h1>Hello Sandpack!</h1>
      <p>You clicked the button {count} times.</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}`,
        hidden: false,
    },
    "/styles.css": {
        code: `.app-container {
  font-family: sans-serif;
  text-align: center;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
}

p {
  color: #666;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007BFF;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}`,
        hidden: false,
    },
    "/index.js": {
        code: `import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(<App />);`,
        hidden: false,
    },
    "/public/index.html": {
        code: `<!DOCTYPE html>
<html>
  <head>
    <title>Hello Sandpack</title>
    <meta charset="UTF-8" />
  </head>
  <body>
    <div id="root"></div>
    <script src="src/index.js"></script>
  </body>
</html>`,
        hidden: false,
    },
    "/package.json": {
        code: `{
  "main": "/index.js",
  "dependencies": {
    "react": "latest",
    "react-dom": "latest"
  },
  "scripts": {
    "start": "react-scripts start"
  }
}`,
        hidden: true,
    },
};

export const mockSandpackFiles: SandpackFiles = {
    '/index.js': {
        code: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
    },
    '/App.js': {
        code: `import React from 'react';
import { Button } from './components/Button';
import { Header } from './components/Header';
import './styles/App.css';

export default function App() {
  return (
    <div className="app-container">
      <Header title="My Awesome App" />
      <h1>Hello, Simplify!</h1>
      <Button text="Click Me" onClick={() => alert('Button clicked!')} />
      <p>This is a mock React application for your editor.</p>
    </div>
  );
}
`,
    },
    '/components/Button.js': {
        code: `import React from 'react';

export function Button({ text, onClick }) {
  return (
    <button className="my-button" onClick={onClick}>
      {text}
    </button>
  );
}
`,
    },
    '/components/Header.js': {
        code: `import React from 'react';

export function Header({ title }) {
  return (
    <header className="my-header">
      <h2>{title}</h2>
    </header>
  );
}
`,
    },
    '/styles/index.css': {
        code: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #282c34;
  color: #f0f0f0;
}
`,
    },
    '/styles/App.css': {
        code: `.app-container {
  padding: 20px;
  text-align: center;
}

.my-button {
  background-color: #61dafb;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.my-button:hover {
  background-color: #21a1f1;
}

.my-header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #444;
}

h1 {
  color: #f0f0f0;
}
`,
    },
    '/public/index.html': {
        code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Simplify App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
`,
    },
    '/package.json': {
        code: `{
  "name": "simplify-col",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "dev:next": "next dev",
    "dev:ws": "concurrently \\"npm run dev:next\\" \\"npm run start:ws\\"",
    "start:ws": "ts-node ./server/ws-server.ts",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@ai-sdk/google": "^2.0.3",
    "@codesandbox/sandpack-react": "^2.20.0",
    "@codesandbox/sandpack-themes": "^2.0.21",
    "@dagrejs/dagre": "github:dagrejs/dagre",
    "@eslint/js": "^9.33.0",
    "@google/genai": "^1.3.0",
    "@google/generative-ai": "^0.24.1",
    "@heroui/react": "^2.8.0",
    "@hookform/resolvers": "^5.0.1",
    "@monaco-editor/react": "^4.7.0",
    "@radix-ui/react-context-menu": "^2.2.15",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@supabase/ssr": "^0.6.1",
    "@supabase/supabase-js": "^2.49.9",
    "@tailwindcss/postcss": "^4.1.8",
    "@xyflow/react": "^12.8.2",
    "ai": "^4.3.16",
    "axios": "^1.11.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^1.2.1",
    "d3-force": "^3.0.0",
    "d3-hierarchy": "^3.1.2",
    "dagrejs": "^0.2.1",
    "date-fns": "^3.3.1",
    "dexie": "^4.0.11",
    "dockerode": "^4.0.7",
    "elkjs": "^0.10.0",
    "es-module-lexer": "^1.7.0",
    "eslint-linter-browserify": "^9.33.0",
    "framer-motion": "^12.23.5",
    "fuzzysort": "^3.1.0",
    "gsap": "^3.13.0",
    "highlightjs": "^9.16.2",
    "jsonwebtoken": "^9.0.2",
    "lucide-react": "^0.511.0",
    "motion": "^12.16.0",
    "nanoid": "^5.1.5",
    "next": "15.2.4",
    "next-themes": "^0.4.6",
    "octokit": "^5.0.3",
    "prismjs": "^1.30.0",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-hook-form": "^7.56.4",
    "reactflow": "^11.11.4",
    "sonner": "^2.0.4",
    "swr": "^2.3.3",
    "tailwind-merge": "^3.3.0",
    "tar": "^7.4.3",
    "uuid": "^11.1.0",
    "vaul": "^1.1.2",
    "ws": "^8.18.3",
    "zod": "^3.25.46"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@types/base-64": "^1.0.0",
    "@types/dockerode": "^3.3.42",
    "@types/node": "^18.11.9",
    "@types/react": "19.0.12",
    "@types/socket.io-client": "^1.4.36",
    "@types/three": "^0.177.0",
    "@typescript-eslint/eslint-plugin": "^6.3.0",
    "@typescript-eslint/parser": "^6.3.0",
    "autoprefixer": "^10.4.21",
    "concurrently": "^9.1.2",
    "eslint": "^8.57.1",
    "eslint-config-next": "15.2.4",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-import": "^2.28.0",
    "eslint-plugin-prettier": "^5.0.0",
    "eslint-plugin-unused-imports": "^3.0.0",
    "postcss": "^8.5.4",
    "prettier": "^3.0.1",
    "tailwindcss": "^4.1.8",
    "ts-node": "^10.9.2",
    "tw-animate-css": "^1.3.3",
    "typescript": "^5.8.3"
  },
  "overrides": {
    "@types/react": "19.0.12"
  }
}
`,
    },
    '/.env': {
        code: `REACT_APP_API_KEY=your_mock_api_key_123`,
    },
    '/test1/test2/test/3/test.js': {
        code: `test`
    },
    '/test1/test2/now.js': {
        code: `/test1/test2/test/3/test.js`
    }
};

export default mockSandpackFiles;


export const domeMetadata = {
    slug: "button",
    dependencies: [
        {
            name: "tailwind",
            version: "latest"
        },
        {
            name: "@liveblocks/react",
            version: "latest"
        },
        {
            name: "nanoid",
            version: "latest"
        },
    ],
    tags: ["button", "input", "form"],
    description: "a modern button component"
}

export const ToolNodes = [
    {
        id: 'httpRequest',
        name: 'Http Request',
        type: 'tool',
        defaultData: {
            method: 'Get',
            url: ''
        }
    },
    {
        id: 'databaseQuery',
        name: 'Database Query',
        type: 'tool',
        defaultData: {
            connectionString: '',
            key: ''
        }
    }
]

export const themes = [
    {
        name: "Dark",
        value: "dark"
    },
    {
        name: "Amethyst",
        value: amethyst
    },
    {
        name: "SandpackDark",
        value: sandpackDark
    },
    {
        name: "CyberPunk",
        value: cyberpunk
    },
    {
        name: "AtomDark",
        value: atomDark
    }
]

export const template = [
    {
        value: "react-ts",
        name: "React-ts"
    },
    {
        value: "react",
        name: "React-js"
    },
    {
        value: "vanilla",
        name: "Vanilla-js"
    },
    {
        value: "vanilla-ts",
        name: "Vanilla-ts"
    },
    {
        value: "angular",
        name: "Angular"
    },
    {
        value: "vue",
        name: "Vue"
    },
    {
        value: "nextjs",
        name: "Next-js"
    },
    {
        value: "astro",
        name: "Astro"
    },
    {
        value: "node",
        name: "Node"
    },
    {
        value: "vite-react",
        name: "Vite-react-js"
    },
    {
        value: "vite-react-ts",
        name: "Vite-react-ts"
    }
]

export const nav_links = [
    {
        title: "home",
        href: "#home",
    },
    {
        title: "features",
        href: "#features",
    },
    {
        title: "pricing",
        href: "#pricing",
    },
    {
        title: "about",
        href: "#about",
    }
]

export const service_texts = [
    {
        title: 'Real-Time Co-Editing',
        desc: "Collaborate on document design, and projects with teammates as if you're all in the same room, with AI-powered suggestions that enhance your work.",
        Icon: LocationEdit,
        color: '#7bf1a8'
    },
    {
        title: "Intelligent Assistance",
        desc: "Get automated recommendations, insights, and content generation from AI to speed up decision-making and problem solving.",
        Icon: Brain,
        color: '#51a2ff'
    },
    {
        title: "Version Control & Speed",
        desc: "Keep track of every change and conversation. Our platform ensures you never lose important feedback and decisions.",
        Icon: Gauge,
        color: '#ff6467'
    },
    {
        title: `Smart Meeting Support`,
        desc: `AI-generated meetings notes, agendas, and summaries help you stay focused on what matters, making every meeting more productive.`,
        Icon: NotebookPen,
        color: '#51a2ff'
    },
    {
        title: `Seamless Integrations`,
        desc: `Easily integrate with tools you already use like Google Drive, Slack, and more, keeping your workflow uninterrupted.`,
        Icon: Network,
        color: '#ff6467'
    },
    {
        title: `Data Analysis & Visualization`,
        desc: `Let our AI help you analyze and visualize data in real-time, making complex data sets easy to understand and act upon.`,
        Icon: ChartLine,
        color: '#7bf1a8'
    }
]

export const systemContent = {
    role: "system",
    parts: [
        {
            text: `you are a helpful, polite, intelligent voice assistant. you assist with general knowledge, reasoning, creative task , and live search when needed.
            if the user asked something ambiguous. ask a clarifying question. keep your answer short and conversational when appropriate`
        }
    ]
}

export const MARKETING_URL = "/";

export const DASHBOARD_URL = "/dashboard";
export const DASHBOARD_DRAFTS_URL = `${DASHBOARD_URL}/drafts`;
export const DASHBOARD_GROUP_URL = (id: string) =>
    `${DASHBOARD_URL}/group/${id}`;

export const DOCUMENT_URL = (type: DocumentType, id: string) =>
    `/${type}/${id}`;