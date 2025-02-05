import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../components/context/auth-context";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Helionix Investment",
  description: "Découvrez Helionix – votre passerelle vers l'investissement dans les énergies renouvelables. Apprenez-en plus sur notre mission de démocratiser l'accès à l'énergie solaire, éolienne, hydroélectrique et aux innovations vertes. Explorez notre histoire, nos projets et notre vision pour un avenir durable grâce à des opportunités d'investissement intelligentes, transparentes et accessibles.",
  icons: {
    icon: "/helionixIcon.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/helionixIcon.png" type="image/png" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
