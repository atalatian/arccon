import React, {createContext, useState} from "react";

interface DepAdContextInterface {
    departmentId: number | null,
    adminId: number | null,
    projectId: number | null,
    setDepartmentId: (id: number) => void,
    setAdminId: (id: number) => void,
    setProjectId: (id: number) => void,
}

export const DepAdContext = createContext<DepAdContextInterface | null>(null);


interface Props{
    children?: JSX.Element | JSX.Element[]
}

const DepAdContextProvider = ({ children }: Props) => {
    const getDepartmentId = (): number | null => {
        if (localStorage.getItem('departmentId') === null){
            return null;
        }
        return parseInt(localStorage.getItem('departmentId')!)
    }

    const getAdminId = (): number | null => {
        if (localStorage.getItem('adminId') === null){
            return null;
        }

        return parseInt(localStorage.getItem('adminId')!)
    }

    const [departmentId, setDepartmentId] = useState<number | null>(getDepartmentId());
    const [adminId, setAdminId] = useState<number | null>(getAdminId());
    const [projectId, setProjectId] = useState<number | null>(null);

    const value: DepAdContextInterface = {
        departmentId: departmentId!,
        adminId: adminId!,
        projectId: projectId!,
        setAdminId: setAdminId!,
        setDepartmentId: setDepartmentId!,
        setProjectId: setProjectId!,
    }

    return(
        <DepAdContext.Provider value={value}>
            {children}
        </DepAdContext.Provider>
    )
}

export default DepAdContextProvider;