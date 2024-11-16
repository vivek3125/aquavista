import React from "react";
import classes from './Login.module.css';
import logo from '../../assets/logo.png';
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../store/auth-context";
import { useContext } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const { loginChangeHandler, loginModelClose, signupModelOpen } = useContext(AuthContext);
    const navigate = useNavigate();

    const [userid, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorType, setErrorType] = useState("");
    const [showMessage, setShowMessage] = useState(false);

    const idChangeHandler = (event) => {
        setUserId(event.target.value);
    } 
    const passwordChangeHandler = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("handle submit" , {
            userid: userid, 
            password: password, 
        });
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            body: JSON.stringify({userid, password}),
            headers: { 'Content-Type' : 'application/json'},
            credentials: 'include',
        });
        console.log(response);
        const data = await response.json();
        if(response.ok){
            alert(data.message);
            const currentTime = new Date();
            const expiryTime = new Date(currentTime.getTime() + 60 * 60 * 1000);
            Cookies.set('token', JSON.stringify({ value: data.token, expiryTime: expiryTime.getTime() }), { expires: expiryTime });
            loginModelClose();
            loginChangeHandler(true);
        }
        else{
            setErrorType("Wrong Credientials");
            setErrorMessage(data.message);
            setShowMessage(true);
            // const data = await response.json();
            if(response.status === 401){
                // alert(data.message);
                setErrorType("Wrong Credientials");
                setErrorMessage(data.message);
                setShowMessage(true);
                setUserId(val => data.prevValues.userid || val);
                setPassword(val => data.prevValues.password || val);
            }
            else if(response.status === 500){
                setErrorType("Server error");
                setErrorMessage(data.message);
                setShowMessage(true);
            }
        }
    }

    // function of signup with third party
    const loginWithGoogle = async () => {
        console.log("Inside signup with google");
        const authWindow = window.open('http://localhost:8080/auth/google/callback', '_self');
    }

    return (
        <div className={classes.logincomponent}>
            {
                showMessage && (
                <div className={classes.errorcontainer}>
                    <h1>{errorType}</h1>
                    <p>{errorMessage}</p>
                    <hr></hr>
                    <button onClick={() => setShowMessage(false)}>OK</button>
                </div>
                )
            }
        
        <div className={classes.logincontainer}>
            <div className={classes.name}>
                <img src={logo}></img><span className={classes.companyname}>aquavista</span>
            </div>
            <div className={classes.loginoptions}><button onClick={loginWithGoogle}><i className="bi bi-google"></i><span>Login with google</span></button></div>
            <div className={classes.partation}><div className={classes.side}></div><span>OR</span><div className={classes.side}></div></div>
            <form method="POST" onSubmit={handleSubmit} className={classes.form}>
                <div className={classes.field}>
                    <div><input type="text" name="userid" placeholder="Phone number or email" onChange={idChangeHandler}/></div>
                </div>
                <div className={classes.field}>
                    <div><input type="password" name="password" placeholder="Password" onChange={passwordChangeHandler}/></div>
                </div>
                <div className={classes.btn}>
                    <button type="submit" className={classes.loginbutton}>Log in</button>
                </div>
            </form>
            <p>Don't have an account ? <span onClick={() => {loginModelClose(); signupModelOpen()}}>Sign up</span></p>
            <button onClick={loginModelClose}><i className="bi bi-x"></i></button>
        </div>
        </div>

    )
};

export default Login;
