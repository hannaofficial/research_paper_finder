import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "./sidebar";
import { SidebarProvider } from "./Globalcontext";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "ResFinder",
  description: "developing my hanna",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  flex   `}
      >
        
        <SidebarProvider>
          
          
            <Sidebar />
           
          <main className=" flex-grow w-5/6">
            {children}
          </main>
          
          
        </SidebarProvider>
      </body>
    </html>
  );
}