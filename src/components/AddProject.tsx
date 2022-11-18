import {
    IonButton,
    IonButtons, IonCheckbox,
    IonContent,
    IonHeader, IonIcon, IonInput,
    IonItem,
    IonLabel, IonList,
    IonModal,
    IonTitle,
    IonToolbar, useIonViewWillLeave
} from "@ionic/react";
import {useEffect, useRef, useState, useId} from "react";
import "./AddProject.css";
import {close, closeCircleOutline, informationCircle, warning} from "ionicons/icons";
import {Box} from "@mui/material";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import MyLoading from "./MyLoading";
import {RouteComponentProps} from "react-router";
import Parse from "parse";
import { tasks } from "../data";
import React from "react";
import { v4 as uuidv4 } from 'uuid';
import {Storage} from "@ionic/storage";

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

interface Project {
    id: string,
    name: string,
    current_task: number,
    createdAt: Date,
    updatedAt: Date,
}

interface Props extends RouteParams{
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,
    setShowToast: (show: boolean)=> void,
    setToastMessage: (message: string) => void,
    setToastType: (type: ToastType) => void,
    reFetchProjects: () => Promise<void>,
}

const AddProject = (props : Props) : JSX.Element => {

    const { isOpen, setIsOpen, match } = props
    const { setShowToast, setToastMessage, setToastType,} = props
    const { reFetchProjects } = props

    const [client, setClient] = useState<string>('');
    const [clientError, setClientError] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [nameError, setNameError] = useState<boolean>(false);
    const [number, setNumber] = useState<string>('');
    const [numberError, setNumberError] = useState<boolean>(false);
    const [environmentalSurvey, setEnvironmentalSurvey] = useState<boolean>(false);
    const [laboratory, setLaboratory] = useState<boolean>(false);
    const [toastErrors, setToastErrors] = useState<ToastError[]>([]);
    const [showLoading, setShowLoading] = useState<boolean>(false);

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

        setShowLoading(true);
        let Project = new Parse.Object('Project');
        Project.set(`client`, client);
        Project.set(`name`, name);
        Project.set(`number`, number);
        Project.set('environmental_survey', environmentalSurvey);
        Project.set('laboratory', laboratory);
        Project.set('admin', parseInt(match.params.adminId));
        const filteredTasks = tasks.filter((task) => task.environmental_survey === environmentalSurvey && task.laboratory === laboratory);
        const firstTask = filteredTasks.find((task) => task.level === 1);
        Project.set(`current_task`, firstTask?.id);
        try {
            await Project.save();
            const store = new Storage();
            await store.create();
            await store.remove(`admin-${match.params.adminId}-projects`);
            await reFetchProjects();
            setShowLoading(false);
            setToastErrors([]);
            setClientError(false);
            setNameError(false);
            setNumberError(false);
            setIsOpen(false);
            setToastType(ToastType.success);
            setToastMessage('Project added successfully');
            setShowToast(true);
            setClient('');
            setName('');
            setNumber('')
            setEnvironmentalSurvey(false);
            setLaboratory(false);
        } catch (e: any) {
            setShowLoading(false)
            let message = e.message;
            if (e.code === 100){
                message = `Unable to connect to the server`
            }
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
                        <IonButton onClick={() => {
                            setIsOpen(false);
                            setClient('');
                            setName('');
                            setNumber('')
                            setEnvironmentalSurvey(false);
                            setLaboratory(false);
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
                        <IonInput className={`custom-input`} size={20} value={client} slot={`end`} placeholder="Enter Auftraggeber"
                                  onIonChange={e => {setClient(e.detail.value!); setClientError(false);}}
                                  clearInput></IonInput>
                    </IonItem>
                    <IonItem color={`transparent`} className={`custom-item ion-padding-start`}>
                        <IonLabel>Bauvorhaben</IonLabel>
                        {
                            nameError &&
                            <IonIcon className={`custom-icon`} icon={warning}></IonIcon>
                        }
                        <IonInput className={`custom-input`} size={20} value={name} slot={`end`} placeholder="Enter Bauvorhaben"
                                  onIonChange={e => {setName(e.detail.value!); setNameError(false)}}
                                  clearInput></IonInput>
                    </IonItem>
                    <IonItem color={`transparent`} className={`custom-item ion-padding-start`}>
                        <IonLabel>Projektnummer</IonLabel>
                        {
                            numberError &&
                            <IonIcon className={`custom-icon`} icon={warning}></IonIcon>
                        }
                        <IonInput className={`custom-input`} size={20} value={number} slot={`end`} placeholder="Enter Projektnummer"
                                  onIonChange={e => {setNumber(e.detail.value!); setNumberError(false)}}
                                  clearInput></IonInput>
                    </IonItem>
                    <IonItem color={`transparent`} className={`custom-item ion-padding-start`}>
                        <IonLabel>Umweltuntersuchung</IonLabel>
                        <IonCheckbox className={`custom-add-checkbox`} checked={environmentalSurvey} slot={`end`} onIonChange={e => setEnvironmentalSurvey(e.detail.checked!)}></IonCheckbox>
                    </IonItem>
                    <IonItem color={`transparent`} lines={`none`} className={`custom-item ion-padding-start`}>
                        <IonLabel>Laborversuche</IonLabel>
                        <IonCheckbox className={`custom-add-checkbox`} checked={laboratory} slot={`end`} onIonChange={e => setLaboratory(e.detail.checked!)}></IonCheckbox>
                    </IonItem>
                </IonList>
                <MyLoading showLoading={showLoading} setShowLoading={setShowLoading} message={'Creating new project'}/>
            </IonContent>
        </IonModal>
    );
}

export default AddProject;