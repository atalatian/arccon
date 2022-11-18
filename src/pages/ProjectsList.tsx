import {
    IonBackButton,
    IonBadge,
    IonButton,
    IonButtons, IonCheckbox,
    IonContent, IonFab, IonFabButton, IonFooter,
    IonHeader, IonIcon, IonImg,
    IonItem,
    IonLabel,
    IonList, IonListHeader,
    IonPage, IonSearchbar,
    IonTitle,
    IonToolbar, SearchbarCustomEvent,
    useIonAlert, useIonViewDidEnter, useIonViewWillLeave
} from "@ionic/react";
import {add, trash, document, exit} from 'ionicons/icons';
import React, {useCallback, useEffect, useRef, useState} from "react";
import AddProject from "../components/AddProject";
import "./ProjectList.css";
import {RouteComponentProps} from "react-router";
import LogoNoText from '../images/arccon-logo-no-text.png';
import {Box} from "@mui/material";
import MyToast from "../components/MyToast";
import Parse from "parse";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowDownWideShort, faArrowsSpin,
    faCalendarDays, faClipboardCheck, faClipboardQuestion, faFilePen,
    faFileSignature,
    faListCheck,
    faMagnifyingGlass
} from "@fortawesome/free-solid-svg-icons";
import {tasks} from "../data";
import MySkeleton from "../components/MySkeleton";
import Typography from "@mui/material/Typography";
import MyLoading from "../components/MyLoading";
import { Storage } from '@ionic/storage';


enum MODES {
    READ,
    SELECT
}

interface RouteParams extends RouteComponentProps<{
    adminId: string,
}>{}

enum ToastType {
    error = `error`,
    success = `success`,
}

interface Project {
    id: string,
    name: string,
    current_task: number,
    createdAt: Date,
    updatedAt: Date,
}

const ProjectsList = (props : RouteParams) : JSX.Element => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [mode, setMode] = useState<MODES>(MODES.READ);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastType, setToastType] = useState<ToastType>(ToastType.error);
    const [projects, setProjects] = useState<Project[]>([]);
    const [showSkeleton, setShowSkeleton] = useState<boolean | undefined>(undefined);
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [presentAlert] = useIonAlert();

    const { match } = props;

    const readProjects = async (): Promise<void> => {
        try {
            setProjects([]);
            setShowSkeleton(undefined);
            const store = new Storage();
            await store.create();
            const projectsCache = await store.get(`admin-${match.params.adminId}-projects`);
            if (projectsCache === null || projectsCache.length === 0){
                const query = new Parse.Query('Project');
                query.equalTo('admin', parseInt(match.params.adminId));
                setShowSkeleton(true);
                const results = await query.find();
                const newProjects: Project[] = results.map((project) => {
                    return {
                        id: project.id,
                        name: project.get('name'),
                        current_task: project.get('current_task'),
                        createdAt: project.createdAt,
                        updatedAt: project.updatedAt,
                    }
                });
                await store.set(`admin-${match.params.adminId}-projects`, newProjects)
                setProjects(newProjects);
                setShowSkeleton(false);
            } else {
                setProjects(projectsCache)
            }
        } catch (e: any) {
            setShowSkeleton(false);
            let message = e.message;
            if (e.code === 100){
                message = `Unable to connect to the server`
            }
            setToastType(ToastType.error);
            setToastMessage(message);
            setShowToast(true);
        }
    }

    const reFetchProjects = async (): Promise<void> => {
        const query = new Parse.Query('Project');
        query.equalTo('admin', parseInt(match.params.adminId));
        const store = new Storage();
        await store.create();
        const results = await query.find();
        const newProjects: Project[] = results.map((project) => {
            return {
                id: project.id,
                name: project.get('name'),
                current_task: project.get('current_task'),
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
            }
        });
        await store.set(`admin-${match.params.adminId}-projects`, newProjects);
        setProjects(newProjects);
    }

    useIonViewDidEnter(()=>{
        (async ()=> {
            await readProjects();
        })()
    })

    const handleItemClick = (id: string) => {
        return (e: React.MouseEvent): void => {
            const newSet = new Set<string>([...selectedIds])
            let newArray = Array.from(newSet);
            if (newArray.includes(id)){
                newArray = newArray.filter((number) => number !== id);
            }else {
                newArray = [...newArray, id];
            }
            setSelectedIds(newArray);
        }
    }

    const handleClick = (id: string) => {
        return (e: React.MouseEvent<HTMLIonItemElement, MouseEvent>): void =>{
            e.preventDefault();
            props.history.push(`/${match.params.adminId}/project/${id}/detail`);
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
            return data.filter((project) => project.name.toLowerCase().includes(searchValue.toLowerCase()));
        }
        return data
    }

    const handleFabClick = () => {
        setModalOpen(true);
    }

    const getTaskName = (id: number) => {
        if (id === -1){
            return 'Finished'
        }
        return tasks.find((task) => task.id === id)?.name;
    }

    const handleDelete = async () => {
        try {
            setLoadingMessage(`Deleting ${selectedIds.length === 1 ? 'project' : 'projects'}`)
            setShowLoading(true);
            const store = new Storage();
            await store.create();
            for (const id of selectedIds){
                let Project: Parse.Object = new Parse.Object('Project');
                Project.set('objectId', id);
                await Project.destroy();
                await store.remove(`project-${id}`);
                setSelectedIds((prev) => prev.filter((selectedId)=> selectedId !== id));
            }
            await store.remove(`admin-${match.params.adminId}-projects`);
            await reFetchProjects();
            setShowLoading(false);
        }catch (e: any) {
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

    useIonViewWillLeave(()=>{
        setModalOpen(false);
    })

    return (
        <IonPage className={`custom-project-list`}>
            <IonHeader>
                <IonToolbar className={`custom-toolbar`}>
                    <IonButtons slot={`start`}>
                        <IonBackButton defaultHref={`/`}/>
                    </IonButtons>

                    <IonButtons slot={`end`}>
                        {
                            mode === MODES.READ &&
                            <IonButton onClick={()=> setMode(MODES.SELECT)}>
                                <FontAwesomeIcon icon={faListCheck} size={`xl`}/>
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
                <Box display={`flex`} alignItems={`center`}>
                    <IonSearchbar className={`custom-search`} animated={true} value={searchValue} onIonChange={handleSearch} placeholder={`Search Project`}></IonSearchbar>
                </Box>

                <IonList className={`custom-list`}>
                    <IonListHeader>
                        <h1>Projects</h1>
                    </IonListHeader>
                    <MySkeleton showSkeleton={showSkeleton}/>
                    {
                        projects.length === 0 && showSkeleton === false &&
                        <Box display={`flex`} flexDirection={`column`} alignItems={`center`} justifyContent={`center`} gap={2} padding={1} color={`rgba(0,0,0,0.3)`}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} size={`5x`}/>
                            <Typography>
                                No projects found
                            </Typography>
                        </Box>
                    }
                    {
                        filterSearch(projects).map((project, index): JSX.Element=>{
                            return(
                                <IonItem className={`custom-item`} lines={filterSearch(projects).length === index + 1 ? 'none' : `inset`} key={project.id}
                                         onClick={mode === MODES.SELECT ? handleItemClick(project.id) : handleClick(project.id)}
                                         button detail={mode === MODES.READ}>
                                    {
                                        mode === MODES.SELECT &&
                                        <IonCheckbox className={`custom-checkbox`} checked={selectedIds.includes(project.id)} slot={`start`}></IonCheckbox>
                                    }
                                    <IonIcon slot={`start`} icon={document} size={`large`} className={`custom-icon`}/>
                                    <IonLabel>
                                        <Box display={`flex`} component={`h2`} alignItems={`center`} gap={1}>
                                            <FontAwesomeIcon icon={faFileSignature}/>
                                            <span>
                                                {project.name}
                                            </span>
                                        </Box>
                                        <Box display={`flex`} component={`p`} alignItems={`center`} gap={1}>
                                            <FontAwesomeIcon icon={faCalendarDays}/>
                                            <Box component={`span`} textTransform={`capitalize`}>
                                                { `${project.createdAt.toLocaleDateString(`de-DE`, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}` }
                                            </Box>
                                        </Box>
                                        <Box display={`flex`} component={`p`} alignItems={`center`} gap={1}>
                                            <FontAwesomeIcon icon={faClipboardQuestion}/>
                                            <Box component={`span`} textTransform={`capitalize`}>
                                                { `${getTaskName(project.current_task)}` }
                                            </Box>
                                        </Box>
                                    </IonLabel>
                                </IonItem>
                            )
                        })
                    }
                </IonList>
                <IonFab vertical="bottom" horizontal="end" slot="fixed" className={`custom-button`}>
                    <IonFabButton onClick={handleFabClick}>
                        <IonIcon size={`large`} icon={add} />
                    </IonFabButton>
                </IonFab>
                <AddProject isOpen={modalOpen} setIsOpen={setModalOpen} {...{setToastType, setShowToast, setToastMessage}}
                            reFetchProjects={reFetchProjects} {...props}/>
                <MyToast showToast={showToast} setShowToast={setShowToast} message={toastMessage} cssClass={toastType}/>
                <MyLoading showLoading={showLoading} setShowLoading={setShowLoading} message={loadingMessage}/>
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
                                        header: `Are you sure you want to delete ${selectedIds.length} ${selectedIds.length === 1 ? 'project' : 'projects'}?`,
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
                                                handler: handleDelete,
                                            },
                                        ]
                                    })
                                }}>
                                    <IonIcon size={`large`} icon={trash}/>
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