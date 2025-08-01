import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";

const inter = Inter({subsets: ["latin"]});

export const metadata = {
  title: "MediCure - Smart Care for a Healthier You",
  description: "Connect with Top Doctors Worldwide • AI-Powered Health Assistant • Instant Telemedicine & Pharmacy",
  icons:{
    icon: "/logo-single.svg"
  }
};

export default function RootLayout({ children }) {
  return (

    <ClerkProvider appearance={{
      baseTheme: dark,

      layout:{
        logoImageUrl: '/logo-single.svg',
        socialButtonsVariant: 'iconButton'
      },

      elements:{
        userButtonAvatarBox:{
          width: '45px',
          height: '45px'
        }
      }
    }}>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${inter.className}`}>

              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >

                <Header/>

                <main className="min-h-screen">

                {children}

              </main>

              <Toaster richColors />

            

                  {/* Footer Component */}

                  <footer className="bg-muted/50 py-10">
                    <div className="container mx-auto px-4 text-center text-gray-200">
                      <p> © Developed and Designed By Priyanshu</p>
                    </div>

                  </footer>


              </ThemeProvider>

            

          </body>
        </html>

    </ClerkProvider>
  );
}
