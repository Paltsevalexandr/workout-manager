import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./globals.scss";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { ExercisesProvider, MuscleGroupsProvider, PeformedSessionsProvider, PlannedSessionsProvider, WorkoutsProvider } from "./providers";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Workout Manager",
    description: "Your best helper in your training",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <Header />

                <WorkoutsProvider>
                    <ExercisesProvider>
                        <MuscleGroupsProvider>
                            <PeformedSessionsProvider>
                                <PlannedSessionsProvider>
                                    {children}
                                </PlannedSessionsProvider>
                            </PeformedSessionsProvider>
                        </MuscleGroupsProvider>
                    </ExercisesProvider>
                </WorkoutsProvider>

                <Footer />
            </body>

        </html>
    );
}
