import React, {useRef} from "react";
import {
    IonButton,
    IonButtons, IonContent,
    IonHeader, IonIcon,
    IonInput,
    IonItem,
    IonLabel, IonList, IonListHeader,
    IonModal,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import DepartmentsAccordionGroup from "./DepartmentsAccordionGroup";
import {RouteComponentProps} from "react-router";
import "./ChooseAdmin.css";
import {person, star} from "ionicons/icons";
import {Box} from "@mui/material";

interface Props extends RouteComponentProps{
    isOpen: boolean,
    setIsOpen: (open: boolean) => void,
}

const ChooseAdmin = (props: Props) => {

    const handleClick = () => {
        props.setIsOpen(false);
        props.history.push(`/project/list`);
    }

    return(
        <IonModal isOpen={props.isOpen} className={`custom-admin-modal`} onDidDismiss={()=> props.setIsOpen(false)}>
            <IonHeader>
                <IonToolbar className={`custom-toolbar`}>
                    <IonButtons slot="start">
                        <IonButton onClick={() => props.setIsOpen(false)}>Cancel</IonButton>
                    </IonButtons>
                    <IonTitle className={`custom-title`}>Choose Admin</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className={`custom-content`}>
                <IonList className={`custom-list`}>
                    <IonItem button detail lines={`inset`} className={`custom-admin-item`} color={`transparent`} onClick={handleClick}>
                        <IonIcon icon={person} slot="start"></IonIcon>
                        <IonLabel>
                            Admin 1
                        </IonLabel>
                    </IonItem>
                    <IonItem button detail lines={`inset`} className={`custom-admin-item`} color={`transparent`} onClick={handleClick}>
                        <IonIcon icon={person} slot="start"></IonIcon>
                        <IonLabel>
                            Admin 1
                        </IonLabel>
                    </IonItem>
                    <IonItem button detail lines={`none`} className={`custom-admin-item`} color={`transparent`} onClick={handleClick}>
                        <IonIcon icon={person} slot="start"></IonIcon>
                        <IonLabel>
                            Admin 1
                        </IonLabel>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonModal>
    );
}

export default ChooseAdmin;