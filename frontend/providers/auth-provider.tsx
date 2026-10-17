'use client'
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children:React.ReactNode}) {
    const [token, setToken] = useState<string | null>(null);
    const [chatId, setChatId] = useState<string | null>(null);

    useEffect(() => {
        setToken(sessionStorage.getItem("access_token"));
        setChatId(sessionStorage.getItem("chat_id"));
    }, []);

    function login(accessToken: string, id: string) {
        sessionStorage.setItem("access_token", accessToken);
        sessionStorage.setItem("chat_id", id);
        setToken(accessToken);
        setChatId(id);
    }

    function logout() {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("chat_id");
        setToken(null);
        setChatId(null);
    }

    return (
        <AuthContext.Provider value={{
            token,
            chatId,
            isAuthenticated: !!token,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth deve ser usado dentro do AuthProvider");
    }
    return context
}