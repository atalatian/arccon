import {useState} from "react";
import {collection, getDocs, getFirestore, query, where} from "firebase/firestore";
import {Admin, AdminsData} from "../Data";
import {Error} from "../Data";

interface Props {
    path: string,
}


export interface AdminsFunctions extends AdminsData{
    getAdminsByDepartment: (department: string) => void,
}



const useGetAdminsByDepartment = (props: Props): AdminsFunctions => {

    const { path } = props;

    const [data, setData] = useState<Admin[]>([]);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState<Error>({ show: false, message: "" });
    const [notFound, setNotFound] = useState(false);

    const getAdminsByDepartment = async (department: string) => {
        try {
            const db = getFirestore();
            setSearching(false);
            setError({ show: false, message: "" });
            setNotFound(false);
            const array: Admin[] = [];
            let q = query(collection(db, path), where("department", "==", department));
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
    }

    return {
        data,
        notFound,
        error,
        searching,
        getAdminsByDepartment,
    }
}

export default useGetAdminsByDepartment;