import React from "react";
import classes from './ShowLogout.module.css';
import { AuthContext } from "../store/auth-context";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

const ShowLogout = () => {
    const { loginModelOpen, logoutShowModelClose } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleClick = () => { 
         logoutShowModelClose();
         navigate('/');
    }
    return (
        <div className={classes.logoutcontainer}>
            <h1>Your session has expired<i className="bi bi-x" onClick={()=>handleClick()}></i></h1>
            <p>Please log in again to continue using the app.</p>
            <div className={classes.btn}>
                <button className={classes.link} onClick={() => { loginModelOpen(); logoutShowModelClose(); }}>Login</button>
            </div>
        </div>            
    )   
};

export default ShowLogout;