import { UserInfo } from '@/app/entities/entityTypes';
import { UserRepository } from './infrastructureTypes';
import { db, auth } from './firebase';
import { getDocs, collection, where, query, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useCallback } from 'react';

const useUserRepository = (): UserRepository => {

    const getAllCompanyUsers = useCallback(async (companyId: string): Promise<UserInfo[]> => {
        try {
            const querySnapshot = await getDocs(query(collection(db, 'user'), where("companyId", "==", companyId)))
            return querySnapshot.docs.map(doc => doc.data() as UserInfo);
        }
        catch (e) {
            return []
        }
    }, [])

    const getUserById = useCallback(async (id: string): Promise<UserInfo | null> => {
        try {
            const userDocRef = doc(db, 'user', id);
            const userSnap = await getDoc(userDocRef);
            if (userSnap.exists()) {
                return userSnap.data() as UserInfo;
            }
            else {
                return null;
            }
        }
        catch (e) {
            return null;
        }
    }, [])

    const addUser = useCallback(async (newUser: Omit<UserInfo, "id">, password: string,): Promise<boolean> => {
        try {
            const newUserCredential = await createUserWithEmailAndPassword(auth, newUser.email, password);
            const createdUser = newUserCredential.user;

            const userDocRef = doc(collection(db, 'user'), createdUser.uid)
            await setDoc(userDocRef, newUser);

            return true;
        }
        catch (e) {
            return false;
        }
    }, [])

    const updateUser = useCallback(async (id: string, updatedUser: Partial<UserInfo>): Promise<boolean> => {
        try {
            const userDocRef = await doc(db, 'user', id)
            await updateDoc(userDocRef, updatedUser);
            return true
        }
        catch (e) {
            return false
        }
    }, [])

    const loginWithEmail = useCallback(async (email: string, password: string): Promise<{ token: string, userInfo: UserInfo | null, userCredential: any } | null> => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            const userInfo = await getUserById(user.uid);
            const token = await user.getIdToken();
    
            //remover esse userCredential
            return { token, userInfo, userCredential }
        }
        catch(e) {
            return null
        }
    }, [])

    const logoutCurrentUser = useCallback(async () => {
        await signOut(auth);
    }, [])

    return {
        getAllCompanyUsers,
        getUserById,
        addUser,
        updateUser,
        loginWithEmail,
        logoutCurrentUser
    }
}

export { useUserRepository }