import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader, IonInput,
    IonItem,
    IonLabel,
    IonModal,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {useState} from "react";

interface Props {
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,
}

const AddDepartment = ({ isOpen, setIsOpen } : Props) : JSX.Element => {
    const [value, setValue] = useState<string>('');

    return(
        <IonModal isOpen={isOpen}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Add Department</IonTitle>
                    <IonButtons slot={`start`}>
                        <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonButton fill={`solid`}>
                            Confirm
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonItem>
                    <IonLabel>Name</IonLabel>
                    <IonInput value={value} placeholder="Enter Name" onIonChange={e => setValue(e.detail.value!)} clearInput></IonInput>
                </IonItem>
            </IonContent>
        </IonModal>
    );
}


export default AddDepartment;