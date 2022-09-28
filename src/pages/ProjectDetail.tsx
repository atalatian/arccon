import {
    IonAccordion,
    IonAccordionGroup,
    IonButtons,
    IonContent,
    IonHeader, IonItem, IonLabel,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton, IonButton, useIonAlert, IonIcon,
} from "@ionic/react";
import {Box} from "@mui/system";
import VerticalLinearStepper from "../components/Stepper";
import './ProjectDetail.css';
import { checkbox, closeCircle } from 'ionicons/icons';
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {DepAdContext} from "../context/DepAdContext";


enum ACCORDION {
    OPEN,
    CLOSE,
}

const ProjectDetail = () : JSX.Element => {
    const [presentAlert] = useIonAlert();
    const [stepHeight, setStepHeight] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [allow, setAllow] = useState<boolean>(false);
    const [showAccordion, setShowAccordion] = useState<ACCORDION>(ACCORDION.OPEN);
    const content = useRef<HTMLIonContentElement>();
    const ctx = useContext(DepAdContext);

    useEffect(()=>{
        if (loaded && allow){
            content.current?.scrollToPoint(0, stepHeight - content.current?.scrollHeight + 120, 1000);
        }
    }, [stepHeight, loaded, height, allow])

    const handleRef = useCallback((el: (HTMLIonContentElement | null))=>{
        if (el){
            content.current = el;
            setLoaded(true)
        }
    }, [])

    const handleAccordionClick = () => {
        if (showAccordion === ACCORDION.OPEN){
            setShowAccordion(ACCORDION.CLOSE);
        }else {
            setShowAccordion(ACCORDION.OPEN);
        }
    }

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot={`start`}>
                        <IonBackButton defaultHref={`/department/${ctx?.departmentId}/admin/${ctx?.adminId}/project/list`}/>
                    </IonButtons>
                    <IonButtons slot={`end`}>
                        <IonButton color={`danger`} onClick={()=>{
                            presentAlert({
                                header: `Are you sure you want to delete this item?`,
                                mode: `ios`,
                                buttons: [
                                    {
                                        text: 'Cancel',
                                        role: 'cancel',
                                    },
                                    {
                                        text: 'Delete',
                                        role: 'confirm',
                                        cssClass: 'delete-alert',
                                        handler: () => {
                                        },
                                    },
                                ]
                            })
                        }}>
                            Delete
                        </IonButton>
                    </IonButtons>
                    <IonTitle>
                        Detail
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent ref={handleRef} scrollEvents={true}>
                <IonAccordionGroup value={showAccordion.toString()} style={{ position: `sticky`, top: 0, zIndex: 1, }}>
                    <IonAccordion value={ACCORDION.OPEN.toString()}>
                        <IonItem slot={`header`} color={`medium`} onClick={handleAccordionClick}>
                            <IonLabel>
                                Description
                            </IonLabel>
                        </IonItem>
                        <Box slot={`content`} sx={{ bgcolor: `#f4f5f8`, borderBottom: 1, borderColor: `#92949c`, }}>
                            <IonItem className={`description-item`} color={`transparent`}>
                                <IonLabel>
                                    Auftraggeber
                                </IonLabel>
                                <p style={{ fontSize: `1rem` }}>Auftraggeber</p>
                            </IonItem>
                            <IonItem className={`description-item`} color={`transparent`}>
                                <IonLabel>
                                    Bauvorhaben
                                </IonLabel>
                                <p style={{ fontSize: `1rem` }}>Bauvorhaben</p>
                            </IonItem>
                            <IonItem className={`description-item`} color={`transparent`}>
                                <IonLabel>
                                    Projektnummer
                                </IonLabel>
                                <p style={{ fontSize: `1rem` }}>Projektnummer</p>
                            </IonItem>
                            <IonItem className={`description-item`} color={`transparent`}>
                                <IonIcon slot={`end`} icon={checkbox} color={`success`}/>
                                <IonLabel>
                                    Umweltuntersuchung
                                </IonLabel>
                            </IonItem>
                            <IonItem className={`description-item`} color={`transparent`} lines={`full`}>
                                <IonIcon slot={`end`} icon={closeCircle} color={`danger`}/>
                                <IonLabel>
                                    Laborversuche
                                </IonLabel>
                            </IonItem>
                            <IonItem className={`description-item`} color={`transparent`} lines={`none`}>
                                <IonIcon slot={`end`} icon={checkbox} color={`success`} size={`large`}/>
                                <IonLabel>
                                    <h1>Finished</h1>
                                </IonLabel>
                            </IonItem>
                        </Box>
                    </IonAccordion>
                </IonAccordionGroup>
                <VerticalLinearStepper setStepHeight={setStepHeight} setHeight={setHeight} setAllow={setAllow}/>
            </IonContent>
        </IonPage>
    );
}


export default ProjectDetail;