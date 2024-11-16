import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classes from './TopHeader.module.css';
import SearchBar from '../SearchBar/SearchBar';
import logo from '../../assets/logo.png';
import companyimage from '../../assets/companyname.png';
import cart from '../../assets/cart.png';
import sell from '../../assets/sell.png';
import profile from '../../assets/user.png';
import Cookies from "js-cookie";

import { AuthContext } from "../../store/auth-context";
import { useContext } from "react";
import { useProfileContext } from "../../store/ProfileContext";

const TopHeader = () => {

    const { login, loginChangeHandler, signupModelOpen, loginModelOpen, logoutShowModelOpen  } = useContext(AuthContext);
    const {_id, name, image, email, phoneNumber, address, handleProfileChange } = useProfileContext();
    const logoutHandler = () => {
        Cookies.remove('token');
        loginChangeHandler(false);
    }
    const [isOpen, setIsOpen] = useState(false);
    const openDropdown = () => {
        setIsOpen(true);
    }
    const closeDropdown = () => {
        setIsOpen(false);
    }

    useEffect(()=>{
        const fetchProfile = async () => {
            const value = Cookies.get('token');
            let token = '';
            if(value) {
                token = JSON.parse(value).value;
            }
            const response = await fetch('http://localhost:8080/buyer/profile', {
                method: 'GET', 
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const data = await response.json();
            if(response.ok){
                handleProfileChange(data.user._id, data.user.fullname, data.user.image, data.user.email, data.user.phonenumber, data.user.address);
            }else{
                if(response.status === 402){
                    loginChangeHandler(false);
                    logoutShowModelOpen();
                }else{
                    console.log(data.error);
                }
            }
        };
        if(login) fetchProfile();
    },[]);

    let afterLogin = <div className={classes.header3}>
        <Link to='/sell'>
            <div className={`${classes.headerbuttons} ${classes.sell}`}>
            <div className={classes.buttontext}><p>Sell</p></div>
        </div></Link>
        <Link to='/cart'>
        <div className={classes.headerbuttons}>
            <div className={classes.buttonicon}><i class="bi bi-cart3"></i></div>
            <div className={classes.buttontext}><p>Cart</p></div>
        </div></Link>
        <div className={classes.headerbuttons} onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
            <div className={classes.buttonicon}><img src={profile} alt="profile"/></div>
            <div className={classes.buttontext}><p>{name}</p></div>
            {isOpen && <ul className={classes.dropdown}>
                <Link to='/profile'><li>Your Account</li></Link>
                <Link to='/orders'><li>Your Orders</li></Link>
                <Link to='/sold'><li>Your Products</li></Link>
                <Link to='/cart'><li>Your Cart</li></Link>
                <Link><li onClick={logoutHandler}>Logout</li></Link>
            </ul>}
        </div>
    </div>

    const beforeLogin = <div className={classes.altheader3}>
        <button className={classes.signup} onClick={signupModelOpen}>Sign up</button>
        <button className={classes.signin} onClick={loginModelOpen} >Sign in</button>
    </div>
    return (
        <div className={classes.header}>
            <Link to='/'><div className={classes.header1}>
                <div className={classes.companyimage}><img src={logo} alt="company name"/></div>
                <div className={classes.companyname}>aquavista</div>
            </div></Link>
                <SearchBar />
            {login && afterLogin}
            {!login && beforeLogin}
        </div>
    )
};

export default TopHeader;
