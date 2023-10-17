import {IonAlert, IonIcon} from "@ionic/react";
import {useState} from "react";
import {IconButton} from "@mui/material";
import {informationCircle} from "ionicons/icons";
import * as React from "react";
import {Task} from "../data";

interface Props {
    step: Task,
}

const StepDescriptionAlert = (props: Props) => {

    const { step } = props;

    const [showAlert, setShowAlert] = useState<boolean>(false);

    return(
        <React.Fragment key={step.id}>
            <IconButton size={`large`} onClick={()=> setShowAlert(true)}>
                <IonIcon icon={informationCircle}/>
            </IconButton>
            <IonAlert
                isOpen={showAlert}
                cssClass={`custom-alert`}
                onDidDismiss={() => setShowAlert(false)}
                header="Description"
                message={`${step.name}`}
                buttons={['OK']}
            />
        </React.Fragment>
    );
}

export default StepDescriptionAlert;