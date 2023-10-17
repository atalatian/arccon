import React, {SetStateAction, useState} from 'react';
import {
    IonButtons,
    IonButton,
    IonModal,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonPage,
    IonItem, IonInput, IonLabel, IonIcon
} from '@ionic/react';
import "./PasswordModal.css"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import MyToast from "./MyToast";
import {star, eye, eyeOff} from "ionicons/icons";
import MyLoading from "./MyLoading";

interface Props {
    setToken: React.Dispatch<SetStateAction<string | null>>,
    open: boolean,
    setOpen: React.Dispatch<SetStateAction<boolean>>,
    password: string,
    setPassword: React.Dispatch<SetStateAction<string>>,
    email: string,
    setEmail: React.Dispatch<SetStateAction<string>>,
}

enum ToastType {
    error = `error`,
    success = `success`,
}

function PasswordModal(props: Props) {

    const { setToken } = props;
    const { open, setOpen } = props;
    const { password, setPassword } = props;
    const { email, setEmail } = props;

    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<any>('');
    const [toastType, setToastType] = useState<ToastType>(ToastType.error);

    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');

    const [visible, setVisible] = useState(false);
    const [inputType, setInputType] = useState<"text" | "password">("password")

    const handleConfirm = async () => {
        try {
            setLoadingMessage("Logging in")
            setShowLoading(true);
            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            setToken(userCredential.user.uid);
            setOpen(false);
            setShowLoading(false);
        } catch (err) {
            setOpen(false);
            setShowLoading(false);
            setToastType(ToastType.error);
            setToastMessage(err);
            setShowToast(true);
        }
    }

    const handleVisibility = () => {
        setVisible((prev)=> !prev);
        setInputType((prev) => {
            if (prev === "password"){
                return "text";
            } else {
                return "password"
            }
        })
    }

    return (
        <>
            <IonModal isOpen={open} className={`custom-password-modal`} backdropDismiss={false}>
                <IonHeader>
                    <IonToolbar className={`custom-toolbar`}>
                        <IonTitle className={`custom-title`}>Authentication</IonTitle>
                        <IonButtons slot="end" className={`custom-button`}>
                            <IonButton onClick={handleConfirm} fill={`solid`}>
                                Confirm
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className={`custom-content`}>
                    <IonItem color={`transparent`} lines={`full`} className={`custom-item ion-padding-start`}>
                        <IonInput className={`custom-email-input`} type={`text`} value={email} slot={`start`} placeholder="Enter Email"
                                  onIonChange={e => {setEmail(e.detail.value!);}}
                                  clearInput></IonInput>
                    </IonItem>
                    <IonItem color={`transparent`} lines={`none`} className={`custom-item ion-padding-start`}>
                        <IonInput className={`custom-input`} type={inputType} value={password} slot={`start`} placeholder="Enter Password"
                                  onIonChange={e => {setPassword(e.detail.value!);}}
                                  clearInput></IonInput>
                        <IonButton slot={`end`} fill={`outline`} onClick={handleVisibility} className={`custom-button`}>
                            <IonIcon slot="icon-only" icon={(visible ? eye : eyeOff)}></IonIcon>
                        </IonButton>
                    </IonItem>
                </IonContent>
            </IonModal>
            <MyToast showToast={showToast} setShowToast={setShowToast} message={toastMessage} cssClass={toastType}/>
            <MyLoading showLoading={showLoading} setShowLoading={setShowLoading} message={loadingMessage}/>
        </>
    );
}

export default PasswordModal;