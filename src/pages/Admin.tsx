import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent, IonFab, IonFabButton,
    IonHeader, IonIcon, IonItem, IonLabel,
    IonList, IonListHeader,
    IonPage, IonRadio,
    IonRadioGroup,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import React, {useContext, useEffect, useState} from "react";
import {add} from "ionicons/icons";
import AddAdmin from "../components/AddAdmin";
import {RouteComponentProps} from "react-router";
import {DepAdContext} from "../context/DepAdContext";


interface AdminObj {
    id: number,
    name: string,
}

const data: AdminObj[] = [
    {
        id: 0,
        name: `admin 1`,
    },
    {
        id: 1,
        name: `admin 2`,
    },
    {
        id: 2,
        name: `admin 3`,
    }
]

const Admin = ({ history }: RouteComponentProps) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const ctx = useContext(DepAdContext);

    const handleClick = (id: number) => {
        return (e: React.MouseEvent<HTMLIonItemElement, MouseEvent>): void =>{
            e.preventDefault();
            ctx?.setAdminId(id);
            localStorage.setItem('adminId', id.toString());
            history.push(`/department/${ctx?.departmentId}/admin/${id}/project/list`);
        }
    }

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot={`start`}>
                        <IonBackButton defaultHref={`/settings/department`}/>
                    </IonButtons>

                    <IonTitle>Admins</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    <IonListHeader>
                        <IonLabel>Choose Admin</IonLabel>
                    </IonListHeader>
                    {
                        data.map((admin): JSX.Element => {
                            return(
                                <IonItem key={admin.id} button detail onClick={handleClick(admin.id)}>
                                    <IonLabel>{admin.name}</IonLabel>
                                </IonItem>
                            );
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
                <AddAdmin isOpen={modalOpen} setIsOpen={setModalOpen}/>
            </IonContent>
        </IonPage>
    );
}


export default Admin;