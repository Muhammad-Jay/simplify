import * as eslint from 'eslint-linter-browserify'
// import eslintReactPlugin from 'eslint-plugin-react'

const linterInstance = new eslint.Linter();
// linterInstance.defineRule('react/jsx-uses-react', eslintReactPlugin.rules['jsx-uses-react'])
// linterInstance.defineRule('react/jsx-uses-vars', eslintReactPlugin.rules['jsx-uses-vars'])

const code = `const defaultOptions = {
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        wordWrap: 'on' as 'on' | 'off' | 'wordWrapColumn' | 'bounded', // Type assertion
        automaticLayout: true, // Auto-resizes with parent container
        readOnly: readOnly,
        lineNumbers: 'on' as 'on' | 'off' | 'relative' | 'interval',
        glyphMargin: false,
        folding: true,
        // contextmenu: false, // You might want to disable the default context menu if you use RadixUI ones
        tabSize: 2,
        insertSpaces: true,
        ...options, // Allow overriding default options
    };`

const eslintConfig = {
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
    },
    rules: {
        'no-unused-vars': 'error',
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
    },
}

const results = linterInstance.verify(code, {
    rules: {
        semi: ['error', 'never'],

    }
})

export { linterInstance, eslintConfig }
