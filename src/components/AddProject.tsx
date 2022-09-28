import {
    IonButton,
    IonButtons, IonCheckbox,
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

const AddProject = ({ isOpen, setIsOpen } : Props) : JSX.Element => {
    const [employer, setEmployer] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [projectId, setProjectId] = useState<string>('');
    const [climate, setClimate] = useState<boolean>(false);
    const [laboratory, setLaboratory] = useState<boolean>(false);


    return (
        <IonModal isOpen={isOpen} mode={`ios`}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Neuprojekt</IonTitle>
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
                    <IonLabel>Auftraggeber</IonLabel>
                    <IonInput value={employer} slot={`end`} placeholder="Enter Auftraggeber" onIonChange={e => setEmployer(e.detail.value!)} clearInput></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel>Bauvorhaben</IonLabel>
                    <IonInput value={name} slot={`end`} placeholder="Enter Bauvorhaben" onIonChange={e => setName(e.detail.value!)} clearInput></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel>Projektnummer</IonLabel>
                    <IonInput value={projectId} slot={`end`} placeholder="Enter Projektnummer" onIonChange={e => setProjectId(e.detail.value!)} clearInput></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel>Umweltuntersuchung</IonLabel>
                    <IonCheckbox value={climate} slot={`end`} onIonChange={e => setClimate(e.detail.value!)}></IonCheckbox>
                </IonItem>
                <IonItem>
                    <IonLabel>Laborversuche</IonLabel>
                    <IonCheckbox value={laboratory} slot={`end`} onIonChange={e => setLaboratory(e.detail.value!)}></IonCheckbox>
                </IonItem>
            </IonContent>
        </IonModal>
    );
}

export default AddProject;