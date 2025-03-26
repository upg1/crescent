import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from '@/components/providers/SessionProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { NavProvider } from '@/components/navigation/NavContext'
import { FeedbackProvider } from '@/components/pedagogy/FeedbackContext'
import { MainNav } from '@/components/navigation/MainNav'

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: "Crescent - Interactive Learning",
  description: "Interactive courseware for mathematics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable} font-sans antialiased min-h-screen`}>
        <SessionProvider>
          <AuthProvider>
            <NavProvider>
              <FeedbackProvider>
                <MainNav />
                <main className="pt-16">
                  {children}
                </main>
              </FeedbackProvider>
            </NavProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  )
}