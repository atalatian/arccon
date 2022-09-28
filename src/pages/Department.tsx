import React, {useContext, useEffect, useState} from 'react';
import {
    IonButtons,
    IonButton,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonPage,
    IonList,
    IonLabel,
    IonListHeader,
    IonRadioGroup,
    IonRadio,
    IonItem,
    IonIcon,
    IonBackButton,
    IonFab,
    IonFabButton,
} from '@ionic/react';
import {add} from "ionicons/icons";
import AddDepartment from "../components/AddDepartment";
import {RouteComponentProps} from "react-router";
import {DepAdContext} from "../context/DepAdContext";

interface DepartmentObj {
    id: number,
    name: string,
}


const data: DepartmentObj[] = [
    {
        id: 0,
        name: `Geotechnik`,
    },
    {
        id: 1,
        name: `Bergbau`,
    },
    {
        id: 2,
        name: `Umwelt`,
    },
]

const Department = ({ history }: RouteComponentProps) : JSX.Element => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const ctx = useContext(DepAdContext);

    const handleClick = (id: number) => {
        return (e: React.MouseEvent<HTMLIonItemElement, MouseEvent>): void =>{
            e.preventDefault();
            ctx?.setDepartmentId(id)
            localStorage.setItem("departmentId", id.toString());
            localStorage.removeItem('adminId');
            history.push(`/settings/department/${id}/admin`);
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    {
                        ctx?.departmentId !== null && ctx?.adminId !== null &&
                        <IonButtons slot={`start`}>
                            <IonBackButton defaultHref={`/department/${ctx?.departmentId}/admin/${ctx?.adminId}/project/list`}/>
                        </IonButtons>
                    }
                    <IonTitle>Departments</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    <IonListHeader>
                        <IonLabel>Choose Department</IonLabel>
                    </IonListHeader>

                    {
                        data.map((department): JSX.Element => {
                            return(
                                <IonItem key={department.id} button detail onClick={handleClick(department.id)}>
                                    <IonLabel>
                                        {department.name}
                                    </IonLabel>
                                </IonItem>
                            )
                        })
                    }
                </IonList>
                {
                    /*
                                    <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={()=> setModalOpen(true)}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
                     */
                }
                <AddDepartment isOpen={modalOpen} setIsOpen={setModalOpen}/>
            </IonContent>
        </IonPage>
    );
}

export default Department;