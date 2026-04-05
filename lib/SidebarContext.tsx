"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface SidebarContextType {
    collapsed: boolean;
    toggle: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
    collapsed: false,
    toggle: () => { },
});

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    
    useEffect(() => {
        const saved = localStorage.getItem("grindspace_sidebar_collapsed");
        if (saved === "true") {
            setCollapsed(true);
        }
    }, []);

    const toggle = () => {
        setCollapsed((v) => {
            const nextVal = !v;
            localStorage.setItem("grindspace_sidebar_collapsed", nextVal.toString());
            return nextVal;
        });
    };
    
    return (
        <SidebarContext.Provider value={{ collapsed, toggle }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    return useContext(SidebarContext);
}
