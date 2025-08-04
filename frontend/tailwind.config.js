/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ['class'],
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				// ...other colors...
				border: 'hsl(var(--border))',
				// ...more colors...
			},
			// <-- Add this block below colors, inside extend
			borderColor: (theme) => ({
				...theme('colors'),
				border: 'hsl(var(--border))',
			}),
		},
	},
	plugins: [require('tailwindcss-animate')],
};
