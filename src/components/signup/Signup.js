import React, { useState } from "react";
import classes from './Signup.module.css';
import logo from '../../assets/logo.png';
import { AuthContext } from "../../store/auth-context";
import { useContext } from "react";
import Cookies from "js-cookie";

const Signup = () => {

    const { loginChangeHandler, signupModelClose, loginModelOpen } = useContext(AuthContext);

    const [userid, setUserId] = useState("");
    const [fullname, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorType, setErrorType] = useState("");
    const [showMessage, setShowMessage] = useState(false);

    // disable mode

    const idChangeHandler = (event) => {
        setUserId(event.target.value);
    }
    const fullnameChangeHandler = (event) => {
        setFullName(event.target.value);
    }
    const passwordChangeHandler = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("handle submit", {
            userid: userid,
            password: password,
            fullname: fullname,
        });
        const response = await fetch('http://localhost:8080/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ userid, fullname, password }),
            headers: { 'Content-Type': 'application/json' },
        });
        console.log(response);
        const data = await response.json();
        if (response.ok) {
            // setting the login to true and closing the signup model
            alert(data.message);
            const currentTime = new Date();
            const expiryTime = new Date(currentTime.getTime() + 60 * 60 * 1000);
            Cookies.set('token', JSON.stringify({ value: data.token, expiryTime: expiryTime.getTime() }), { expires: expiryTime });
            signupModelClose();
            loginChangeHandler(true);
        }
        else {
            if (response.status === 400) {
                // alert(data.message);
                setErrorType("Wrong Credientials");
                setErrorMessage(data.message);
                setShowMessage(true);
                setUserId(data.prevValues.userid);
                setFullName(data.prevValues.fullname);
                setPassword(data.prevValues.password);
            }
            else if (response.status === 500) {
                setErrorType("Server error");
                setErrorMessage(data.message);
                setShowMessage(true);
            }
        }
    }

    // function of signup with third party
    const signupWithGoogle = async () => {
        console.log("Inside signup with google");
        const authWindow = window.open('http://localhost:8080/auth/google/callback', '_self');
    }

    // HANDLING OTP
    const [disable, setDisable] = useState(true);     // when otp is perfectly verified 
    const [otpInput, setotpInput] = useState(false);  // to show when send OTP button is click 
    const [OTPValue, setOTPValue] = useState("");     // otp input field 
    const [resendDisable, setResendDisable] = useState(true);   // when 120 seconds completes, then it set to false
    const [verifyDisable, setVerifyDisable] = useState(true);   // when otp length is 6, then it set to false 
    const [otp, setOTP] = useState("");

    const otpHandleChange = (event) => {
        setOTPValue(event.target.value);
        if (event.target.value.length === 6) {
            setVerifyDisable(false);
        } else {
            setVerifyDisable(true);
        }
    }

    const sendOTPToID = async () => {
        setotpInput(true);
        // send otp
        try {
            const response = await fetch('http://localhost:8080/auth/otp', {
                method: 'POST',
                body: JSON.stringify({ userid: userid }),
                headers: {
                    'Content-Type' : 'application/json',
                }
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data.otp);
                setOTP(data.otp);
            } else {
                if (response.status === 400) {
                    setErrorType("Something went wrong !!");
                    setErrorMessage("OTP doesnot send !!");
                    setShowMessage(true);
                    resendDisable(false);
                }
                else if (response.status === 500) {
                    setErrorType("Something went wrong !!");
                    setErrorMessage("Server Error !!");
                    setShowMessage(true);
                    resendDisable(false);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    const verifyOTP = () => {
        const enteredOTP = OTPValue;
        const generatedOTP = otp;
        if(enteredOTP === generatedOTP){
            setDisable(false);
            setErrorType("User id is Correct !!");
            setErrorMessage("OTP verified Successfully");
            setShowMessage(true);
            setotpInput(false);
        }else{
            setErrorType("Whoops, something went wrong !!");
            setErrorMessage("OTP doesnot matched !!");
            setShowMessage(true);
        }
    }

    return (
        <div className={classes.signupcomponent}>
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
            <div className={classes.signupcontainer}>
                <div className={classes.name}><img src={logo} alt="not found"></img><span className={classes.companyname}>aquavista</span></div>
                <div className={classes.signupoptions}><button onClick={signupWithGoogle}><i className="bi bi-google"></i><span>Login with google</span></button></div>
                <hr />
                <form method="POST" onSubmit={handleSubmit} className={classes.form}>
                    <div className={classes.field}>
                        <div><input type="text" name="userid" className={classes.inp} placeholder="Mobile Number or email" onChange={idChangeHandler} /></div>
                    </div>
                    <div className={classes.otpbtn}>
                        <p className={classes.sendOTP} onClick={sendOTPToID}>Send OTP</p>
                        <p className={`${classes.resendOTP} ${resendDisable ? classes.resendDisable : ''}`} disabled={resendDisable}>Resend OTP</p>
                    </div>
                    {
                        otpInput && <div className={classes.field}>
                            <div className={classes.otpinputField}><input type="text" name="otp" className={classes.otpinp} placeholder="Enter OTP" onChange={otpHandleChange} />
                                <p className={`${classes.verifyOTP} ${verifyDisable ? classes.verifyDisable : ''}`} disabled={verifyDisable} onClick={verifyOTP}>Verify</p>

                            </div>
                        </div>
                    }
                    <div className={classes.field}>
                        <div><input type="text" name="fullname" className={classes.inp} placeholder="Full Name" onChange={fullnameChangeHandler} disabled={disable} /></div>
                    </div>
                    <div className={classes.field}>
                        <div><input type="password" name="password" className={classes.inp} placeholder="Password" onChange={passwordChangeHandler} disabled={disable} /></div>
                    </div>
                    <div className={classes.btn}>
                        <button type="submit" className={`${classes.loginbutton} ${disable ? classes.disable : ''}`} disabled={disable}>Sign up</button>
                    </div>
                </form>
                <p>Already have an account ?<span onClick={() => { signupModelClose(); loginModelOpen() }}>Log in</span></p>
                <button onClick={signupModelClose}><i className="bi bi-x"></i></button>

            </div>
        </div>

    )
};

export default Signup;
