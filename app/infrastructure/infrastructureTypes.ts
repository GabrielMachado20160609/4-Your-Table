import { User, UserInfo } from "@/app/entities/entityTypes";
import { Dispatch, SetStateAction } from "react";

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type UserRepository = {
    getUserById(userId: string): Promise<UserInfo | null>;
    getAllCompanyUsers(companyId: string): Promise<UserInfo[]>;
    addUser(admin: UserInfo, adminPassword: string, newUser: UserInfo, password: string): Promise<string | null>;
    updateUser(id: string, updatedUser: Partial<UserInfo>): Promise<boolean>;
    loginWithEmail(email: string, password: string): Promise<{ token: string, userInfo: UserInfo | null }>;
    logout(): void;
}

export type AuthContextStructure = {
    loggedUser: User | undefined | null;
    //token: string | undefined | null;
    login(email: string, password: string): Promise<User | null>;
    logout(): void;
}