import {
    IonBackButton,
    IonButton,
    IonButtons, IonCheckbox,
    IonContent,
    IonHeader, IonImg, IonInput, IonItem, IonLabel,
    IonList, IonListHeader,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import React, {useState} from "react";
import '../components/AddProject.css';
import {Box} from "@mui/system";
import LogoNoText from "../images/arccon-logo-no-text.png";

const AddProject = () => {
    const [employer, setEmployer] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [projectId, setProjectId] = useState<string>('');
    const [climate, setClimate] = useState<boolean>(false);
    const [laboratory, setLaboratory] = useState<boolean>(false);


    return(
        <IonPage className={`custom-add-modal`}>
            <IonHeader>
                <IonToolbar className={`custom-toolbar`}>
                    <IonTitle>
                        <Box width={65} margin={`auto`} className={`custom-logo`}>
                            <IonImg src={LogoNoText}/>
                        </Box>
                    </IonTitle>
                    <IonButtons slot={`start`}>
                        <IonBackButton defaultHref={`/project/list`}/>
                    </IonButtons>
                    <IonButtons slot="end" className={`custom-button`}>
                        <IonButton fill={`solid`}>
                            Confirm
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className={`custom-content`}>
                <IonList inset={true} className={`custom-add-list`}>
                    <IonListHeader className={`custom-list-header`}>
                        <h1>Neuprojekt</h1>
                    </IonListHeader>
                    <IonItem color={`transparent`} className={`custom-item ion-padding-start`}>
                        <IonLabel>Auftraggeber</IonLabel>
                        <IonInput value={employer} slot={`end`} placeholder="Enter Auftraggeber" onIonChange={e => setEmployer(e.detail.value!)} clearInput></IonInput>
                    </IonItem>
                    <IonItem color={`transparent`} className={`custom-item ion-padding-start`}>
                        <IonLabel>Bauvorhaben</IonLabel>
                        <IonInput value={name} slot={`end`} placeholder="Enter Bauvorhaben" onIonChange={e => setName(e.detail.value!)} clearInput></IonInput>
                    </IonItem>
                    <IonItem color={`transparent`} className={`custom-item ion-padding-start`}>
                        <IonLabel>Projektnummer</IonLabel>
                        <IonInput value={projectId} slot={`end`} placeholder="Enter Projektnummer" onIonChange={e => setProjectId(e.detail.value!)} clearInput></IonInput>
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
        </IonPage>
    )
}


export default AddProject;