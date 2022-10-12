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
import {useCallback} from "react";

interface StepObj{
    id: number,
    name: string,
}

const steps: StepObj[] = [
    {
        id: 0,
        name: 'leitungsanfrage',
    },
    {
        id: 1,
        name: 'kampfmittelfreigabe',
    },
    {
        id: 2,
        name: 'baugrunderkundungstermin',
    },
    {
        id: 3,
        name: 'feldprotokolle auftragen',
    },
    {
        id: 4,
        name: 'frobe Lieferung',
    },
    {
        id: 5,
        name: 'bodenansprache',
    },
    {
        id: 6,
        name: 'probenahme für Labor',
    },
    {
        id: 7,
        name: 'unterlagen Vorbereitung',
    },
    {
        id: 8,
        name: 'bericht',
    },
];

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

interface Props {
    setStepHeight: (height: number) => void,
    setHeight: (height: number) => void,
    setAllow: (allow: boolean) => void,
}

export default function VerticalLinearStepper({ setStepHeight, setHeight, setAllow }: Props) {
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setAllow(true);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const handleRef = useCallback((e: (HTMLDivElement | null))=>{
        if (e){
            setStepHeight(e.offsetTop);
            setHeight(e.offsetHeight);
        }
    }, [])

    return (
        <Box p={2} pt={0.1} sx={{
            "& .MuiStepConnector-root span": { borderColor: `rgba(0, 0, 0, 0.26)` },
            "& .MuiStepContent-root": { borderColor: `rgba(0, 0, 0, 0.26)` },
            "& .MuiSvgIcon-root.Mui-active": { color: `#b22b48` },
            "& .MuiSvgIcon-root.Mui-completed": { color: `#b22b48` },
        }}>
            <ThemeProvider theme={theme}>
                <Typography>
                    <h1>Aufgabenverteilung</h1>
                </Typography>
            </ThemeProvider>
            <Stepper activeStep={activeStep} orientation="vertical" sx={{ ml: 1 }}>
                {steps.map((step, index) => (
                    <Step ref={activeStep === step.id ? handleRef : undefined} key={step.id}>
                        <StepLabel>
                            <ThemeProvider theme={theme}>
                                <Typography>
                                    {step.name}
                                </Typography>
                            </ThemeProvider>
                        </StepLabel>
                        <StepContent>
                            <Box sx={{ mb: 2 }}>
                                <div>
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
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
                                                {index === steps.length - 1 ? 'Finish' : 'Continue'}
                                            </Typography>
                                        </ThemeProvider>
                                    </Button>
                                    <Button
                                        disabled={index === 0}
                                        onClick={handleBack}
                                        sx={{
                                            mt: 1,
                                            mr: 1,
                                            "&.MuiButtonBase-root.MuiButton-text": {
                                                color: `#FFFFFF`
                                            },
                                            "&.MuiButtonBase-root.MuiButton-text.Mui-disabled": {
                                                color: `rgba(0, 0, 0, 0.26)`
                                            }
                                        }}
                                    >
                                        <ThemeProvider theme={theme}>
                                            <Typography sx={{ textTransform: `capitalize` }}>
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
            {activeStep === steps.length && (
                <Paper square elevation={0} sx={{
                    backgroundColor: `#C1C1BC`,
                    p: 3,
                }}>
                    <Typography>All steps completed - you&apos;re finished</Typography>
                    <Button onClick={handleReset} sx={{
                        mt: 1,
                        mr: 1,
                        "&.MuiButtonBase-root.MuiButton-text": {
                            color: `#fff`
                        },
                    }}>
                        Reset
                    </Button>
                </Paper>
            )}
        </Box>
    );
}
