import React, {createContext, SetStateAction, useState} from "react";
import PasswordModal from "../components/PasswordModal";

interface AuthContextInterface {
    token: string | null,
    setOpen: React.Dispatch<SetStateAction<boolean>>,
    setToken: React.Dispatch<SetStateAction<string | null>>,
}

export const Auth = createContext<AuthContextInterface | null>(null);


interface Props{
    children: JSX.Element | JSX.Element[]
}

const AuthContextProvider = ({ children }: Props) => {

    const [token, setToken] = useState<string | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('enter');
    const [email, setEmail] = useState<string>('enter');

    const value: AuthContextInterface = {
        token,
        setOpen,
        setToken
    }

    return(
        <Auth.Provider value={value}>
            {children}
            <PasswordModal setToken={setToken} open={open} setOpen={setOpen} password={password} setPassword={setPassword} email={email} setEmail={setEmail}/>
        </Auth.Provider>
    )
}

export default AuthContextProvider;