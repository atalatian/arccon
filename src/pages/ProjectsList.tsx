import {
    IonBadge,
    IonButton,
    IonButtons, IonCheckbox, IonChip,
    IonContent, IonFab, IonFabButton, IonFooter,
    IonHeader, IonIcon,
    IonItem,
    IonLabel,
    IonList, IonLoading,
    IonPage, IonSearchbar,
    IonTitle,
    IonToolbar, SearchbarCustomEvent,
    useIonAlert, useIonViewWillLeave
} from "@ionic/react";
import { settings, add, trash, closeCircle, person } from 'ionicons/icons';
import React, {useContext, useState} from "react";
import AddProject from "../components/AddProject";
import "./ProjectList.css";
import Typography from "@mui/material/Typography";
import {RouteComponentProps} from "react-router";
import {DepAdContext} from "../context/DepAdContext";


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


const ProjectsList = ({ history }: RouteComponentProps) : JSX.Element => {
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
            history.push(`/department/${ctx?.departmentId}/admin/${ctx?.adminId}/project/detail/${id}`);
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

    const filterSearch = (data: Project[]): Project[] => {
        if (searchValue.length > 0){
            return data.filter((project) => project.name.includes(searchValue));
        }
        return data
    }


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot={`start`}>
                        <IonButton routerLink={`/settings/department`}>
                            <IonIcon icon={person}/>
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
                    <IonTitle>Projects</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonSearchbar animated={true} value={searchValue} onIonChange={handleSearch} placeholder={`Search Project`}></IonSearchbar>
                <IonList>
                    {
                        filterSearch(data).map((project): JSX.Element=>{
                            return(
                                <IonItem key={project.id} onClick={mode === MODES.SELECT ? handleItemClick(project.id) : handleClick(project.id)}
                                         button detail={mode === MODES.READ}
                                         routerLink={mode === MODES.READ ? `/project/detail/${project.id}` : undefined}>
                                    {
                                        mode === MODES.SELECT &&
                                        <IonCheckbox checked={selectedIds.includes(project.id)} slot={`start`}></IonCheckbox>
                                    }
                                    <IonLabel>
                                        <h3>{project.name}</h3>
                                        <p>Started At - {project.startDate}</p>
                                    </IonLabel>
                                </IonItem>
                            )
                        })
                    }
                </IonList>
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={()=> setModalOpen(true)}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
                <AddProject isOpen={modalOpen} setIsOpen={setModalOpen}/>
            </IonContent>
            {
                mode === MODES.SELECT &&
                <IonFooter>
                    <IonToolbar>
                        <IonButtons slot={`end`}>
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
                                        mode: `ios`,
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
                        <IonButtons slot={`start`}>
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