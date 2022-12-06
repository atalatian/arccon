import {
    IonButton,
    IonContent,
    IonIcon,
    IonImg,
    IonPage, useIonViewWillLeave,
} from "@ionic/react";
import {business, chevronForward} from "ionicons/icons";
import {Box} from "@mui/system";
import ChooseAdmin from "../components/ChooseAdmin";
import {useEffect, useState} from "react";
import {RouteComponentProps} from "react-router";
import Logo from '../images/arccon-logo.png';
import classes from './Setup.module.css';
import React from "react";
import {departments, Department, Admin, admins as adminsData} from "../data";
import produce from "immer";
import {PushNotifications} from "@capacitor/push-notifications";
import {Capacitor} from "@capacitor/core";
import { v4 as uuidv4 } from 'uuid';
import MyToast from "../components/MyToast";

interface itemProps {
    department: Department,
    routeProps: RouteComponentProps,
    btnProps?: { disabled: boolean } | undefined,
    isOpen: boolean,
    handleIsOpen: (id: number) => (e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>) => void,
}

const Item = (props: itemProps): JSX.Element => {

    const { handleIsOpen } = props;
    const { btnProps, department } = props;

    const handleDisable = (deptName: string) => {
        switch (deptName) {
            case 'bergbau':
                return true;
            case 'umwelt':
                return true;
            default:
                return false;
        }
    }

    return(
        <IonButton className={`${classes.customButton} ion-margin-bottom`} disabled={handleDisable(department.name)} onClick={handleIsOpen(department.id)} expand={`block`} {...btnProps}>
            <IonIcon slot={`start`} icon={business}/>
            <Box component={`span`} minWidth={`100px`} textAlign={`left`} ml={1} textTransform={`capitalize`}>
                {department.name}
            </Box>
            <IonIcon slot={`end`} icon={chevronForward}/>
        </IonButton>
    )
}

const getAdmins = produce<Admin[], [number]>((draft, id) => {
    return draft.filter((admin) => admin.department.id === id);
})

enum ToastType {
    error = `error`,
    success = `success`,
}

const Setup = (props: RouteComponentProps): JSX.Element => {

    const { history } = props;
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastType, setToastType] = useState<ToastType>(ToastType.error);
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(()=>{
        (async ()=>{
            if (Capacitor.isPluginAvailable('PushNotifications')){
                await PushNotifications.addListener('registration', token => {
                });

                await PushNotifications.addListener('registrationError', err => {
                    console.error('Registration error: ', err.error);
                });

                await PushNotifications.addListener('pushNotificationReceived',   (notification) => {
                    console.log(notification)
                });
            }
        })()
    }, [])

    useEffect(()=>{
        (async ()=>{
            if (Capacitor.isPluginAvailable('PushNotifications')){
                let permStatus = await PushNotifications.checkPermissions();

                if (permStatus.receive === 'prompt' || permStatus.receive === 'prompt-with-rationale') {
                    permStatus = await PushNotifications.requestPermissions();
                }

                if (permStatus.receive === 'denied') {
                    setToastType(ToastType.error);
                    setToastMessage('Permission is not granted for push notifications');
                    setShowToast(true);
                }

                if (permStatus.receive === 'granted'){
                    await PushNotifications.register();
                }
            } else {

            }
        })()
    }, [])

    const handleIsOpen = (id: number) => {
        return (e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>) : void => {
            setAdmins(getAdmins(adminsData, id))
            setIsOpen(true);
        }
    }

    useIonViewWillLeave(()=>{
        setIsOpen(false);
    }, [])

    return (
        <IonPage>
            <IonContent>
                <Box className={`${classes.gradientBackground}`} height={`100%`}>
                    <Box display="grid" gridTemplateColumns="repeat(6, 1fr)" height={`inherit`} width={500} maxWidth={`100%`} margin={`auto`}>
                        <Box gridRow={`span 1`} gridColumn="2 / span 4" alignSelf={`end`}>
                            <IonImg src={Logo}/>
                        </Box>
                        <Box gridRow={`span 1`} gridColumn="2 / span 4" alignSelf={`center`}>
                            {
                                departments.length > 0 &&
                                departments.map((department) =>
                                    <Item key={department.id} isOpen={isOpen} handleIsOpen={handleIsOpen} department={department} routeProps={props}/>)
                            }
                        </Box>
                    </Box>
                </Box>
                <ChooseAdmin isOpen={isOpen} setIsOpen={setIsOpen} admins={admins} routeProps={props}/>
                <MyToast showToast={showToast} setShowToast={setShowToast} message={toastMessage} cssClass={toastType}/>
            </IonContent>
        </IonPage>
    );
}



export default Setup;