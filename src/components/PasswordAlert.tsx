import {AlertInput, IonAlert, IonButton, IonContent} from "@ionic/react";
import {useState} from "react";

const PasswordAlert = () => {
    const [showAlert, setShowAlert] = useState(true);

    const confirmHandler = () => {
        setShowAlert(false)
    }

    return (
        <IonContent>
            <IonAlert
                isOpen={showAlert}
                id={"password-alert"}
                header="Password"
                buttons={[{
                    text: "Register",
                    role: "confirm",
                    handler: confirmHandler,
                }]}
                inputs={[
                    {
                        id: 'password-register-field',
                        type: 'password',
                        name: 'password',
                        placeholder: "Enter password",
                    }
                ]}
            />
        </IonContent>
    );
}

export default PasswordAlert;