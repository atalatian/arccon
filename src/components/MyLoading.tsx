import React from 'react';
import { IonLoading } from '@ionic/react';
import './MyLoading.css';

interface Props {
    showLoading: boolean,
    setShowLoading: (show: boolean) => void,
    message: string,
}

const MyLoading = (props: Props): JSX.Element => {
    const { showLoading, message } = props;

    return (
        <IonLoading
            cssClass='myLoading'
            isOpen={showLoading}
            message={message}
        />
    );
};

export default MyLoading;