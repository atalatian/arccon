import React, {useContext, useEffect, useState} from "react";
import {
    IonButton,
    IonButtons, IonContent,
    IonHeader, IonIcon,
    IonItem,
    IonLabel, IonList,
    IonModal, IonSkeletonText, IonSpinner,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {RouteComponentProps} from "react-router";
import "./ChooseAdmin.css";
import {person} from "ionicons/icons";
import {Admin, Data} from "../context/Data";
import {AdminsFunctions} from "../context/Hooks/useGetAdminsByDepartment";
import {Box} from "@mui/system";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import Typography from "@mui/material/Typography";
import MyToast from "./MyToast";

interface ItemProps extends RouteComponentProps{
    id: string,
    name: string,
    lastItem: boolean,
}

const Item = (props: ItemProps) => {
    const { id, name, history, lastItem } = props;

    const handleClick = () => {
        history.push(`/${id}/project/list`);
    }

    return(
        <IonItem button detail lines={lastItem ? `none` : `inset`} className={`custom-admin-item`} color={`transparent`} onClick={handleClick}>
            <IonIcon icon={person} slot="start"></IonIcon>
            <IonLabel>
                {name}
            </IonLabel>
        </IonItem>
    );
}

enum ToastType {
    error = `error`,
    success = `success`,
}

interface Props{
    isOpen: boolean,
    setIsOpen: (open: boolean) => void,
    department: string,
    routeProps: RouteComponentProps,
}

const ChooseAdmin = (props: Props) => {

    const { routeProps, department } = props;
    const { isOpen, setIsOpen } = props;
    const adminsData = useContext(Data)?.adminsData as AdminsFunctions;
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastType, setToastType] = useState<ToastType>(ToastType.error);


    useEffect(()=>{
        adminsData.getAdminsByDepartment(department);
    }, [department])

    useEffect(()=>{
        setToastType(ToastType.error);
        setToastMessage(adminsData.error.message);
        setShowToast(adminsData.error.show)
    }, [adminsData])

    return(
        <>
            <IonModal isOpen={isOpen} className={`custom-admin-modal`} onDidDismiss={()=> setIsOpen(false)}>
                <IonHeader>
                    <IonToolbar className={`custom-toolbar`}>
                        <IonButtons slot="start">
                            <IonButton onClick={() => setIsOpen(false)}>Cancel</IonButton>
                        </IonButtons>
                        <IonTitle className={`custom-title`}>Choose Admin</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className={`custom-content`}>
                    <IonList className={`custom-list`}>
                        {
                            adminsData.data.sort((admin1, admin2) => admin1.order > admin2.order ? 1:-1).map((admin, index) => <Item key={admin.uid} id={admin.id} name={admin.name}
                                                                        lastItem={adminsData.data.length - 1 === index} {...routeProps}/>)
                        }
                        {
                            adminsData.searching &&
                            <>
                                <Box display={`flex`} flexDirection={`column`} alignItems={`center`} justifyContent={`center`} mt={2} color={`rgba(0,0,0,0.3)`}>
                                    <IonSpinner color={`rgba(0,0,0,0.3)`}></IonSpinner>
                                </Box>
                            </>
                        }
                        {
                            adminsData.notFound &&
                            <Box display={`flex`} flexDirection={`column`} alignItems={`center`} justifyContent={`center`} gap={2} padding={1} color={`rgba(0,0,0,0.3)`}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} size={`3x`}/>
                                <Typography>
                                    No task found
                                </Typography>
                            </Box>
                        }
                    </IonList>
                </IonContent>
            </IonModal>
            <MyToast showToast={showToast} setShowToast={setShowToast} message={toastMessage} cssClass={toastType}/>
        </>
    );
}

export default ChooseAdmin;