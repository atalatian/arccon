import React, {createContext} from "react";
import useGetAdminsByRole from "./Hooks/useGetAdminsByRole";
import useGetDepartments from "./Hooks/useGetDepartments";
import useGetBossesByRole from "./Hooks/useGetBossesByRole";
import useGetAdminsByDepartment, {AdminsFunctions} from "./Hooks/useGetAdminsByDepartment";
import useGetUserByUID, {UserData} from "./Hooks/useGetUserByUID";

export interface Department {
    id: string,
    name: string,
}

export interface Admin {
    id: string,
    name: string,
    department: string,
    order: number,
    uid: string,
}

export interface Boss{
    id: string,
    name: string,
    uid: string,
}

export interface Error{
    show: boolean,
    message: string,
}

export interface AdminsData{
    data: Admin[],
    notFound: boolean,
    error: Error,
    searching: boolean,
}

export interface DepartmentsData{
    data: Department[],
    notFound: boolean,
    error: Error,
    searching: boolean,
}

export interface BossesData{
    data: Boss[],
    notFound: boolean,
    error: Error,
    searching: boolean,
}

export interface User{
    id: string,
    name: string,
    role: string,
    department?: string,
    uid: string,
}

interface DataContextInterface {
    departmentsData: DepartmentsData,
    adminsData: AdminsFunctions,
    userData: UserData,
}

export const Data = createContext<DataContextInterface | null>(null);


interface Props{
    children: JSX.Element | JSX.Element[]
}

const DataContextProvider = ({ children }: Props) => {

    const departmentsData = useGetDepartments({ path: "Departments" });
    const adminsData = useGetAdminsByDepartment({ path: "Users" });
    const userData = useGetUserByUID({ path: "Users" });


    const value: DataContextInterface = {
        adminsData,
        departmentsData,
        userData,
    }

    return(
        <Data.Provider value={value}>
            {children}
        </Data.Provider>
    )
}

export default DataContextProvider;