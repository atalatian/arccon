import {
    IonAlert,
    IonBackButton,
    IonBadge,
    IonButton,
    IonButtons, IonCheckbox,
    IonContent, IonFab, IonFabButton, IonFooter,
    IonHeader, IonIcon, IonImg,
    IonItem,
    IonLabel,
    IonList, IonListHeader,
    IonPage, IonSearchbar, IonSpinner, IonText,
    IonTitle,
    IonToolbar, SearchbarCustomEvent,
    useIonAlert, useIonViewDidEnter, useIonViewWillLeave
} from "@ionic/react";
import {add, trash, document, exit} from 'ionicons/icons';
import React, {useContext, useEffect, useState} from "react";
import AddProject from "../components/AddProject";
import "./ProjectList.css";
import {RouteComponentProps} from "react-router";
import LogoNoText from '../images/arccon-logo-no-text.png';
import {Box} from "@mui/material";
import MyToast from "../components/MyToast";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarDays, faClipboardQuestion,
    faFileSignature,
    faListCheck,
    faMagnifyingGlass, faWarning
} from "@fortawesome/free-solid-svg-icons";
import {admins as adminsData, admins, bosses, tasks} from "../data";
import MySkeleton from "../components/MySkeleton";
import Typography from "@mui/material/Typography";
import {collection, query, where, getDocs, deleteDoc, doc, onSnapshot, getFirestore} from "firebase/firestore";
import {Auth} from "../context/Auth";
import firebase from "firebase/compat";
import {getAuth, signOut} from "firebase/auth";
import {Data} from "../context/Data";
import {UserData} from "../context/Hooks/useGetUserByUID";


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
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const db = getFirestore();
    const token = useContext(Auth)?.token;
    const [showSignAlert, setShowSignAlert] = useState(false);
    const setOpen = useContext(Auth)?.setOpen;
    const setToken = useContext(Auth)?.setToken;
    const user = useContext(Data)?.userData as UserData;
    const isBoss = user.data?.role === "boss";

    const { match } = props;

    useEffect(()=>{
        const newProjectsTest = [
            {
                id: "0",
                name: "test",
                current_task: 2,
                createdAt: new Date("2022-03-25"),
                updatedAt: new Date("2022-03-25"),
            }
        ]

        setProjects(newProjectsTest);

        if (token !== undefined && token !== null){
            const q = query(collection(db, "Projects"), where("admin", "==",  match.params.adminId));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const newProjects: Project[] = [];
                querySnapshot.forEach((project) => {
                    newProjects.push({
                        id: project.id,
                        name: project.get('name'),
                        current_task: project.get('currentTask'),
                        createdAt: project.get('createdAt').toDate(),
                        updatedAt: project.get('updatedAt').toDate(),
                    })
                });
                setProjects(newProjects);
            });
        }
    }, [token])

    const readProjects = async (): Promise<void> => {
        try {
            const q = query(collection(db, "Projects"), where("admin", "==",  match.params.adminId));
            setShowSkeleton(true);
            const newProjectsTest = [
                {
                    id: "0",
                    name: "test",
                    current_task: 2,
                    createdAt: new Date("2022-03-25"),
                    updatedAt: new Date("2022-03-25"),
                }
            ]

            setProjects(newProjectsTest);
            // const querySnapshot = await getDocs(q);
            // const newProjects: Project[] = [];
            // querySnapshot.forEach((project) => {
            //     newProjects.push({
            //         id: project.id,
            //         name: project.get('name'),
            //         current_task: project.get('currentTask'),
            //         createdAt: project.get('createdAt').toDate(),
            //         updatedAt: project.get('updatedAt').toDate(),
            //     })
            // });

            setShowSkeleton(false);
        } catch (e: any) {
            setShowSkeleton(false);
            let message = e.message;
            setToastType(ToastType.error);
            setToastMessage(message);
            setShowToast(true);
        }
    }

    useIonViewDidEnter(()=>{
        (async ()=> {
            if (token !== undefined && token !== null){
                await readProjects();
            } else {
                setShowSkeleton(false);
            }
        })()
    }, [token])

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
            setShowAlert(false);
            for (const id of selectedIds){
                setSelectedIds((prev) => prev.filter((selectedId)=> selectedId !== id));
            }
            for (const id of selectedIds){
                await deleteDoc(doc(db, 'Projects', id))
            }
        }catch (e: any) {
            let message = e.message;
            setToastType(ToastType.error);
            setToastMessage(message);
            setShowToast(true);
        }
    }

    useIonViewWillLeave(()=>{
        setModalOpen(false);
    })

    const showUpdateAlert = (updated: Date) => {
        const offset = new Date(Date.now() - 3600000);
        const updatedNumber = new Date(updated);
        if (updatedNumber <= offset){
            return (
                <Box display={`flex`} component={`p`} alignItems={`center`} gap={1} sx={{ fontSize: `small` }}>
                    <FontAwesomeIcon icon={faWarning} color={`#FAA613`}/>
                    <Box component={`span`} sx={{ color: `#FAA613` }}>
                        Hasn't been updated in a week
                    </Box>
                </Box>
            );
        }

        return null;
    }

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
        setToastMessage(user.error.message);
        setShowToast(user.error.show)
    }, [user])

    return (
        <IonPage className={`custom-project-list`}>
            <IonHeader>
                <IonToolbar className={`custom-toolbar`}>
                    <IonButtons slot={`start`}>
                        <IonBackButton defaultHref={`/`}/>
                    </IonButtons>

                    <IonButtons slot={`end`}>
                        {
                            mode === MODES.READ && (isBoss || user.data?.id === match.params.adminId) || true &&
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
                                        {showUpdateAlert(project.updatedAt)}
                                    </IonLabel>
                                </IonItem>
                            )
                        })
                    }
                    {
                        showSkeleton && projects.length === 0 && <MySkeleton/>
                    }
                </IonList>
                {
                    (isBoss || user.data?.id === match.params.adminId) || true &&
                    <IonFab vertical="bottom" horizontal="end" slot="fixed" className={`custom-button`}>
                        <IonFabButton onClick={handleFabClick}>
                            <IonIcon size={`large`} icon={add} />
                        </IonFabButton>
                    </IonFab>
                }
                <AddProject isOpen={modalOpen} setIsOpen={setModalOpen} {...{setToastType, setShowToast, setToastMessage}} {...props}/>
                <MyToast showToast={showToast} setShowToast={setShowToast} message={toastMessage} cssClass={toastType}/>
                <Box sx={{ height: `76px` }}></Box>
            </IonContent>
            <IonFooter>
                <IonToolbar className={`custom-toolbar-footer`}>
                    {
                        mode === MODES.SELECT &&
                        <IonButtons slot={`end`} className={`custom-delete-button`}>
                            <IonBadge color={`danger`}>
                                {selectedIds.length}
                            </IonBadge>
                            <>
                                <IonAlert
                                    isOpen={showAlert}
                                    cssClass={`custom-alert`}
                                    onDidDismiss={() => setShowAlert(false)}
                                    header="Alert"
                                    message={`Are you sure you want to delete ${selectedIds.length} ${selectedIds.length === 1 ? 'project' : 'projects'}?`}
                                    buttons={[{ text: `Cancel`, role: `cancel` },
                                        { text: `Delete`, role: `confirm`, cssClass: `delete-alert`, handler: handleDelete }]}
                                />
                                <IonButton className={`ion-margin-start`} color={`danger`} onClick={()=> setShowAlert(true)}>
                                    <IonIcon size={`large`} icon={trash}/>
                                </IonButton>
                            </>
                        </IonButtons>
                    }
                    {
                        mode === MODES.SELECT &&
                        <IonButtons slot={`start`} className={`custom-delete-button`}>
                            <IonButton color={`danger`} onClick={handleCancel}>
                                Cancel
                            </IonButton>
                        </IonButtons>
                    }

                    {   mode !== MODES.SELECT &&
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
                    }
                    {
                        mode !== MODES.SELECT &&
                        <IonTitle slot={`start`}>
                            <IonText style={{ color: `#ffffff` }}>
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
                    }
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
}

export default ProjectsList;