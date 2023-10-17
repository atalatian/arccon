import {
    IonButton,
    IonButtons, IonCheckbox,
    IonContent, IonDatetime, IonDatetimeButton,
    IonHeader, IonIcon, IonInput,
    IonItem,
    IonLabel, IonList,
    IonModal, IonText,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import {useContext, useEffect, useState} from "react";
import "./AddProject.css";
import {calendar, close, warning} from "ionicons/icons";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import MyLoading from "./MyLoading";
import {RouteComponentProps} from "react-router";
import { tasks } from "../data";
import React from "react";
import { v4 as uuidv4 } from 'uuid';
import {collection, addDoc, getFirestore} from "firebase/firestore";
import {Auth} from "../context/Auth";
import "./addProjectDate.css"

interface RouteParams extends RouteComponentProps<{
    adminId: string,
}>{}

interface ToastError{
    id: string,
    message: string,
}

enum ToastType {
    error = `error`,
    success = `success`,
}

interface Props extends RouteParams{
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,
    setShowToast: (show: boolean)=> void,
    setToastMessage: (message: string) => void,
    setToastType: (type: ToastType) => void,
}

const AddProject = (props : Props) : JSX.Element => {

    const { isOpen, setIsOpen, match } = props
    const { setShowToast, setToastMessage, setToastType,} = props

    const [client, setClient] = useState<string>('');
    const [clientError, setClientError] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [nameError, setNameError] = useState<boolean>(false);
    const [number, setNumber] = useState<string>('');
    const [numberError, setNumberError] = useState<boolean>(false);
    const [environmentalSurvey, setEnvironmentalSurvey] = useState<boolean>(false);
    const [laboratory, setLaboratory] = useState<boolean>(false);
    const [deadline, setDeadline] = useState<string | string[]>();
    const [toastErrors, setToastErrors] = useState<ToastError[]>([]);
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const db = getFirestore();
    const token = useContext(Auth)?.token;

    const handleConfirm = async () => {
        let dontContinue = false;

        if (client.length === 0){
            setToastErrors((prev) => [...prev, { id: uuidv4(), message: `Auftraggeber is required` }]);
            setClientError(true);
            dontContinue = true;
        }

        if (name.length === 0){
            setToastErrors((prev) => [...prev, { id: uuidv4(), message: `Bauvorhaben is required` }]);
            setNameError(true)
            dontContinue = true;
        }

        if (number.length === 0){
            setToastErrors((prev) => [...prev, { id: uuidv4(), message: `Projektnummer is required` }]);
            setNumberError(true)
            dontContinue = true;
        }

        if (dontContinue){
            return;
        }

        try {
            const filteredTasks = tasks.filter((task) => task.environmental_survey === environmentalSurvey && task.laboratory === laboratory);
            const firstTask = filteredTasks.find((task) => task.level === 1);
            setIsOpen(false);
            const pendingData = {
                client: client,
                name: name,
                number: number,
                environmentalSurvey: environmentalSurvey,
                laboratory: laboratory,
                currentTask: firstTask?.id,
                createdAt: new Date(),
                updatedAt: new Date(),
                author: token,
                admin: match.params.adminId,
            }
            if (deadline !== undefined){
                await addDoc(collection(db, "Projects"), { ...pendingData, deadline: new Date(deadline.toString()) });
            } else {
                await addDoc(collection(db, "Projects"), { ...pendingData, });
            }
            setToastErrors([]);
            setClientError(false);
            setNameError(false);
            setNumberError(false);
            setToastType(ToastType.success);
            setToastMessage('Project added successfully');
            setShowToast(true);
            setClient('');
            setName('');
            setNumber('');
            setEnvironmentalSurvey(false);
            setLaboratory(false);
            setDeadline(undefined);
        } catch (e: any) {
            setShowLoading(false);
            setIsOpen(true);
            let message = e.message;
            setToastErrors((prev) => [...prev, { id: uuidv4(), message: message }])
        }
    }


    const handleCloseReq = (id: string) => {
        return (e: React.MouseEvent<HTMLIonIconElement>): void => {
            setToastErrors((prev) => prev.filter((error) => error.id !== id))
        }
    }

    return (
        <IonModal isOpen={isOpen} className={`custom-add-modal`} onDidDismiss={()=> setIsOpen(false)}>
            <IonHeader>
                <IonToolbar className={`custom-toolbar`}>
                    <IonTitle className={`custom-title`}>Neuprojekt</IonTitle>
                    <IonButtons slot={`start`}>
                        <IonButton className={`close-button`} onClick={() => {
                            setIsOpen(false);
                            setClient('');
                            setName('');
                            setNumber('')
                            setEnvironmentalSurvey(false);
                            setLaboratory(false);
                            setDeadline(undefined);
                        }}>Close</IonButton>
                    </IonButtons>
                    <IonButtons slot="end" className={`custom-button`}>
                        <IonButton onClick={handleConfirm} fill={`solid`}>
                            Confirm
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className={`custom-content`}>
                {
                    toastErrors.map((toastError)=>{
                        return(
                            <Paper key={toastError.id} sx={{ m: 1, p: 1, bgcolor: `#FAA613`, color: `#fff`, display: `flex`, alignItems: `center`, }}>
                                <IonIcon icon={warning} className={`custom-paper-icon ion-margin-end`}></IonIcon>
                                <Typography>
                                    {toastError.message}
                                </Typography>
                                <IonIcon icon={close} onClick={handleCloseReq(toastError.id)} className={`custom-paper-icon ion-margin-start`} style={{ marginLeft: `auto` }}></IonIcon>
                            </Paper>
                        )
                    })
                }
                <IonList className={`custom-add-list`}>
                    <IonItem color={`transparent`} className={`custom-item ion-padding-start`}>
                        <IonLabel>Auftraggeber</IonLabel>
                        {
                            clientError &&
                            <IonIcon className={`custom-icon`} icon={warning}></IonIcon>
                        }
                        <IonInput className={`custom-input`} value={client} slot={`end`} placeholder="Enter Auftraggeber"
                                  onIonChange={e => {setClient(e.detail.value!); setClientError(false);}}
                                  clearInput></IonInput>
                    </IonItem>
                    <IonItem color={`transparent`} className={`custom-item ion-padding-start`}>
                        <IonLabel>Bauvorhaben</IonLabel>
                        {
                            nameError &&
                            <IonIcon className={`custom-icon`} icon={warning}></IonIcon>
                        }
                        <IonInput className={`custom-input`} value={name} slot={`end`} placeholder="Enter Bauvorhaben"
                                  onIonChange={e => {setName(e.detail.value!); setNameError(false)}}
                                  clearInput></IonInput>
                    </IonItem>
                    <IonItem color={`transparent`} className={`custom-item ion-padding-start`}>
                        <IonLabel>Projektnummer</IonLabel>
                        {
                            numberError &&
                            <IonIcon className={`custom-icon`} icon={warning}></IonIcon>
                        }
                        <IonInput className={`custom-input`} value={number} slot={`end`} placeholder="Enter Projektnummer"
                                  onIonChange={e => {setNumber(e.detail.value!); setNumberError(false)}}
                                  clearInput></IonInput>
                    </IonItem>
                    <IonItem color={`transparent`} className={`custom-item ion-padding-start`}>
                        <IonLabel>Umweltuntersuchung</IonLabel>
                        <IonCheckbox className={`custom-add-checkbox`} checked={environmentalSurvey} slot={`end`} onIonChange={e => setEnvironmentalSurvey(e.detail.checked!)}></IonCheckbox>
                    </IonItem>
                    <IonItem color={`transparent`} className={`custom-item ion-padding-start`}>
                        <IonLabel>Laborversuche</IonLabel>
                        <IonCheckbox className={`custom-add-checkbox`} checked={laboratory} slot={`end`} onIonChange={e => setLaboratory(e.detail.checked!)}></IonCheckbox>
                    </IonItem>
                    <IonItem color={`transparent`} lines={`none`} className={`custom-item ion-padding-start`}>
                        <IonLabel>Deadline</IonLabel>
                        <IonText className={`ion-margin-end`}>
                            {   deadline ?
                                new Date(deadline.toString()).toLocaleDateString(`de-DE`, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                                : null
                            }
                        </IonText>
                        <IonDatetimeButton className={`date-button`} datetime="datetime">
                            <IonText slot={`date-target`}>
                                <IonIcon icon={calendar} size={`2px`}></IonIcon>
                            </IonText>
                        </IonDatetimeButton>
                        <IonModal keepContentsMounted={true} className={`date-modal`}>
                            <IonDatetime name={'hello'} id={`datetime`} defaultValue={`0`} max={`2030-12-31`} showDefaultButtons={true} showClearButton={true} locale="de-DE" presentation={`date`} multiple={false}
                                         onIonChange={ e => setDeadline(e.detail.value!) }></IonDatetime>
                        </IonModal>
                    </IonItem>
                </IonList>
                <MyLoading showLoading={showLoading} setShowLoading={setShowLoading} message={'Creating new project'}/>
            </IonContent>
        </IonModal>
    );
}

export default AddProject;