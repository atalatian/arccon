import {
    IonButton,
    IonButtons, IonCheckbox,
    IonContent,
    IonHeader, IonInput,
    IonItem,
    IonLabel, IonList,
    IonModal, IonText,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {useState} from "react";
import "./AddProject.css";

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
        <IonModal isOpen={isOpen} className={`custom-add-modal`} onDidDismiss={()=> setIsOpen(false)}>
            <IonHeader>
                <IonToolbar className={`custom-toolbar`}>
                    <IonTitle className={`custom-title`}>Neuprojekt</IonTitle>
                    <IonButtons slot={`start`}>
                        <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
                    </IonButtons>
                    <IonButtons slot="end" className={`custom-button`}>
                        <IonButton fill={`solid`}>
                            Confirm
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className={`custom-content`}>
                <IonList className={`custom-add-list`}>
                    <IonItem color={`transparent`} className={`custom-item ion-padding-start`}>
                        <IonLabel>Auftraggeber</IonLabel>
                        <IonInput className={`custom-input`} value={employer} slot={`end`} placeholder="Enter Auftraggeber" onIonChange={e => setEmployer(e.detail.value!)}
                                  clearInput></IonInput>
                    </IonItem>
                    <IonItem color={`transparent`} className={`custom-item ion-padding-start`}>
                        <IonLabel>Bauvorhaben</IonLabel>
                        <IonInput className={`custom-input`} value={name} slot={`end`} placeholder="Enter Bauvorhaben" onIonChange={e => setName(e.detail.value!)}
                                  clearInput></IonInput>
                    </IonItem>
                    <IonItem color={`transparent`} className={`custom-item ion-padding-start`}>
                        <IonLabel>Projektnummer</IonLabel>
                        <IonInput className={`custom-input`} value={projectId} slot={`end`} placeholder="Enter Projektnummer" onIonChange={e => setProjectId(e.detail.value!)}
                                  clearInput></IonInput>
                    </IonItem>
                    <IonItem color={`transparent`} className={`custom-item ion-padding-start`}>
                        <IonLabel>Umweltuntersuchung</IonLabel>
                        <IonCheckbox className={`custom-add-checkbox`} value={climate} slot={`end`} onIonChange={e => setClimate(e.detail.value!)}></IonCheckbox>
                    </IonItem>
                    <IonItem color={`transparent`} lines={`none`} className={`custom-item ion-padding-start`}>
                        <IonLabel>Laborversuche</IonLabel>
                        <IonCheckbox className={`custom-add-checkbox`} value={laboratory} slot={`end`} onIonChange={e => setLaboratory(e.detail.value!)}></IonCheckbox>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonModal>
    );
}

export default AddProject;