import {Route, useHistory} from 'react-router-dom';
import {
    IonApp,
    IonRouterOutlet,
    setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import ProjectsList from "./pages/ProjectsList";
import ProjectDetail from "./pages/ProjectDetail";
import React, {useContext, useEffect, useState} from "react";
import Setup from "./pages/Setup";
import AddProject from "./pages/AddProject";
import {Capacitor} from "@capacitor/core";
import {PushNotifications} from "@capacitor/push-notifications";
import MyToast from "./components/MyToast";
import { getMessaging, getToken, onMessage, } from "firebase/messaging";
import {getFunctions, httpsCallable} from "firebase/functions";
import {getAuth} from "firebase/auth";
import {Auth} from "./context/Auth";
import {collection, getDocs, getFirestore, query, where} from "firebase/firestore";

setupIonicReact();

//1d1d1b
//b22b48

enum ToastType {
    error = `error`,
    success = `success`,
}

interface Token {
    token: string,
    date: number,
}

const App = (): JSX.Element => {

    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastType, setToastType] = useState<ToastType>(ToastType.error);
    const token = useContext(Auth)?.token;
    const setOpen = useContext(Auth)?.setOpen;
    const setToken = useContext(Auth)?.setToken;
    const history = useHistory();

    useEffect(()=>{
        (async ()=>{
            if (token !== undefined && token !== null){
                if (Capacitor.isPluginAvailable('PushNotifications')){
                    await PushNotifications.addListener('registration', async (messagingToken) => {
                        const functions = getFunctions();
                        const setToken = httpsCallable(functions, 'setToken');
                        await setToken({
                            platform: Capacitor.getPlatform(),
                            token: messagingToken,
                            date: new Date(),
                            uid: token,
                        })
                    });

                    await PushNotifications.addListener('registrationError', err => {
                        setToastType(ToastType.error);
                        setToastMessage(err.error);
                        setShowToast(true);
                    });

                    await PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
                        const notification = action.notification;
                        const adminId = notification.data.adminId as string;
                        const projectId = notification.data.projectId as string;
                        history.push(`/${adminId}/project/${projectId}/detail`);
                    })

                    await PushNotifications.addListener('pushNotificationReceived',   (notification) => {
                    });
                }
            }
        })()
    }, [token])

    useEffect(()=>{
        (async ()=>{
            if (token !== undefined && token !== null){
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
                    Notification.requestPermission().then((permission) => {
                        if (permission === 'granted') {
                            const messaging = getMessaging();
                            getToken(messaging, { vapidKey: 'BAFv2yeCCeuhFakQIyNuF6GfVtV7Cq-r1P1dd_Kw0cEJrCOK6YHUJk1mj7txi86ANCWrTJEa-VWcuTO-LNZmUM4' })
                                .then(async (messagingToken) => {
                                const functions = getFunctions();
                                const setToken = httpsCallable(functions, 'setToken');
                                await setToken({
                                    platform: Capacitor.getPlatform(),
                                    token: messagingToken,
                                    date: new Date(),
                                    uid: token,
                                })
                                const messaging = getMessaging();
                            }).catch((err) => {
                                setToastType(ToastType.error);
                                setToastMessage(err);
                                setShowToast(true);
                            });
                        } else {
                            setToastType(ToastType.error);
                            setToastMessage('Permission is not granted for push notifications');
                            setShowToast(true);
                        }
                    });
                }
            }
        })()
    }, [token])

    useEffect(()=>{
        const auth = getAuth();
        auth.onAuthStateChanged((user)=>{
            if (user !== null){
                if (setToken) {
                    setToken(user.uid);
                    if (setOpen){
                        setOpen(false)
                    }
                }
            } else {
                if (setOpen){
                    setOpen(true);
                }
            }
        })
    }, [])

    return(
        <IonApp>
            <IonReactRouter>
                <IonRouterOutlet animated={true}>
                    <Route exact path={`/`} component={Setup}/>
                    <Route exact path={`/:adminId/project/list`} component={ProjectsList}/>
                    <Route exact path={`/project/add`} component={AddProject}/>
                    <Route exact path={`/:adminId/project/:projectId/detail`} component={ProjectDetail}/>
                </IonRouterOutlet>
            </IonReactRouter>
            <MyToast showToast={showToast} setShowToast={setShowToast} message={toastMessage} cssClass={toastType}/>
        </IonApp>
    )
}

export default App;
