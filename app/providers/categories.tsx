"use client";

import { createContext, useContext } from "react";
import { Category } from "@/_types";

type CategoriesContextType = {
    categories: Category[];
}
type Props = {
    children: React.ReactNode;
    categories: Category[];
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children, categories }: Props) {
    return (
        <CategoriesContext.Provider value={{ categories }}>
            {children}
        </CategoriesContext.Provider>
    )
}

export function useCategoriesContext() {
    const context = useContext(CategoriesContext);
    if (!context) {
        throw new Error("useCategoriesContext must be used within CategoriesProvider")
    }
    return context;
}
