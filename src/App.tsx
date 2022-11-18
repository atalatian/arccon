import {Route} from 'react-router-dom';
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
import React, {useEffect} from "react";
import Setup from "./pages/Setup";
import AddProject from "./pages/AddProject";
import { Storage } from '@ionic/storage';

import Parse from 'parse';

const PARSE_APPLICATION_ID = 'i9mX4w1w2M4UtLgVZzYaDU2Ll1HErPaIUreF6JMI';
const PARSE_HOST_URL = 'https://parseapi.back4app.com/';
const PARSE_JAVASCRIPT_KEY = 'kKQA1SEzzu6c8RnEkSeLh2PJHNOW3gKNEyF4M1wg';
Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
Parse.serverURL = PARSE_HOST_URL;

setupIonicReact();

//1d1d1b
//b22b48

const App = (): JSX.Element => {

    useEffect(()=>{
        (async ()=>{
            const store = new Storage();
            await store.create();
            await store.clear();
        })()
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
        </IonApp>
    )
}

export default App;
