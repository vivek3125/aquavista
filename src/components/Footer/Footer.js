import React from "react";
import classes from './Footer.module.css';
import companylogo from '../../assets/logo.png';
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div className={classes.footer}>
            <div className={classes.footername}>
                <Link to='#' onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}><img src={companylogo} alt="companyname"/>
                <p>aquavista</p></Link>
            </div>
            {/* <hr /> */}
            <div className={classes.footerdata}>
                <div className={classes.left}>
                    <h1 className={classes.data}>Get to know us</h1>
                    <Link><p className={classes.data}>About us</p></Link>
                </div>
                <div className={classes.right}>
                    <h1 className={classes.data}>Connect With Us</h1>
                    <Link><p className={classes.data}>Facebook</p></Link>
                    <Link><p className={classes.data}>Twitter</p></Link>
                    <Link><p className={classes.data}>Instagram</p></Link>
                </div>
            </div>
        </div>
    )
};

export default Footer;
