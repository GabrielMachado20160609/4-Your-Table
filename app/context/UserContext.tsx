import React, { createContext, useContext, useState } from 'react'
import { useUserRepository } from '../infrastructure/userRepository'
import { UserRepository, SetState } from '../infrastructure/infrastructureTypes'
import { UserConfig, UserInfo } from '../entities/entityTypes'

const UserContext = createContext<any>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { addUser, getAllCompanyUsers, getUserById, updateUser } = useUserRepository();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userConfig, setUserConfig] = useState<UserConfig>();

    const newUser = (admin: UserInfo, adminPassword: string, user: UserInfo, password: string,): void => {
        
    }

    const getCompanyUserById = () => {

    }

    const getCompanyUsers = () => {

    }

    const updateUserName = () => {
        
    }

    const updateUserConfigs = () => {

    }

    return (
        <UserContext.Provider value={{
            isLoading,
            setIsLoading,
            userConfig,
            setUserConfig,
            newUser,
            getCompanyUserById,
            getCompanyUsers,
            updateUserName,
            updateUserConfigs
        }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = (): UserRepository => {
    const context = useContext(UserContext);
    if (!context) {
      throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};