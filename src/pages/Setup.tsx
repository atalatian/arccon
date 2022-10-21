import {
    IonButton,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonImg,
    IonNavLink,
    IonPage,
    IonRow
} from "@ionic/react";
import {build, business, enter, person, chevronForward} from "ionicons/icons";
import {Box, Stack} from "@mui/system";
import ChooseAdmin from "../components/ChooseAdmin";
import {useContext, useEffect, useLayoutEffect, useState} from "react";
import {RouteComponentProps} from "react-router";
import Logo from '../images/arccon-logo.png';
import classes from './Setup.module.css';
import {DepAdContext} from "../context/DepAdContext";
import Typography from "@mui/material/Typography";


const Setup = (props: RouteComponentProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const [openLogo, setOpenLogo] = useState(true);


    useEffect(()=>{
        setTimeout(()=> {
            setOpenLogo(false)
        }, 2000)
    }, [])

    return (
        <IonPage>
            {
                openLogo &&
                <Box position={`absolute`} bgcolor={`#C1C1BC`} zIndex={99999999} width={`100%`} height={`100%`}>
                    <Box display="grid" gridTemplateColumns="repeat(6, 1fr)" height={`inherit`}>
                        <Box gridRow={`span 1`} gridColumn="2 / span 4" alignSelf={`center`}>
                            <IonImg src={Logo}/>
                        </Box>
                    </Box>
                </Box>
            }
            <IonContent>
                <Box className={`${classes.gradientBackground}`} height={`100%`}>
                    <Box display="grid" gridTemplateColumns="repeat(6, 1fr)" height={`inherit`} width={500} maxWidth={`100%`} margin={`auto`}>
                        <Box gridRow={`span 1`} gridColumn="2 / span 4" alignSelf={`end`}>
                            <IonImg src={Logo}/>
                        </Box>
                        <Box gridRow={`span 1`} gridColumn="2 / span 4" alignSelf={`center`}>
                            <IonNavLink routerDirection={`forward`} component={() => <ChooseAdmin isOpen={isOpen} setIsOpen={setIsOpen} {...props}/>}>
                                <IonButton className={`${classes.customButton} ion-margin-bottom`}  expand={`block`}>
                                    <IonIcon slot={`start`} icon={business}/>
                                    <Box component={`span`} minWidth={`100px`} textAlign={`left`} ml={1}>
                                        Geotechnik
                                    </Box>
                                    <IonIcon slot={`end`} icon={chevronForward}/>
                                </IonButton>
                            </IonNavLink>
                            <IonButton className={`${classes.customButton} ion-margin-bottom`} onClick={()=> setIsOpen(true)} expand={`block`}>
                                <IonIcon slot={`start`} icon={business}/>
                                <Box component={`span`} minWidth={`100px`} textAlign={`left`} ml={1}>
                                    Bergbau
                                </Box>
                                <IonIcon slot={`end`} icon={chevronForward}/>
                            </IonButton>
                            <IonButton className={`${classes.customButton} ion-margin-bottom`} onClick={()=> setIsOpen(true)} expand={`block`}>
                                <IonIcon slot={`start`} icon={business}/>
                                <Box component={`span`} minWidth={`100px`} textAlign={`left`} ml={1}>
                                    Umwelt
                                </Box>
                                <IonIcon slot={`end`} icon={chevronForward}/>
                            </IonButton>
                        </Box>
                    </Box>
                </Box>
                <ChooseAdmin {...props} setIsOpen={setIsOpen} isOpen={isOpen}/>
            </IonContent>
        </IonPage>
    );
}



export default Setup;