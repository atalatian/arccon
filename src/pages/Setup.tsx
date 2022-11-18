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
import {useState} from "react";
import {RouteComponentProps} from "react-router";
import Logo from '../images/arccon-logo.png';
import classes from './Setup.module.css';
import React from "react";
import {departments, Department, Admin, admins as adminsData} from "../data";
import produce from "immer";


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

const Setup = (props: RouteComponentProps): JSX.Element => {

    const [admins, setAdmins] = useState<Admin[]>([]);
    const [isOpen, setIsOpen] = useState(false);

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
            </IonContent>
        </IonPage>
    );
}



export default Setup;