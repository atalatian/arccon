import {Admin, Department, DepartmentsData, Error} from "../Data";
import {useEffect, useState} from "react";
import {collection, getDocs, getFirestore, query} from "firebase/firestore";

interface Props {
    path: string,
}

const useGetDepartments = (props: Props): DepartmentsData => {

    const { path } = props;

    const [data, setData] = useState<Department[]>([]);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState<Error>({ show: false, message: "" });
    const [notFound, setNotFound] = useState(false);

    useEffect(()=>{
        (async ()=>{
            try {
                const db = getFirestore();
                const array: Department[] = [];
                let q = query(collection(db, path));
                setSearching(true);
                const departmentsSnapShot = await getDocs(q);
                setSearching(false);
                if (departmentsSnapShot.size === 0){
                    setNotFound(true);
                }
                departmentsSnapShot.forEach((department) => {
                    array.push({
                        id: department.id,
                        name: department.get("name"),
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
        searching,
        error,
        notFound,
    }
}

export default useGetDepartments;