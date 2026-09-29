"use client";

import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { Category } from "@/_types";

type CategoriesContextType = {
    categories: Category[];
    setCategories: Dispatch<SetStateAction<Category[]>>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
    const categoriesInitial: Category[] = [
        { id: 1, name: "strength", parentId: null, isSystem: true },
        { id: 2, name: "cardio", parentId: null, isSystem: true },
        { id: 3, name: "mobility", parentId: null, isSystem: true },
        { id: 4, name: "stretching", parentId: null, isSystem: true },
        { id: 5, name: "stamina", parentId: null, isSystem: true },
        { id: 6, name: "recovery", parentId: null, isSystem: true },
        { id: 7, name: "balance", parentId: null, isSystem: true },
        { id: 8, name: "plyometric", parentId: null, isSystem: true },
    ];
    const [categories, setCategories] = useState<Category[]>(categoriesInitial);

    return (
        <CategoriesContext.Provider value={{ categories, setCategories }}>
            {children}
        </CategoriesContext.Provider>
    )
}

export function useCategoriesContext() {
    const context = useContext(CategoriesContext);
    if (!context) {
        throw new Error('useCategoriesContext must be used within CategoriesProvider')
    }
    return context;
}
