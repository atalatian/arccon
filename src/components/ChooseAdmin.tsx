import React from "react";
import {
    IonButton,
    IonButtons, IonContent,
    IonHeader, IonIcon,
    IonItem,
    IonLabel, IonList,
    IonModal,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {RouteComponentProps} from "react-router";
import "./ChooseAdmin.css";
import {person} from "ionicons/icons";
import { Admin } from "../data";


interface ItemProps extends RouteComponentProps{
    id: number,
    name: string,
    lastItem: boolean,
}

const Item = (props: ItemProps) => {
    const { id, name, history, lastItem } = props;

    const handleClick = () => {
        history.push(`/${id}/project/list`);
    }

    return(
        <IonItem button detail lines={lastItem ? `none` : `inset`} className={`custom-admin-item`} color={`transparent`} onClick={handleClick}>
            <IonIcon icon={person} slot="start"></IonIcon>
            <IonLabel>
                {name}
            </IonLabel>
        </IonItem>
    );
}

interface Props{
    isOpen: boolean,
    setIsOpen: (open: boolean) => void,
    admins: Admin[],
    routeProps: RouteComponentProps,
}

const ChooseAdmin = (props: Props) => {

    const { admins, routeProps } = props;
    const { isOpen, setIsOpen } = props;

    return(
        <IonModal isOpen={isOpen} className={`custom-admin-modal`} onDidDismiss={()=> setIsOpen(false)}>
            <IonHeader>
                <IonToolbar className={`custom-toolbar`}>
                    <IonButtons slot="start">
                        <IonButton onClick={() => setIsOpen(false)}>Cancel</IonButton>
                    </IonButtons>
                    <IonTitle className={`custom-title`}>Choose Admin</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className={`custom-content`}>
                <IonList className={`custom-list`}>
                    {
                        admins.length > 0 &&
                        admins.map((admin, index) => <Item key={admin.id} id={admin.id} name={admin.name}
                                                           lastItem={admins.length - 1 === index} {...routeProps}/>)
                    }
                </IonList>
            </IonContent>
        </IonModal>
    );
}

export default ChooseAdmin;