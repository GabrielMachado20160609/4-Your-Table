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
            if(userSnap.exists()) {
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

    const addUser = useCallback(async (admin: UserInfo, adminPassword: string, newUser: UserInfo, password: string,): Promise< string | null> => {
        try {
            let admEmail = admin.email;

            const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, password);
            const createdUser = userCredential.user;

            const userDocRef = doc(collection(db, 'user'), createdUser.uid)
            await setDoc(userDocRef, newUser);

            await logout();
            let logged = await loginWithEmail(admEmail, adminPassword)
            let token = logged?.token

            if(token?.length) {
                return token;
            }

            else {
                return null
            }
        }
        catch (e) {
            return null;
        }
    }, [])

    const updateUser = useCallback(async (id: string, updatedUser: Partial<UserInfo>): Promise<boolean> => {
        try {
            const userDocRef = await doc(db, 'user', id)
            await updateDoc(userDocRef, updatedUser);
            return true
        }
        catch(e) {
            return false
        }
    }, [])

    const loginWithEmail = useCallback(async (email: string, password: string): Promise<{token: string, userInfo: UserInfo | null}> => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userInfo = await getUserById(user.uid);

        const token = await user.getIdToken();
        
        return { token, userInfo }
    }, [])

    const logout = useCallback(async () => {
        await signOut(auth);
    }, [])

    return {
        getAllCompanyUsers,
        getUserById,
        addUser,
        updateUser,
        loginWithEmail,
        logout
    }
}

export { useUserRepository }