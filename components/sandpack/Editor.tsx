// components/CodeEditor.tsx
'use client';

import { Sandpack } from '@codesandbox/sandpack-react';

export function CodeEditor() {
    return (
        <Sandpack
            template="react"
            files={{
                '/App.js': {
                    code: `
            export default function App() {
              return <h1>Hello from Sandpack!</h1>;
            }
          `,
                    active: true,
                },
            }}
            theme="dark"
            options={{
                showNavigator: true,
                showTabs: true,
                showLineNumbers: true,
                editorHeight: 400,
            }}
        />
    );
}
