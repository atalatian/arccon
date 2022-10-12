import {useRef} from "react";
import {
    IonButton,
    IonButtons, IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel, IonListHeader,
    IonModal,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import DepartmentsAccordionGroup from "./DepartmentsAccordionGroup";
import {RouteComponentProps} from "react-router";
import "./ChooseAdmin.css";

interface Props extends RouteComponentProps{
    isOpen: boolean,
    setIsOpen: (open: boolean) => void,
}

const ChooseAdmin = (props: Props) => {

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
                <DepartmentsAccordionGroup {...props}/>
            </IonContent>
        </IonModal>
    );
}

export default ChooseAdmin;