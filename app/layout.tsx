import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Toaster} from "sonner";
import React from "react";
import Provider from "@/app/Provider";
import {EditorProvider} from "@/context/EditorContext";
import {GlobalFileProvider} from "@/context/FileContext";
import {GlobalUserProvider} from "@/context/UserContext";
import {WorkSpaceProvider} from "@/context/WorkSpaceContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simplify",
  description: "The AI Writing Partner For Seamless Teamwork",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={'dark'}>
      <body id={'no-scrollbar'}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Provider>
          <WorkSpaceProvider>
              <EditorProvider>
                  <GlobalFileProvider>
                      <GlobalUserProvider>
                          {children}
                      </GlobalUserProvider>
                  </GlobalFileProvider>
              </EditorProvider>
          </WorkSpaceProvider>
      </Provider>
      <Toaster theme={"dark"}/>
      </body>
    </html>
  );
}
