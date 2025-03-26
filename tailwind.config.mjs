/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ['class', "class"],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			'primary-dark': 'var(--primary-dark)',
  			'primary-foreground': 'var(--primary-foreground)',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			paper: 'var(--paper)',
  			'paper-foreground': 'var(--paper-foreground)',
  			'paper-accent': 'var(--paper-accent)',
  			'accent-color': 'var(--accent-color)',
  			'accent-light': 'var(--accent-light)',
  			'accent-border': 'var(--accent-border)',
  			'accent-shadow': 'var(--accent-shadow)',
  			'text-dark': 'var(--text-dark)',
  			'text-medium': 'var(--text-medium)',
  			'text-light': 'var(--text-light)',
  			'glass-bg': 'var(--glass-bg)',
  			'glass-border': 'var(--glass-border)',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-sans)',
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'var(--font-mono)',
  				'ui-monospace',
  				'monospace'
  			],
  			serif: [
  				'Georgia',
  				'serif'
  			]
  		},
  		backgroundImage: {
  			glassmorphism: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)',
  			'accent-gradient': 'var(--accent-gradient, linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%))',
  			'accent-gradient-light': 'var(--accent-gradient-light, linear-gradient(135deg, color-mix(in srgb, var(--primary) 60%, white) 0%, var(--primary) 100%))'
  		},
  		boxShadow: {
  			glass: 'var(--glass-shadow)',
  			accent: '0 2px 8px var(--accent-shadow)'
  		},
  		animation: {
  			fadeIn: 'fadeIn 0.3s ease-out forwards',
  			glow: 'glow 2s ease-in-out'
  		},
  		keyframes: {
  			fadeIn: {
  				from: {
  					opacity: '0',
  					transform: 'translateY(10px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			glow: {
  				'0%': {
  					boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)'
  				},
  				'50%': {
  					boxShadow: '0 0 20px rgba(59, 130, 246, 0.7)'
  				},
  				'100%': {
  					boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)'
  				}
  			}
  		},
  		backdropFilter: {
  			none: 'none',
  			blur: 'blur(16px) saturate(180%)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;