import React, { createContext, useContext, useState } from 'react'
import { AuthContextStructure } from '../infrastructure/infrastructureTypes';
import { User } from '../entities/entityTypes';
import { useUserRepository } from '../infrastructure/userRepository';


const AuthContext = createContext<AuthContextStructure | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const { loginWithEmail, logoutCurrentUser } = useUserRepository();
    const [loggedUser, setLoggedUser] = useState<User | null>(null);
    //const [token, setToken] = useState<string | undefined | null>();

    const [credential, setCredential] = useState<any>();

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

        let userStructured = {
            info: loginData.userInfo,
            token: loginData.token,
            config: null
        } as User

        //setToken(loginData.token);
        setLoggedUser(userStructured)
        setCredential(loginData.userCredential)
        localStorage.setItem('logged_user', JSON.stringify(userStructured))

        return loggedUser
    }

    const logout = async () => {
        localStorage.clear();
        setLoggedUser(null);
        logoutCurrentUser();
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

export const useAuthContext = (): AuthContextStructure => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuthContext must be used within a AuthProvider');
    }
    return context;
};