import { User, UserInfo } from "@/app/entities/entityTypes";
import { Dispatch, SetStateAction } from "react";

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type UserRepository = {
    getUserById(userId: string): Promise<UserInfo | null>;
    getAllCompanyUsers(companyId: string): Promise<UserInfo[]>;
    addUser(newUser: Omit<UserInfo, "id">, password: string): Promise<boolean>;
    updateUser(id: string, updatedUser: Partial<UserInfo>): Promise<boolean>;
    //remover o userCredential do loginWithEmail
    loginWithEmail(email: string, password: string): Promise<{ token: string, userInfo: UserInfo | null, userCredential: any } | null>;
    logoutCurrentUser(): void;
}

export type AuthContextStructure = {
    loggedUser: User | undefined | null;
    //token: string | undefined | null;
    login(email: string, password: string): Promise<User | null>;
    logout(): void;
}