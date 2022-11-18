import React from 'react';
import {IonToast} from '@ionic/react';
import {checkmarkOutline, warning} from "ionicons/icons";
import './MyToast.css';

interface Props {
    showToast: boolean,
    setShowToast: (show: boolean) => void,
    message: string,
    cssClass: string,
}

const MyToast = (props: Props) => {
    const { message, showToast, setShowToast, cssClass } = props;

    return (
        <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message={`${message}`}
            cssClass={`myToast ${cssClass}`}
            icon={
                (cssClass === `error` && warning) || (cssClass === `success` && checkmarkOutline) || undefined
            }
            buttons={[
                {
                    text: 'Dismiss',
                    role: 'cancel',
                    handler: () => { setShowToast(false) }
                }
            ]}
            duration={3000}
        />
    );
}
export default MyToast;