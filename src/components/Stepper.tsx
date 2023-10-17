import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {createTheme, ThemeProvider} from "@mui/system";
import {SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import {admins, Task, tasks} from "../data";
import MyLoading from "./MyLoading";
import MyToast from "./MyToast";
import {Storage} from "@ionic/storage";
import {doc, getDoc, getFirestore, setDoc} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {IonButton, IonIcon} from "@ionic/react";
import { informationCircle } from 'ionicons/icons'
import {IconButton} from "@mui/material";
import StepDescriptionAlert from "./StepDescriptionAlert";


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

interface Project {
    id: string,
    client: string,
    name: string,
    number: string,
    current_task: number,
    environmental_survey: boolean,
    laboratory: boolean,
    deadline: boolean,
}

interface Props {
    currentTask: number,
    environmentalSurvey: boolean,
    laboratory: boolean,
    projectId: string,
    adminId: string,
    setBoxTop: React.Dispatch<SetStateAction<number>>,
    setStepHeight: React.Dispatch<SetStateAction<number>>,
    transitionEnd: boolean | undefined,
    renderControl: boolean,
}


enum ToastType {
    error = `error`,
    success = `success`,
}

export default function VerticalLinearStepper(props: Props) {

    const { transitionEnd } = props
    const { setStepHeight, setBoxTop } = props
    const { environmentalSurvey, laboratory, projectId, currentTask, adminId, renderControl } = props;

    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastType, setToastType] = useState<ToastType>(ToastType.error);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [resetLoaded, setResetLoaded] = useState<boolean>(false);
    const [stepContentTransEnd, setStepContentTransEnd] = useState<number>(0);
    const [selectedId, setSelectedId] = useState<number>(-1);
    const steps = useRef<HTMLDivElement[]>([]);
    const reset = useRef<HTMLDivElement>();
    const db = getFirestore();

    const filteredTasks: Task[] = tasks.filter((task) => task.environmental_survey === environmentalSurvey && task.laboratory === laboratory)
        .sort((a, b)=>{
            return a.level - b.level;
        })

    const [activeStep, setActiveStep] = React.useState(-1);

    useEffect(() => {
        if (currentTask === -1){
            setActiveStep(filteredTasks.length);
        } else {
            const step: number | undefined = filteredTasks.find((task) => task.id === currentTask)?.level;
            if (step !== undefined) {
                setActiveStep(step - 1);
            }
        }
    }, [currentTask])

    useEffect(()=>{
        if (resetLoaded){
            if (activeStep === filteredTasks.length){
                const element = reset.current;
                if (element !== undefined){
                    setBoxTop(element.offsetTop);
                    setStepHeight(element.offsetHeight + 5)
                }
            }
        }
    }, [resetLoaded, activeStep, transitionEnd, stepContentTransEnd])

    useEffect(()=>{
        if (loaded){
            const el = steps.current.find((step) => step.id === `box-${activeStep + 1}`);
            if (el !== undefined){
                setBoxTop(el.offsetTop);
                if (el.parentElement){
                    setStepHeight(el.parentElement.offsetHeight)
                }
            }
        }
    }, [loaded, activeStep, transitionEnd, stepContentTransEnd])

    const handleNext = (id: number) => {
        return async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) : Promise<void> => {
            try {
                //setLoadingMessage('Changing task')
                //setShowLoading(true);
                await setDoc(doc(db, "Projects", projectId), {
                    currentTask: id,
                    updatedAt: new Date(),
                }, { merge: true });
                //setShowLoading(false);
            } catch (e: any) {
                //setShowLoading(false);
                let message = e.message;
                setToastType(ToastType.error);
                setToastMessage(message);
                setShowToast(true);
            }
        }
    };

    const handleBack = (id: number) => {
        return async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) : Promise<void> => {
            try {
                //setLoadingMessage('Changing task')
                //setShowLoading(true);
                await setDoc(doc(db, "Projects", projectId), {
                    currentTask: id,
                    updatedAt: new Date(),
                }, { merge: true });
                //setShowLoading(false);
            } catch (e: any) {
                //setShowLoading(false);
                let message = e.message;
                setToastType(ToastType.error);
                setToastMessage(message);
                setShowToast(true);
            }
        }
    };

    const handleFinish = async () => {
        try {
            //setLoadingMessage('Finishing project')
            //setShowLoading(true);
            await setDoc(doc(db, "Projects", projectId), {
                currentTask: -1,
                updatedAt: new Date(),
            }, { merge: true });
            //setShowLoading(false);
        } catch (e: any) {
            //setShowLoading(false);
            let message = e.message;
            setToastType(ToastType.error);
            setToastMessage(message);
            setShowToast(true);
        }
    }

    const handleReset = async () => {
        try {
            const firstTaskId: number | undefined = filteredTasks.find((task) =>
                task.environmental_survey === environmentalSurvey && task.laboratory === laboratory && task.level === 1)?.id
            //setLoadingMessage('Resetting tasks')
            //setShowLoading(true);
            await setDoc(doc(db, "Projects", projectId), {
                currentTask: firstTaskId,
                updatedAt: new Date(),
            }, { merge: true });
            //setShowLoading(false);
        } catch (e: any) {
            //setShowLoading(false);
            let message = e.message;
            setToastType(ToastType.error);
            setToastMessage(message);
            setShowToast(true);
        }
    }

    const handleRef = useCallback((e: HTMLDivElement | null) => {
        if (e){
            steps.current.push(e);
            if (steps.current.length === filteredTasks.length){
                setLoaded(true);
            }
        }
    }, [])

    const handleResetRef = useCallback((e: HTMLDivElement | null)=>{
        if (e){
            reset.current = e;
            setResetLoaded(true);
        }
    }, [])

    return (
        <Box p={2} pt={0} sx={{
            "& .MuiStepConnector-root span": { borderColor: `rgba(0, 0, 0, 0.26)` },
            "& .MuiStepContent-root": { borderColor: `rgba(0, 0, 0, 0.26)` },
            "& .MuiSvgIcon-root.Mui-active": { color: `#b22b48` },
            "& .MuiSvgIcon-root.Mui-completed": { color: `#b22b48` },
        }}>
            <Stepper activeStep={activeStep} orientation="vertical" sx={{ ml: 1 }} >
                {filteredTasks.map((step, index) => (
                    <Step key={step.id} disabled={true}>
                        <Box id={`box-${step.level}`} component={`div`} ref={handleRef}></Box>
                        <Box display={`flex`}>
                            <StepLabel>
                                <Typography textTransform={`capitalize`}>
                                    {step.name}
                                </Typography>
                            </StepLabel>
                            <StepDescriptionAlert step={step}/>
                        </Box>
                        <StepContent onTransitionEnd={()=> setStepContentTransEnd((prev) => prev === 100 ? 0 : prev + 1)}>
                            {   renderControl &&
                                <Box sx={{ mb: 2 }}>
                                    <div>
                                        {   index === filteredTasks.length - 1
                                            ?
                                            <Button
                                                variant="contained"
                                                onClick={handleFinish}
                                                sx={{
                                                    mt: 1,
                                                    mr: 1,
                                                    "&.MuiButtonBase-root.MuiButton-contained": {
                                                        backgroundColor: `#b22b48`,
                                                    },
                                                    "&.MuiButtonBase-root.MuiButton-contained:hover": {
                                                        backgroundColor: `#97253D`,
                                                    },
                                                }}
                                            >
                                                <Typography sx={{ textTransform: `capitalize` }}>
                                                    Finish
                                                </Typography>
                                            </Button>
                                            :
                                            <Button
                                                variant="contained"
                                                onClick={handleNext(index !== filteredTasks.length - 1 ? filteredTasks[index + 1].id : filteredTasks[index].id)}
                                                sx={{
                                                    mt: 1,
                                                    mr: 1,
                                                    "&.MuiButtonBase-root.MuiButton-contained": {
                                                        backgroundColor: `#b22b48`,
                                                    },
                                                    "&.MuiButtonBase-root.MuiButton-contained:hover": {
                                                        backgroundColor: `#97253D`,
                                                    },
                                                }}
                                            >
                                                <Typography sx={{ textTransform: `capitalize` }}>
                                                    Continue
                                                </Typography>
                                            </Button>
                                        }
                                        <Button
                                            disabled={index === 0}
                                            variant={`contained`}
                                            onClick={handleBack(index !== 0 ? filteredTasks[index - 1].id : filteredTasks[index].id)}
                                            sx={{
                                                mt: 1,
                                                mr: 1,
                                                "&.MuiButtonBase-root.MuiButton-contained": {
                                                    backgroundColor: `#ffffff`,
                                                    color: `#1d1d1b`
                                                },
                                                "&.MuiButtonBase-root.MuiButton-contained:hover": {
                                                    backgroundColor: `#cccccc`,
                                                },
                                                "&.MuiButtonBase-root.MuiButton-contained.Mui-disabled": {
                                                    color: `rgba(0, 0, 0, 0.1)`,
                                                    backgroundColor: `rgba(0, 0, 0, 0.1)`,
                                                }
                                            }}
                                        >
                                            <Typography sx={{ textTransform: `capitalize` }}>
                                                Back
                                            </Typography>
                                        </Button>
                                    </div>
                                </Box>
                            }

                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === filteredTasks.length && (
                <Paper ref={handleResetRef} elevation={0} sx={{
                    backgroundColor: `rgba(255, 255, 255, 0.5)`,
                    p: 2,
                    borderRadius: `10px`,
                    mt: 1,
                    ml: 1
                }}>
                    <Typography className={`make-ionic`}>All steps completed - you&apos;re finished</Typography>
                    <Button onClick={handleReset} variant={`contained`} sx={{
                        mt: 1,
                        mr: 1,
                        "&.MuiButtonBase-root.MuiButton-contained": {
                            backgroundColor: `#ffffff`,
                            color: `#1d1d1b`
                        },
                        "&.MuiButtonBase-root.MuiButton-contained:hover": {
                            backgroundColor: `#cccccc`,
                        },
                        "&.MuiButtonBase-root.MuiButton-contained.Mui-disabled": {
                            color: `rgba(0, 0, 0, 0.26)`
                        }
                    }}>
                        Reset
                    </Button>
                </Paper>
            )}
            <MyToast showToast={showToast} setShowToast={setShowToast} message={toastMessage} cssClass={toastType}/>
        </Box>
    );
}
