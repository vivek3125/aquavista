import { useState } from 'react';
import { createContext } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = createContext({
    login: false,
    loginChangeHandler : () => {},
    loginMode : false,
    signupMode : false, 
    loginModelOpen: () => {},
    loginModelClose : () => {},
    signupModelOpen : () => {},
    signupModelClose : () => {},
    logoutShowMode: false,
    logoutShowModelOpen : () => {},
    logoutShowModelClose : () => {},
});

export default function AuthContextProvider(props) {
    const [login, setLogin] = useState(Cookies.get('token') ? true : false);
    console.log(login);
    const loginChangeHandler = (value) => {
        setLogin(prevState => value);
    }
    const [loginMode, setLoginMode] = useState(false);
    const [signupMode, setSignupMode] = useState(false);
    const loginModelOpen = () => {
        setLoginMode(true);
    }
    const loginModelClose = () => {
        setLoginMode(false);
    }
    const signupModelOpen = () => {
        setSignupMode(true);
    }
    const signupModelClose = () => {
        setSignupMode(false);
    }
    const [logoutShowMode, setLogoutShowMode] = useState(false);
    const logoutShowModelOpen = () => {
        setLogoutShowMode(true);
    }
    const logoutShowModelClose = () => {
        setLogoutShowMode(false);
    }

    const ctxValue = {
        login : login,
        loginChangeHandler : loginChangeHandler,
        loginMode: loginMode,
        signupMode: signupMode,
        loginModelOpen: loginModelOpen,
        loginModelClose: loginModelClose,
        signupModelOpen: signupModelOpen,
        signupModelClose: signupModelClose,
        logoutShowMode: logoutShowMode, 
        logoutShowModelOpen: logoutShowModelOpen,
        logoutShowModelClose: logoutShowModelClose,
    };

    return <AuthContext.Provider value={ctxValue}>
        {props.children}
    </AuthContext.Provider>
};