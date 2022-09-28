import {Redirect, Route} from 'react-router-dom';
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
import Department from "./pages/Department";
import Admin from "./pages/Admin";
import ProjectsList from "./pages/ProjectsList";
import ProjectDetail from "./pages/ProjectDetail";
import React, {useContext} from "react";
import {DepAdContext} from "./context/DepAdContext";

setupIonicReact();

const App = (): JSX.Element => {
    const ctx = useContext(DepAdContext);

    return(
        <IonApp>
            <IonReactRouter>
                <IonRouterOutlet animated={true} mode={`ios`}>
                    <Route exact path="/settings/department" component={Department}/>
                    <Route exact path={`/settings/department/:id/admin`} render={(props)=>
                        ctx?.departmentId !== null ? <Admin {...props}/> : <Department {...props}/>
                    }/>

                    <Route exact path="/department/:depId/admin/:adId/project/list" render={(props)=>
                        ctx?.adminId !== null ? <ProjectsList {...props}/> : <Department {...props}/>
                    }/>

                    <Route exact path="/department/:depId/admin/:adId/project/detail/:id" render={(props)=>
                        ctx?.projectId !== null ? <ProjectDetail/> : <ProjectsList {...props}/>
                    }/>

                    <Route render={()=>
                        (ctx?.departmentId !== null && ctx?.adminId !== null)
                            ?
                            <Redirect push={true} to={`/department/${ctx?.departmentId}/admin/${ctx?.adminId}/project/list`}/>
                            :
                            <Redirect push={true} to={`/settings/department`} />
                    }/>
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    )
}

export default App;
