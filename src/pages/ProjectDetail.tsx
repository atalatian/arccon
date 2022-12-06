import {
    IonAccordion,
    IonAccordionGroup,
    IonButtons,
    IonContent,
    IonHeader, IonItem, IonLabel,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton, IonButton, useIonAlert, IonIcon, IonImg, IonListHeader, IonSpinner, useIonViewDidEnter,
} from "@ionic/react";
import {Box, createTheme, ThemeProvider} from "@mui/system";
import VerticalLinearStepper from "../components/Stepper";
import './ProjectDetail.css';
import {checkmarkCircle, closeCircle, trash} from 'ionicons/icons';
import React, {useCallback, useEffect, useRef, useState} from "react";
import LogoNoText from "../images/arccon-logo-no-text.png";
import {RouteComponentProps} from "react-router";
import MyToast from "../components/MyToast";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import Typography from "@mui/material/Typography";
import {Storage} from "@ionic/storage";
import MyLoading from "../components/MyLoading";
import {deleteDoc, doc, getDoc} from "firebase/firestore";
import db from "../firebaseConfig";


enum ACCORDION {
    OPEN,
    CLOSE,
}

interface RouteParams extends RouteComponentProps<{
    adminId: string,
    projectId: string,
}>{}

interface Project {
    id: string,
    client: string,
    name: string,
    number: string,
    current_task: number,
    environmental_survey: boolean,
    laboratory: boolean,
}

enum ToastType {
    error = `error`,
    success = `success`,
}

const theme = createTheme({
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
});

const ProjectDetail = (props: RouteParams) : JSX.Element => {

    const { match, history } = props;
    const [project, setProject] = useState<Project>()
    const [presentAlert] = useIonAlert();
    const [showAccordion, setShowAccordion] = useState<ACCORDION>(ACCORDION.CLOSE);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastType, setToastType] = useState<ToastType>(ToastType.error);
    const [showCircle, setShowCircle] = useState<boolean | undefined>(undefined);
    const [stepHeight, setStepHeight] = useState<number>(0);
    const [transitionEnd, setTransitionEnd] = useState<boolean | undefined>(undefined);
    const [boxTop, setBoxTop] = useState<number>(0);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const content = useRef<HTMLIonContentElement>();

    const handleAccordionClick = () => {
        if (showAccordion === ACCORDION.OPEN){
            setShowAccordion(ACCORDION.CLOSE);
        }else {
            setShowAccordion(ACCORDION.OPEN);
        }
    }

    useEffect(()=>{
        if (loaded && transitionEnd !== undefined){
            content.current?.scrollToPoint(0, boxTop - content.current?.scrollHeight + stepHeight, 1000);
        }
    }, [stepHeight, boxTop, loaded, transitionEnd])

    const handleRef = useCallback((el: (HTMLIonContentElement | null))=>{
        if (el){
            content.current = el;
            setLoaded(true)
        }
    }, [])

    const readProject = async (): Promise<void> => {
        try {
            setProject(undefined)
            const store = new Storage();
            await store.create();
            const projectCache = await store.get(`project-${match.params.projectId}`);
            if (projectCache === null){
                setShowAccordion(ACCORDION.CLOSE);
                setShowCircle(true);
                const result = await getDoc(doc(db, "Projects", match.params.projectId));
                const newProject = {
                    id: result.id,
                    client: result.get('client'),
                    name: result.get('name'),
                    number: result.get('number'),
                    current_task: result.get('currentTask'),
                    environmental_survey: result.get('environmentalSurvey'),
                    laboratory: result.get('laboratory'),
                }
                setProject(newProject);
                await store.set(`project-${match.params.projectId}`, newProject);
                setShowCircle(false);
                setShowAccordion(ACCORDION.OPEN)
            } else {
                setProject(projectCache);
                setShowAccordion(ACCORDION.OPEN)
            }
        }catch (e: any) {
            setShowAccordion(ACCORDION.CLOSE)
            setShowCircle(false);
            let message = e.message;
            if (e?.code === 100){
                message = `Unable to connect to the server`
            }
            setToastType(ToastType.error);
            setToastMessage(message);
            setShowToast(true);
        }
    }

    useEffect(()=>{
        console.log(project)
    }, [project])

    useIonViewDidEnter(()=>{
        (async ()=>{
            await readProject();
        })()
    })

    const handleDelete = async () => {
        try {
            setLoadingMessage(`Deleting project`)
            setShowLoading(true);
            const store = new Storage();
            await store.create();
            await deleteDoc(doc(db, 'Projects', match.params.projectId));
            await store.remove(`project-${match.params.projectId}`);
            await store.remove(`admin-${match.params.adminId}-projects`);
            setShowLoading(false);
            history.go(-1);
        } catch (e: any) {
            setShowLoading(false);
            let message = e.message;
            if (e.code === 100){
                message = `Unable to connect to the server`
            }
            setToastType(ToastType.error);
            setToastMessage(message);
            setShowToast(true);
        }
    }

    return(
        <IonPage className={`custom-project-detail`}>
            <IonHeader>
                <IonToolbar className={`custom-toolbar`}>
                    <IonButtons slot={`start`}>
                        <IonBackButton defaultHref={`/${match.params.adminId}/project/list`}/>
                    </IonButtons>
                    <IonButtons slot={`end`}>
                        <IonButton color={`danger`} onClick={()=>{
                            presentAlert({
                                header: `Are you sure you want to delete this item?`,
                                cssClass: `custom-detail-alert`,
                                buttons: [
                                    {
                                        text: 'Cancel',
                                        role: 'cancel',
                                    },
                                    {
                                        text: 'Delete',
                                        role: 'confirm',
                                        cssClass: 'delete-alert',
                                        handler: handleDelete,
                                    },
                                ]
                            })
                        }}>
                            <IonIcon size={`large`} icon={trash}/>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>
                        <Box width={65} margin={`auto`} className={`custom-logo`}>
                            <IonImg src={LogoNoText}/>
                        </Box>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent ref={handleRef} scrollEvents={true} className={`custom-content`}>
                <IonAccordionGroup className={`custom-accordion-group`}
                                   value={showAccordion.toString()} style={{ position: `sticky`, top: `12px`, zIndex: 1, }}>
                    <IonAccordion onTransitionEnd={()=> setTransitionEnd((prev) => !prev)} className={`custom-accordion`} value={ACCORDION.OPEN.toString()}>
                        <IonItem slot={`header`} color={`medium`} onClick={handleAccordionClick}>
                            <IonListHeader className={`custom-list-header`}>
                                <Box component={`h1`} m={1.5} ml={0}>
                                    Description
                                </Box>
                            </IonListHeader>
                        </IonItem>
                        <Box slot={`content`} sx={{ bgcolor: `rgba(255, 255, 255, 0.5)`, }}>
                            {
                                showCircle === true &&
                                <Box display={`flex`} flexDirection={`column`} alignItems={`center`} justifyContent={`center`} p={2} color={`rgba(0,0,0,0.3)`}>
                                    <IonSpinner color={`rgba(0,0,0,0.3)`}></IonSpinner>
                                </Box>
                            }
                            {
                                showCircle === false && project === undefined &&
                                <Box display={`flex`} flexDirection={`column`} alignItems={`center`} justifyContent={`center`} gap={2} padding={1} color={`rgba(0,0,0,0.3)`}>
                                    <FontAwesomeIcon icon={faMagnifyingGlass} size={`5x`}/>
                                    <Typography>
                                        No description found
                                    </Typography>
                                </Box>
                            }
                            {
                                project !== undefined &&
                                <>
                                    <IonItem className={`description-item custom-item-paragraph`} color={`transparent`}>
                                        <IonLabel>
                                            Auftraggeber
                                        </IonLabel>
                                        <p style={{ fontSize: `1rem`, width: `50%`, textAlign: `end` }}>{project.client}</p>
                                    </IonItem>
                                    <IonItem className={`description-item custom-item-paragraph`} color={`transparent`}>
                                        <IonLabel>
                                            Bauvorhaben
                                        </IonLabel>
                                        <p style={{ fontSize: `1rem` }}>{project.name}</p>
                                    </IonItem>
                                    <IonItem className={`description-item custom-item-paragraph`} color={`transparent`}>
                                        <IonLabel>
                                            Projektnummer
                                        </IonLabel>
                                        <p style={{ fontSize: `1rem` }}>{project.number}</p>
                                    </IonItem>
                                    <IonItem className={`description-item custom-item ${project.environmental_survey ? 'custom-success-icon' : 'custom-danger-icon'}`}
                                             color={`transparent`}>
                                        <IonIcon slot={`end`} icon={project.environmental_survey ? checkmarkCircle : closeCircle}
                                                 color={project.environmental_survey ? 'success' : 'danger'}/>
                                        <IonLabel>
                                            Umweltuntersuchung
                                        </IonLabel>
                                    </IonItem>
                                    <IonItem className={`description-item custom-item ${project.laboratory ? 'custom-success-icon' : 'custom-danger-icon'}`}
                                             color={`transparent`} lines={`full`}>
                                        <IonIcon slot={`end`} icon={project.laboratory ? checkmarkCircle : closeCircle}
                                                 color={project.laboratory ? 'success' : 'danger'} />
                                        <IonLabel>
                                            Laborversuche
                                        </IonLabel>
                                    </IonItem>
                                    <IonItem className={`description-item custom-item ${project.current_task === -1 ? 'custom-success-icon' : 'custom-danger-icon'}`}
                                             color={`transparent`} lines={`none`}>
                                        <IonIcon slot={`end`} icon={project.current_task === -1 ? checkmarkCircle : closeCircle}
                                                 color={project.current_task === -1 ? 'success' : 'danger'} size={`large`}/>
                                        <IonLabel>
                                            <h1>Finished</h1>
                                        </IonLabel>
                                    </IonItem>
                                </>
                            }
                        </Box>
                    </IonAccordion>
                </IonAccordionGroup>
                <Box p={2} pt={0.5} pb={0}>
                    <ThemeProvider theme={theme}>
                        <Typography component={`h1`} mb={1}>
                            Aufgabenverteilung
                        </Typography>
                    </ThemeProvider>
                </Box>
                {
                    showCircle === true &&
                    <Box display={`flex`} flexDirection={`column`} alignItems={`center`} justifyContent={`center`} p={2} color={`rgba(0,0,0,0.3)`}>
                        <IonSpinner color={`rgba(0,0,0,0.3)`}></IonSpinner>
                    </Box>
                }
                {
                    showCircle === false && project === undefined &&
                    <Box display={`flex`} flexDirection={`column`} alignItems={`center`} justifyContent={`center`} gap={2} padding={1} color={`rgba(0,0,0,0.3)`}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} size={`5x`}/>
                        <Typography>
                            No task found
                        </Typography>
                    </Box>
                }
                {
                    project !== undefined &&
                    <VerticalLinearStepper currentTask={project.current_task} environmentalSurvey={project.environmental_survey} laboratory={project.laboratory}
                                           projectId={match.params.projectId} adminId={match.params.adminId} setBoxTop={setBoxTop} setStepHeight={setStepHeight} setProject={setProject}
                                           transitionEnd={transitionEnd} readProject={readProject}/>
                }
                <MyToast showToast={showToast} setShowToast={setShowToast} message={toastMessage} cssClass={toastType}/>
                <MyLoading showLoading={showLoading} setShowLoading={setShowLoading} message={loadingMessage}/>
            </IonContent>
        </IonPage>
    );
}


export default ProjectDetail;