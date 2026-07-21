import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { PomodoroProvider } from "@/components/pomodoro/PomodoroProvider";

// The root layout renders <Sidebar/>, an async server component that queries
// the DB (getFullCurriculum / getCurrentTopic). Force-dynamic so `next build`
// never prerenders any page's shell against the DB — otherwise the auto-
// generated /_not-found page tries to render at build and fails with
// PrismaClientKnownRequestError (ECONNREFUSED) when no Postgres is up.
export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LearnTheStack — AI Tutor",
  description: "9-month TypeScript full-stack mastery curriculum with AI tutoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <PomodoroProvider>
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </div>
        </PomodoroProvider>
      </body>
    </html>
  );
}
