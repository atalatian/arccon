import {
    IonBadge,
    IonButton,
    IonButtons, IonCheckbox, IonChip,
    IonContent, IonFab, IonFabButton, IonFooter,
    IonHeader, IonIcon, IonImg,
    IonItem,
    IonLabel,
    IonList, IonListHeader, IonLoading,
    IonPage, IonSearchbar, IonText,
    IonTitle,
    IonToolbar, SearchbarCustomEvent,
    useIonAlert, useIonViewWillLeave
} from "@ionic/react";
import {settings, add, trash, closeCircle, person, document, alert} from 'ionicons/icons';
import React, {useContext, useEffect, useLayoutEffect, useState} from "react";
import AddProject from "../components/AddProject";
import "./ProjectList.css";
import Typography from "@mui/material/Typography";
import {RouteComponentProps} from "react-router";
import {DepAdContext} from "../context/DepAdContext";
import ChooseAdmin from "../components/ChooseAdmin";
import Logo from '../images/arccon-logo.png';
import LogoNoText from '../images/arccon-logo-no-text.png';
import {Backdrop} from "@mui/material";
import {Box} from "@mui/material";


interface Project {
    id: number,
    name: string,
    startDate: string,
}

enum MODES {
    READ,
    SELECT
}

const data: Project[] = [
    {
        id: 1,
        name: `Project Name 1`,
        startDate: `Sunday, 25 September 2022`,
    },
    {
        id: 2,
        name: `Project Name 2`,
        startDate: `Sunday, 25 September 2022`,
    },
]

const ProjectsList = (props : RouteComponentProps) : JSX.Element => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [mode, setMode] = useState<MODES>(MODES.READ);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [presentAlert] = useIonAlert();
    const ctx = useContext(DepAdContext);


    const handleItemClick = (id: number) => {
        return (e: React.MouseEvent): void => {
            const newSet = new Set<number>([...selectedIds])
            let newArray = Array.from(newSet);
            if (newArray.includes(id)){
                newArray = newArray.filter((number) => number !== id);
            }else {
                newArray = [...newArray, id];
            }
            setSelectedIds(newArray);
        }
    }

    const handleClick = (id: number) => {
        return (e: React.MouseEvent<HTMLIonItemElement, MouseEvent>): void =>{
            e.preventDefault();
            ctx?.setProjectId(id);
            props.history.push(`/project/detail`);
        }
    }

    const handleSearch = (ev: SearchbarCustomEvent): void => {
        if (ev.detail.value !== undefined){
            setSearchValue(ev.detail.value)
        }
    }

    const handleCancel = (): void => {
        setMode(MODES.READ);
        setSelectedIds([])
    }

    const handleExitClick = (): void => {
        props.history.go(-1);
    }

    const filterSearch = (data: Project[]): Project[] => {
        if (searchValue.length > 0){
            return data.filter((project) => project.name.includes(searchValue));
        }
        return data
    }

    const handleFabClick = () => {
        setModalOpen(true);
    }


    return (
        <IonPage className={`custom-project-list`}>
            <IonHeader>
                <IonToolbar className={`custom-toolbar`}>
                    <IonButtons slot={`start`}>
                        <IonButton onClick={handleExitClick}>
                            Exit
                        </IonButton>
                    </IonButtons>

                    <IonButtons slot={`end`}>
                        {
                            mode === MODES.READ &&
                            <IonButton onClick={()=> setMode(MODES.SELECT)}>
                                Select
                            </IonButton>
                        }
                    </IonButtons>
                    <IonTitle>
                        <Box width={65} margin={`auto`} className={`custom-logo`}>
                            <IonImg src={LogoNoText}/>
                        </Box>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className={`custom-content`}>
                <IonSearchbar className={`custom-search`} animated={true} value={searchValue} onIonChange={handleSearch} placeholder={`Search Project`}></IonSearchbar>
                <IonList className={`custom-list`}>
                    <IonListHeader>
                        <h1>Projects</h1>
                    </IonListHeader>
                    {   filterSearch(data).length > 0
                        ?
                        filterSearch(data).map((project, index): JSX.Element=>{
                            return(
                                <IonItem className={`custom-item`} lines={filterSearch(data).length === index + 1 ? 'none' : `inset`} key={project.id} onClick={mode === MODES.SELECT ? handleItemClick(project.id) : handleClick(project.id)}
                                         button detail={mode === MODES.READ}>
                                    {
                                        mode === MODES.SELECT &&
                                        <IonCheckbox className={`custom-checkbox`} checked={selectedIds.includes(project.id)} slot={`start`}></IonCheckbox>
                                    }
                                    <IonIcon slot={`start`} icon={document}/>
                                    <IonLabel>
                                        <h3>{project.name}</h3>
                                        <p>Started At - {project.startDate}</p>
                                    </IonLabel>
                                </IonItem>
                            )
                        })
                        :
                        <IonItem className={`custom-item custom-item-alert`}>
                            <IonIcon icon={alert}/>
                            <IonLabel>
                                No project found
                            </IonLabel>
                        </IonItem>
                    }
                </IonList>
                <IonFab vertical="bottom" horizontal="end" slot="fixed" className={`custom-button`}>
                    <IonFabButton onClick={handleFabClick}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
                <AddProject isOpen={modalOpen} setIsOpen={setModalOpen}/>
            </IonContent>
            {
                mode === MODES.SELECT &&
                <IonFooter>
                    <IonToolbar className={`custom-toolbar-footer`}>
                        <IonButtons slot={`end`} className={`custom-delete-button`}>
                            {
                                mode === MODES.SELECT &&
                                <IonBadge color={`danger`}>
                                    {selectedIds.length}
                                </IonBadge>
                            }
                            {
                                mode === MODES.SELECT &&
                                <IonButton className={`ion-margin-start`} color={`danger`} onClick={()=>{
                                    presentAlert({
                                        header: `Are you sure you want to delete ${selectedIds.length} items?`,
                                        cssClass: `custom-alert`,
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
                                    <IonIcon  icon={trash}/>
                                </IonButton>
                            }
                        </IonButtons>
                        <IonButtons slot={`start`} className={`custom-delete-button`}>
                            {
                                mode === MODES.SELECT &&
                                <IonButton color={`danger`} onClick={handleCancel}>
                                    Cancel
                                </IonButton>
                            }
                        </IonButtons>
                    </IonToolbar>
                </IonFooter>
            }
        </IonPage>
    );
}

export default ProjectsList;