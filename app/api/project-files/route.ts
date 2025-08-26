import { NextResponse } from 'next/server';

// This type matches what SandpackProvider expects for its 'files' prop
type SandpackFiles = {
    [filePath: string]: {
        code: string;
        hidden?: boolean;
        readOnly?: boolean;
    };
};

// This is your mock data representing a project's files.
// In a real application, this would come from:
// 1. Fetching a package tarball from Supabase Storage.
// 2. Extracting its contents.
// 3. Reading package.json and other relevant files.
// 4. Returning them in this SandpackFiles format.
const mockProjectFiles: SandpackFiles = {
    '/index.js': {
        code: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n`,
    },
    '/App.js': {
        code: `import React from 'react';\nimport { Button } from './components/Button';\nimport { Header } from './components/Header';\nimport './styles/global.css';\n\nexport default function App() {\n  return (\n    <div style={{ padding: 20, fontFamily: 'sans-serif', backgroundColor: '#282c34', color: '#f0f0f0' }}>\n      <Header title="Simplify Project" />\n      <h1>Welcome to your Project!</h1>\n      <Button text="Click Me" />\n      <p>This is a live editable project in Simplify.</p>\n    </div>\n  );\n}`,
    },
    '/components/Button.js': {
        code: `import React from 'react';\n\nexport function Button({ text }) {\n  return <button style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#61dafb', color: 'white', cursor: 'pointer', fontSize: '16px' }}>{text}</button>;\n}`,
    },
    '/components/Header.js': {
        code: `import React from 'react';\n\nexport function Header({ title }) {\n  return (\n    <header style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '20px' }}>\n      <h2 style={{ color: '#61dafb' }}>{title}</h2>\n    </header>\n  );\n}`,
    },
    '/styles/global.css': {
        code: `body {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-family: 'Inter', sans-serif;\n}\n\nh1 {\n  color: #f0f0f0;\n}\n`,
    },
    '/package.json': {
        code: `{
  "name": "my-simplify-project",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}`,
        hidden: true, // Hide package.json in the explorer/editor by default
    },
};

export async function GET() {
    // In a real app, you might get a project ID from query params
    // const projectId = request.nextUrl.searchParams.get('projectId');
    // Then fetch files for that projectId from your database/storage

    return NextResponse.json(mockProjectFiles);
}
