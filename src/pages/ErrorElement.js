import React from "react";
import TopHeader from "../components/TopHeader/TopHeader";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";

const ErrorElement = () => {
    let text = "An error occured !!";
    let message = "Something went wrong !!";
    const inlineStyles = {
        color: 'black',
        fontSize: '20px',
        textAlign: 'center',
        backgroundColor: 'grey',
        height: '100vh'    ,
        display: 'flex',
        justifyContent: 'center', /* Horizontally center */
        alignItems: 'center', /* Vertically center */
    }
    return (
        <>
            <TopHeader />
            <NavBar />
            <div style={inlineStyles}>
                {text}<br /><br />
                {message}
            </div>
            <Footer />
        </>
    )
};

export default ErrorElement;
