import React, { useEffect } from "react";
import classes from './Root.module.css';
import { Outlet } from "react-router-dom";
import TopHeader from "../components/TopHeader/TopHeader";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import Login from "../components/Login/Login";
import Signup from "../components/signup/Signup";
import { AuthContext } from "../store/auth-context";
import { useContext } from "react";
import ShowLogout from "./ShowLogout";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Root = () => {
    const { loginMode, signupMode, logoutShowMode, loginChangeHandler, logoutShowModelOpen } = useContext(AuthContext);

    const navigate = useNavigate();
    useEffect(()=>{
        const value = Cookies.get('token');
        let handlelogouttimer ;
        if(value) {
            const expiryTime = parseInt(JSON.parse(value).expiryTime);
            const currentTime = parseInt(new Date().getTime());
            console.log(expiryTime-currentTime);
            handlelogouttimer = setTimeout(() => {
                loginChangeHandler(false);
                logoutShowModelOpen();
            }, (expiryTime - currentTime));
        }else{
            clearTimeout(handlelogouttimer);
            // navigate('/');
        }

    },[])

    const containerStyle = (loginMode || signupMode || logoutShowMode) ? { opacity:0.2 } : {};
    return (
        <div className={classes.maincontainer}>
            {!loginMode && !signupMode && <>  
                <div style={containerStyle}>
                    <TopHeader />
                    <NavBar />
                    <Outlet />
                    <Footer />
                </div>
            </>
            } 
            {logoutShowMode && <ShowLogout />}
            {loginMode && <Login />}
            {signupMode && <Signup />}
            
        </div>
    )
}

export default Root;