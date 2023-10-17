import {Admin, Error, User} from "../Data";
import {useContext, useEffect, useState} from "react";
import {Auth} from "../Auth";
import {collection, getDocs, getFirestore, query, where} from "firebase/firestore";

interface Props {
    path: string,
}

export interface UserData {
    data: User | undefined,
    notFound: boolean,
    error: Error,
    searching: boolean,
}


const useGetUserByUID = (props: Props): UserData => {

    const { path } = props;

    const [data, setData] = useState<User>({ id: "", name: "", uid: "", role: "" });
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState<Error>({ show: false, message: "" });
    const [notFound, setNotFound] = useState(false);
    const token = useContext(Auth)?.token;

    useEffect(()=>{
        (async ()=>{
            try {
                const db = getFirestore();
                let userData: User = { id: "", name: "", uid: "", role: "" };
                setData(userData);
                setSearching(false);
                setError({ show: false, message: "" });
                setNotFound(false);
                let q = query(collection(db, path), where("uid", "==", token));
                setSearching(true);
                const usersSnapShot = await getDocs(q);
                setSearching(false);
                if (usersSnapShot.size === 0){
                    setNotFound(true);
                }
                usersSnapShot.forEach((user)=>{
                    userData = {
                        id: user.id,
                        name: user.get("name"),
                        department: user.get("department"),
                        role: user.get("role"),
                        uid: user.get("uid"),
                    }
                })
                setData(userData);
            } catch (e: any) {
                setNotFound(true);
                setSearching(false);
                setError({ show: true, message: e })
            }
        })()
    }, [token])

    return {
        data,
        searching,
        error,
        notFound,
    }
}

export default useGetUserByUID;