import {IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonPage, IonRow} from "@ionic/react";
import { build, enter, person } from "ionicons/icons";
import {Box, Stack} from "@mui/system";
import ChooseAdmin from "../components/ChooseAdmin";
import {useContext, useEffect, useLayoutEffect, useState} from "react";
import {RouteComponentProps} from "react-router";
import Logo from '../images/arccon-logo.png';
import './Setup.css';
import {DepAdContext} from "../context/DepAdContext";


const Setup = (props: RouteComponentProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const [openLogo, setOpenLogo] = useState(true);
    const ctx = useContext(DepAdContext);


    useLayoutEffect(()=>{
        if (ctx?.departmentId !== null && ctx?.adminId !== null){
            props.history.push('/project/list')
        }
    }, [])

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
                <Box className={`gradient-background`} height={`100%`}>
                    <Box display="grid" gridTemplateColumns="repeat(6, 1fr)" height={`inherit`} width={500} maxWidth={`100%`} margin={`auto`}>
                        <Box gridRow={`span 1`} gridColumn="2 / span 4" alignSelf={`end`}>
                            <IonImg src={Logo}/>
                        </Box>
                        <Box gridRow={`span 1`} gridColumn="2 / span 4" alignSelf={`center`}>
                            <IonButton className={`custom-button`} onClick={()=> setIsOpen(true)} expand={`block`}>
                                <IonIcon slot={`start`} icon={person}/>
                                Choose Admin
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