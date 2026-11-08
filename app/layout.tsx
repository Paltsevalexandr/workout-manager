import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./globals.scss";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { AppProviders } from "./providers";
import { getCategories } from "@/data/categories";
import { getMuscleGroups } from "@/data/muscleGroups";
import { getExercises } from "@/data/exercises";

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

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [categories, muscleGroups, exercises] = await Promise.all([
        getCategories(),
        getMuscleGroups(),
        getExercises(),
    ]);

    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <Header />

                <AppProviders
                    exercises={exercises}
                    categories={categories}
                    muscleGroups={muscleGroups}
                >
                    {children}
                </AppProviders>

                <Footer />
            </body>

        </html>
    );
}
