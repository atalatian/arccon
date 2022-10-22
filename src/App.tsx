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
import React from "react";
import Setup from "./pages/Setup";
import AddProject from "./pages/AddProject";

setupIonicReact();

//1d1d1b
//b22b48

const App = (): JSX.Element => {
    return(
        <IonApp>
            <IonReactRouter>
                <IonRouterOutlet animated={true}>
                    <Route exact path={`/`} component={Setup}/>
                    <Route exact path={`/project/list`} component={ProjectsList}/>
                    <Route exact path={`/project/add`} component={AddProject}/>
                    <Route exact path={`/project/detail`} component={ProjectDetail}/>
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    )
}

export default App;
