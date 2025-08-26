/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Ensure Inter is set
            },
            colors: {
                // Define custom colors if needed, e.g., for your cyan brand color
                brandCyan: '#61dafb', // Example Cyan
            }
        },
    },
    plugins: [],
}
