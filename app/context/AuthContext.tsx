import React, { createContext, useState } from 'react'
import { AuthContextStructure } from '../infrastructure/infrastructureTypes';
import { User } from '../entities/entityTypes';
import { useUserRepository } from '../infrastructure/userRepository';


const AuthContext = createContext<AuthContextStructure | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const { loginWithEmail, logout } = useUserRepository();
    const [loggedUser, setLoggedUser] = useState<User | null>(null);
    //const [token, setToken] = useState<string | undefined | null>();

    const validateEmail = (email: string): boolean => {
        const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailFormat.test(email);
    }

    const login = async (email: string, password: string): Promise<User | null> => {

        if(!validateEmail(email) || password.length < 8) {
            return null
        }

        let loginData = await loginWithEmail(email, password);

        if (!loginData || loginData.userInfo == null || loginData.token.length < 1) {
            return null
        }

        //setToken(loginData.token);
        setLoggedUser({
            info: loginData.userInfo,
            token: loginData.token,
            config: null
        })

        return loggedUser
    }

    return (
        <AuthContext.Provider value={{
            loggedUser,
            //token,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}
