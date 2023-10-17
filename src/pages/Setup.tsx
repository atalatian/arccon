import {
    IonAlert,
    IonButton, IonButtons,
    IonContent, IonFooter,
    IonIcon,
    IonImg, IonItem,
    IonPage, IonSkeletonText, IonSpinner, IonText, IonTitle, IonToolbar, useIonViewWillLeave,
} from "@ionic/react";
import {business, chevronForward, exit} from "ionicons/icons";
import {Box} from "@mui/system";
import {SetStateAction, useContext, useEffect, useState} from "react";
import {RouteComponentProps} from "react-router";
import Logo from '../images/arccon-logo.png';
import classes from './Setup.module.css';
import React from "react";
import MyToast from "../components/MyToast";
import {getAuth, signOut} from "firebase/auth";
import {Auth} from "../context/Auth";
import {Data, Department, DepartmentsData} from "../context/Data";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import Typography from "@mui/material/Typography";
import {UserData} from "../context/Hooks/useGetUserByUID";
import ChooseAdmin from "../components/ChooseAdmin";

interface itemProps {
    department: Department,
    routeProps: RouteComponentProps,
    btnProps?: { disabled: boolean } | undefined,
    isOpen: boolean,
    handleIsOpen: (id: string) => (e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>) => void,
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

enum ToastType {
    error = `error`,
    success = `success`,
}

const Setup = (props: RouteComponentProps): JSX.Element => {

    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastType, setToastType] = useState<ToastType>(ToastType.error);
    const [isOpen, setIsOpen] = useState(false);
    const [showSignAlert, setShowSignAlert] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");
    const setOpen = useContext(Auth)?.setOpen;
    const setToken = useContext(Auth)?.setToken;
    const departments = useContext(Data)?.departmentsData as DepartmentsData;
    const user = useContext(Data)?.userData as UserData;


    const handleIsOpen = (id: string) => {
        return (e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>) : void => {
            setSelectedDepartment(id)
            setIsOpen(true);
        }
    }

    useIonViewWillLeave(()=>{
        setIsOpen(false);
    }, [])

    const handleSignOut = () => {
        const auth = getAuth();
        signOut(auth).then(()=>{
            props.history.replace("/");
            if (setToken){
                setToken(null);
            }
            if (setOpen){
                setOpen(true);
            }
        }).catch((error)=>{
            let message = error;
            setToastType(ToastType.error);
            setToastMessage(message);
            setShowToast(true);
        })
    }

    useEffect(()=>{
        setToastType(ToastType.error);
        setToastMessage(departments.error.message);
        setShowToast(departments.error.show)
    }, [departments])

    useEffect(()=>{
        setToastType(ToastType.error);
        setToastMessage(user.error.message);
        setShowToast(user.error.show)
    }, [user])

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
                                departments.notFound &&
                                <Box display={`flex`} flexDirection={`column`} alignItems={`center`} justifyContent={`center`} gap={2} padding={1} color={`rgba(0,0,0,0.3)`}>
                                    <FontAwesomeIcon icon={faMagnifyingGlass} size={`3x`}/>
                                    <Typography>
                                        No department found
                                    </Typography>
                                </Box>
                            }
                            {
                                departments.searching &&
                                <>
                                    <Box sx={{ width: `100%`, height: `36px` }} mb={2}>
                                        <IonSkeletonText animated={true} style={{ 'width': '100%', "height": `100%` }}></IonSkeletonText>
                                    </Box>
                                    <Box sx={{ width: `100%`, height: `36px` }} mb={2}>
                                        <IonSkeletonText animated={true} style={{ 'width': '100%', "height": `100%` }}></IonSkeletonText>
                                    </Box>
                                    <Box sx={{ width: `100%`, height: `36px` }} mb={2}>
                                        <IonSkeletonText animated={true} style={{ 'width': '100%', "height": `100%` }}></IonSkeletonText>
                                    </Box>
                                </>
                            }
                            {
                                departments.data.map((department) =>
                                    <Item key={department.id} isOpen={isOpen} handleIsOpen={handleIsOpen} department={department} routeProps={props}/>)
                            }
                        </Box>
                    </Box>
                </Box>
                <ChooseAdmin isOpen={isOpen} setIsOpen={setIsOpen} department={selectedDepartment} routeProps={props}/>
                <MyToast showToast={showToast} setShowToast={setShowToast} message={toastMessage} cssClass={toastType}/>
            </IonContent>
            <IonFooter>
                <IonToolbar className={`custom-toolbar`}>
                    <IonButtons slot={`start`}>
                        <IonButton className={`sign-button`} onClick={()=> setShowSignAlert(true)}>
                            <IonIcon size={`large`} icon={exit}/>
                        </IonButton>
                        <IonAlert
                            isOpen={showSignAlert}
                            cssClass={`custom-alert`}
                            onDidDismiss={() => setShowSignAlert(false)}
                            header="Alert"
                            message={`Are you sure you want to log out?`}
                            buttons={[{ text: `Cancel`, role: `cancel` },
                                { text: `Log Out`, role: `confirm`, cssClass: `sign-alert`, handler: handleSignOut }]}
                        />
                    </IonButtons>
                    <IonTitle slot={`start`}>
                        <IonText>
                            {
                                user.searching &&
                                <Box display={`flex`} flexDirection={`column`} alignItems={`flex-start`} justifyContent={`center`} color={`#fff`}>
                                    <IonSpinner color={`rgba(0,0,0,0.3)`}></IonSpinner>
                                </Box>
                            }
                            {
                                user.data?.name
                            }
                        </IonText>
                    </IonTitle>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
}



export default Setup;