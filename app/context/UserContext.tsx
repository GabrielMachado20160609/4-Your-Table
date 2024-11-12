import React, { createContext, useContext, useState } from 'react'
import { useUserRepository } from '../infrastructure/userRepository'
import { UserRepository, SetState } from '../infrastructure/infrastructureTypes'
import { UserConfig, UserInfo } from '../entities/entityTypes'
import { useAuthContext } from './AuthContext';
import { useCompanyContext } from './CompanyContext';

const UserContext = createContext<any>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { addUser, getAllCompanyUsers, getUserById, updateUser } = useUserRepository();
    const { loggedUser } = useAuthContext();
    const { currentCompany } = useCompanyContext();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userConfig, setUserConfig] = useState<UserConfig>();

    const validateEmail = (email: string): boolean => {
        const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailFormat.test(email);
    }

    const newUser = async (user: Omit<UserInfo, "id">, password: string): Promise<boolean> => {
        if(loggedUser?.info.role != 'admin'
            || user.companyId.length < 1
            || !validateEmail(user.email)
            || user.name.length < 1
        ) {
            return false
        }

        try {
            return await addUser(user, password)
        }
        catch(e) {
            return false
        }
    }

    const getCompanyUserById = async (id: string): Promise<UserInfo | null> => {
        if(id == null || id.length < 1) {
            return null
        }

        try {
            let res = await getUserById(id)

            if(res == null || res.companyId != currentCompany.id) {
                return null
            }

            return res;
        }
        catch(e) {
            return null
        }
    }

    const getCompanyUsers = async (page?: number, maxIndex?: number): Promise<UserInfo[] | null> => {
        try {
            let res = await getAllCompanyUsers(currentCompany.id);

            if(res == null || res.length < 1) {
                return null
            }

            //paginação opcional
            if(page && maxIndex && ((page-1) * maxIndex) < res.length) {
                let startIndex = (page-1) * maxIndex;
                return res.slice(startIndex, startIndex + maxIndex)
            }

            return res;
        }
        catch(e) {
            return null
        }
    }

    const updateUserInfo = async (id: string, updatedUser: Partial<UserInfo>): Promise<boolean> => {
        if(id.length < 1 || id == null || updateUser == null) {
            return false
        }

        try {
            return await updateUser(id, updatedUser)
        }
        catch(e) {
            return false
        }
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
            updateUserInfo,
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