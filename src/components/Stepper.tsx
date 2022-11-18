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
import {SetStateAction, useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {Task, tasks} from "../data";
import Parse from "parse";
import MyLoading from "./MyLoading";
import MyToast from "./MyToast";
import {type} from "os";
import {Storage} from "@ionic/storage";


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
}

interface Props {
    currentTask: number,
    environmentalSurvey: boolean,
    laboratory: boolean,
    projectId: string,
    setBoxTop: React.Dispatch<SetStateAction<number>>,
    setStepHeight: React.Dispatch<SetStateAction<number>>,
    transitionEnd: boolean | undefined,
    setProject: React.Dispatch<SetStateAction<Project | undefined>>,
    readProject: () => Promise<void>,
}

enum ACCORDION {
    OPEN,
    CLOSE,
}

enum ToastType {
    error = `error`,
    success = `success`,
}

export default function VerticalLinearStepper(props: Props) {

    const { readProject, setProject } = props;
    const { transitionEnd } = props
    const { setStepHeight, setBoxTop } = props
    const { environmentalSurvey, laboratory, projectId, currentTask } = props;

    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastType, setToastType] = useState<ToastType>(ToastType.error);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [resetLoaded, setResetLoaded] = useState<boolean>(false);
    const [stepContentTransEnd, setStepContentTransEnd] = useState<number>(0);
    const steps = useRef<HTMLDivElement[]>([]);
    const reset = useRef<HTMLDivElement>();

    const filteredTasks: Task[] = tasks.filter((task) => task.environmental_survey === environmentalSurvey && task.laboratory === laboratory)
        .sort((a, b)=>{
            return a.level - b.level;
        })

    const [activeStep, setActiveStep] = React.useState(-1);

    const reFetchProject = async (): Promise<void> => {
        const query = new Parse.Query('Project');
        query.equalTo('objectId', projectId);
        const result = await query.first();
        const newProject = {
            id: projectId,
            client: result?.get('client'),
            name: result?.get('name'),
            number: result?.get('number'),
            current_task: result?.get('current_task'),
            environmental_survey: result?.get('environmental_survey'),
            laboratory: result?.get('laboratory'),
        }
        const store = new Storage();
        await store.create();
        setProject(newProject);
        await store.set(`project-${projectId}`, newProject);
    }


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
            let Project: Parse.Object = new Parse.Object('Project');
            Project.set('objectId', projectId);
            Project.set('current_task', id);
            try {
                setLoadingMessage('Changing task')
                setShowLoading(true);
                const result = await Project.save();
                const store = new Storage();
                await store.create();
                await store.remove(`admin-${result.get('admin')}-projects`);
                await store.remove(`project-${projectId}`);
                await reFetchProject();
                setShowLoading(false);
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
    };

    const handleBack = (id: number) => {
        return async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) : Promise<void> => {
            let Project: Parse.Object = new Parse.Object('Project');
            Project.set('objectId', projectId);
            Project.set('current_task', id);
            try {
                setLoadingMessage('Changing task')
                setShowLoading(true);
                const result = await Project.save();
                const store = new Storage();
                await store.create();
                await store.remove(`admin-${result.get('admin')}-projects`);
                await store.remove(`project-${projectId}`);
                await reFetchProject();
                setShowLoading(false);
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
    };

    const handleFinish = async () => {
        let Project: Parse.Object = new Parse.Object('Project');
        Project.set('objectId', projectId);
        Project.set('current_task', -1);
        try {
            setLoadingMessage('Finishing project')
            setShowLoading(true);
            const result = await Project.save();
            const store = new Storage();
            await store.create();
            await store.remove(`admin-${result.get('admin')}-projects`);
            await store.remove(`project-${projectId}`);
            await reFetchProject();
            setShowLoading(false);
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

    const handleReset = async () => {
        let Project: Parse.Object = new Parse.Object('Project');
        const firstTaskId: number | undefined = filteredTasks.find((task) =>
            task.environmental_survey === environmentalSurvey && task.laboratory === laboratory && task.level === 1)?.id
        Project.set('objectId', projectId);
        Project.set('current_task', firstTaskId);
        try {
            setLoadingMessage('Resetting tasks')
            setShowLoading(true);
            const result = await Project.save();
            const store = new Storage();
            await store.create();
            await store.remove(`admin-${result.get('admin')}-projects`);
            await store.remove(`project-${projectId}`);
            await reFetchProject();
            setShowLoading(false);
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
                        <StepLabel>
                            <ThemeProvider theme={theme}>
                                <Typography className={`make-ionic`} textTransform={`capitalize`}>
                                    {step.name}
                                </Typography>
                            </ThemeProvider>
                        </StepLabel>
                        <StepContent onTransitionEnd={()=> setStepContentTransEnd((prev) => prev === 100 ? 0 : prev + 1)}>
                            <Box sx={{ mb: 2 }}>
                                <div>
                                    {   index === filteredTasks.length - 1
                                        ?
                                        <Button
                                            variant="contained"
                                            className={`make-ionic`}
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
                                            <ThemeProvider theme={theme}>
                                                <Typography sx={{ textTransform: `capitalize` }}>
                                                    Finish
                                                </Typography>
                                            </ThemeProvider>
                                        </Button>
                                        :
                                        <Button
                                            variant="contained"
                                            className={`make-ionic`}
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
                                            <ThemeProvider theme={theme}>
                                                <Typography sx={{ textTransform: `capitalize` }}>
                                                    Continue
                                                </Typography>
                                            </ThemeProvider>
                                        </Button>
                                    }
                                    <Button
                                        disabled={index === 0}
                                        variant={`contained`}
                                        className={`make-ionic`}
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
                                        <ThemeProvider theme={theme}>
                                            <Typography className={`make-ionic`} sx={{ textTransform: `capitalize` }}>
                                                Back
                                            </Typography>
                                        </ThemeProvider>
                                    </Button>
                                </div>
                            </Box>
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
                    <Button onClick={handleReset} variant={`contained`} className={`make-ionic`} sx={{
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
            <MyLoading showLoading={showLoading} setShowLoading={setShowLoading} message={loadingMessage}/>
        </Box>
    );
}
