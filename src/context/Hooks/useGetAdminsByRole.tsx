import {useEffect, useState} from "react";
import {collection, getDocs, getFirestore, query, where} from "firebase/firestore";
import {Admin, AdminsData} from "../Data";
import {Error} from "../Data";


interface Props {
    path: string,
    role: string,
}


const useGetAdminsByRole = (props: Props): AdminsData => {

    const { path, role } = props;

    const [data, setData] = useState<Admin[]>([]);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState<Error>({ show: false, message: "" });
    const [notFound, setNotFound] = useState(false);

    useEffect(()=>{
        (async ()=>{
            try {
                const db = getFirestore();
                const array: Admin[] = [];
                let q = query(collection(db, path), where("role", "==", role));
                setSearching(true);
                const adminsSnapShot = await getDocs(q);
                setSearching(false);
                if (adminsSnapShot.size === 0){
                    setNotFound(true);
                }
                adminsSnapShot.forEach((admin) => {
                    array.push({
                        id: admin.id,
                        name: admin.get("name"),
                        department: admin.get("department"),
                        order: admin.get("order"),
                        uid: admin.get("uid"),
                    })
                })
                setData(array);
            } catch (e: any){
                setNotFound(true);
                setSearching(false);
                setError({ show: true, message: e })
            }
        })()
    }, [])

    return {
        data,
        notFound,
        error,
        searching,
    }
}

export default useGetAdminsByRole;