import {useEffect, useState} from "react";
import {collection, getDocs, getFirestore, query, where} from "firebase/firestore";
import {Boss, BossesData} from "../Data";
import {Error} from "../Data";


interface Props {
    path: string,
    role: string,
}


const useGetAdminsByRole = (props: Props): BossesData => {

    const { path, role } = props;

    const [data, setData] = useState<Boss[]>([]);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState<Error>({ show: false, message: "" });
    const [notFound, setNotFound] = useState(false);

    useEffect(()=>{
        (async ()=>{
            try {
                const db = getFirestore();
                const array: Boss[] = [];
                let q = query(collection(db, path), where("role", "==", role));
                setSearching(true);
                const bossesSnapShot = await getDocs(q);
                setSearching(false);
                if (bossesSnapShot.size === 0){
                    setNotFound(true);
                }
                bossesSnapShot.forEach((boss) => {
                    array.push({
                        id: boss.id,
                        name: boss.get("name"),
                        uid: boss.get("uid"),
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