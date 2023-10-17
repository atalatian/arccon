import {IonToast} from "@ionic/react";
import {alertCircle} from "ionicons/icons";
import React from "react";
import {RouteComponentProps} from "react-router";

interface Props extends RouteComponentProps{
    showToast: boolean,
    setShowToast: (show: boolean) => void,
    message: string,
    projectId: string,
    adminId: number,
}

const OnMessageToast = (props: Props) => {
    const { message, showToast, setShowToast, projectId, adminId, history } = props;

    return(
        <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message={`${message}`}
            cssClass={`on-message-toast`}
            position={`top`}
            icon={alertCircle}
            buttons={[
                {
                    text: 'Dismiss',
                    role: 'cancel',
                    handler: () => { setShowToast(false) }
                },
                {
                    text: 'Go',
                    role: 'confirm',
                    handler: ()=> { history.push(`/${adminId}/project/list`); setShowToast(false) }
                }
            ]}
        />
    );
}

export default OnMessageToast;