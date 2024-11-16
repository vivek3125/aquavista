import React, { useState, useEffect } from "react";
import classes from './CardDetails.module.css';
import { json, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthContext } from '../../store/auth-context';
import { useContext } from 'react';
import { useProfileContext } from "../../store/ProfileContext";



const CardDetails = () => {
    const [currentImage, setCurrentImage] = useState(null);
    const { loginChangeHandler, logoutShowModelOpen } = useContext(AuthContext);
    const params = useParams();
    const productId = params.productId;
    const [product, setProduct] = useState(null);
    const [addOrRemove, setAddOrRemove] = useState(false);
    const {_id, name, image, email, phoneNumber, address, handleProfileChange } = useProfileContext();


    const utilityToken = () => {
        const value = Cookies.get('token');
        let token = '';
        if (value) {
            token = JSON.parse(value).value;
        }
        return token;
    }
    // fetch the product
    async function getSingleProduct(productId) {
        // console.log("inside fetch single product");   
        try{
            const response = await fetch(`http://localhost:8080/product/${productId}`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error('didnot get product !');
            }
            const data = await response.json();
            // console.log(data.product);
            setProduct(data.product);
        } catch(err){
            console.log(err);
        }
    }
    async function getSingleProductForUser(productId) {
        // console.log("inside fetch single product");   
        const token = utilityToken();
        const response = await fetch(`http://localhost:8080/buyer/product/${productId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        if (!response.ok) {
            throw new Error('didnot get product !');
        }
        const data = await response.json();
        // console.log(data.product);
        setProduct(data.product);
        setAddOrRemove(data.AddOrRemove);
    }
    
    useEffect(() => {
        if(utilityToken()) getSingleProductForUser(productId);
        else getSingleProduct(productId);
    }, [])

    

    const addToCart = async () => {
        try {
            const value = Cookies.get('token');
            let token = '';
            if (value) {
                token = JSON.parse(value).value;
            }
            const response = await fetch(`http://localhost:8080/buyer/cart/${productId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Added to Cart !');
                setAddOrRemove(true);
            } else {
                if (response.status === 402) {
                    loginChangeHandler(false);
                    logoutShowModelOpen();
                } else {
                    console.log(data.error);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    const removeFromCart = async () => {
        try {
            const value = Cookies.get('token');
            let token = '';
            if (value) {
                token = JSON.parse(value).value;
            }
            const response = await fetch(`http://localhost:8080/buyer/cart/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Deleted From Cart !');
                setAddOrRemove(false);
            } else {
                if (response.status === 402) {
                    loginChangeHandler(false);
                    logoutShowModelOpen();
                } else {
                    console.log(data.error);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    const [otp, setOTP] = useState("");
    const [showOTPInput, setShowOTPInput] = useState(false);
    const [disable, setDisable] = useState(true);
    const [message, setMessage] = useState("");
    const [OTPValue, setOTPValue] = useState("");

    const sendRequest = async () => {
        try {
            const value = Cookies.get('token');
            let token = '';
            if(value){
                token = JSON.parse(value).value;
            }
            const response = await fetch('http://localhost:8080/buyer/requestOrder', {
                method: 'POST',
                body: JSON.stringify({ sellerEmail: product.email, title : product.title, userEmail : email, userName : name }),
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Message send via mail !!');
            } else {
                if (response.status === 402) {
                    loginChangeHandler(false);
                    logoutShowModelOpen();
                } else {
                    console.log(data.error);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    const placeOrder = async () => {
        setShowOTPInput(true);
        try {
            const value = Cookies.get('token');
            let token = '';
            if(value){
                token = JSON.parse(value).value;
            }
            const response = await fetch('http://localhost:8080/buyer/sendOTP', {
                method: 'POST',
                body: JSON.stringify({ sellerEmail: product.email, title : product.title, userEmail : email, userName : name }),
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            const data = await response.json();
            if (response.ok) {
                console.log('OTP is send successfully !!');
                setOTP(data.otp);
            } else {
                if (response.status === 402) {
                    loginChangeHandler(false);
                    logoutShowModelOpen();
                } else {
                    console.log(data.error);
                }
            }
        }catch(err){
            console.log(err);
        }
    }

    const otpChangeHandler = (event) => {
        setOTPValue(event.target.value);
        if(event.target.value.length === 6){
            setDisable(false);
        }else{ 
            setDisable(true);
        }
    }

    const finallyConfirmOrder = async () => {
        // to finalyse the order
        // first check the otp
        // then call post api to update the seller and user details, along with sold information 
        try{
            const originalOTP = otp;
            const inputOTP = OTPValue;
            if(originalOTP === inputOTP){
                console.log('OTP is verified !');
                setMessage("OTP matched, Congratulations !! Order Placed ...");
                setShowOTPInput(false);
                const value = Cookies.get('token');
                let token = '';
                if(value){
                    token = JSON.parse(value).value;
                }
                const response = await fetch('http://localhost:8080/buyer/confirmOrder', {
                    method: 'POST',
                    body: JSON.stringify({ productId : product._id }),
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    console.log(data.message);
                    setProduct(data.product);
                } else {
                    if (response.status === 402) {
                        loginChangeHandler(false);
                        logoutShowModelOpen();
                    } else {
                        console.log(data.error);
                    }
                }
            }else{
                setMessage("OTP doesnot Match, do it again !!");
                setShowOTPInput(false);
            }
        }catch(err){
            console.log(err);
        }
    }


    return (
        <>
            {product !== null &&
                <div className={classes.carddetails}>
                    <div className={classes.product}>
                        <div className={classes.left}>
                            <div className={classes.singleimage}><img src={currentImage || `http://localhost:8080/${product.sellerId}/${product.title}/${product.image1}`} alt="image not found" /></div>
                            <div className={classes.list}>
                                <button className={classes.imagebutton} onClick={() => setCurrentImage(`http://localhost:8080/${product.sellerId}/${product.title}/${product.image1}`)}><img src={`http://localhost:8080/${product.sellerId}/${product.title}/${product.image1}`} alt="first image" /></button>
                                <button className={classes.imagebutton} onClick={() => setCurrentImage(`http://localhost:8080/${product.sellerId}/${product.title}/${product.image2}`)}><img src={`http://localhost:8080/${product.sellerId}/${product.title}/${product.image2}`} alt="second image" /></button>
                                <button className={classes.imagebutton} onClick={() => setCurrentImage(`http://localhost:8080/${product.sellerId}/${product.title}/${product.image3}`)}><img src={`http://localhost:8080/${product.sellerId}/${product.title}/${product.image3}`} alt="third image" /></button>
                                <button className={classes.imagebutton} onClick={() => setCurrentImage(`http://localhost:8080/${product.sellerId}/${product.title}/${product.image4}`)}><img src={`http://localhost:8080/${product.sellerId}/${product.title}/${product.image4}`} alt="fourth image" /></button>
                            </div>
                        </div>
                        <div className={classes.right}>
                            <p className={classes.productheading}>{product['title']}</p>
                            <p className={classes.productauthor}>by {product['author']}</p>
                            <p className={classes.rating}>4.0 </p>
                            <hr />
                            <p className={classes.price}><span>{product['discount'].toFixed(2) + ' %'}</span> &#8377; {product['price']}</p>
                            <p className={classes.MRP}>M.R.P.: &#8377; {product['mrp']}</p>
                            <hr />
                            <p className={classes.desc}>{product['desc']}</p>
                            <hr />
                            <p className={classes.productdetails}>Product Details</p>
                            <div className={classes.details}>
                                <div className={classes.detailsside}>
                                    <div className={classes.detailheading}>
                                        <p>Edition:</p>
                                        <p>Publisher:</p>
                                        <p>Publication Year:</p>
                                    </div>
                                    <div className={classes.detailvalue}>
                                        <p>{product['edition']}</p>
                                        <p>{product['publisher']}</p>
                                        <p>{product['publicationyear']}</p>
                                    </div>
                                    {/* <div className={classes.leftsingledetails}><p className={classes.leftdetailheading}>Edition</p><p className={classes.leftdetailvalue}>1st</p></div>                            
                                <div className={classes.leftsingledetails}><p className={classes.leftdetailheading}>Publisher</p><p className={classes.leftdetailvalue}>Abcd</p></div>
                                <div className={classes.leftsingledetails}><p className={classes.leftdetailheading}>Publication Year</p><p className={classes.leftdetailvalue}>Abcd</p></div> */}
                                </div>
                                <div className={classes.detailsside}>
                                    <div className={classes.detailheading}>
                                        <p>Category:</p>
                                        <p>Pages:</p>
                                        <p>Language:</p>
                                    </div>
                                    <div className={classes.detailvalue}>
                                        <p>{product['category']}</p>
                                        <p>{product['pages']}</p>
                                        <p>{product['language']}</p>
                                    </div>
                                    {/* <div className={classes.rightsingledetails}><p className={classes.rightdetailheading}>Category</p><p className={classes.rightdetailvalue}>Abcd</p></div>
                                <div className={classes.rightsingledetails}><p className={classes.rightdetailheading}>Pages</p><p className={classes.rightdetailvalue}>Abcd</p></div>
                                <div className={classes.rightsingledetails}><p className={classes.rightdetailheading}>Language</p><p className={classes.rightdetailvalue}>Abcd</p></div> */}
                                </div>
                            </div>
                            <hr />
                            {
                                product.sold === 0 ?
                                    <div className={classes.name}><i class="bi bi-circle-fill"></i>In Stock</div> :
                                    <div className={classes.name}><i class="bi bi-circle-fill"></i>Out of Stock</div>
                            }
                            <br />
                            {
                                addOrRemove === false ?
                                    <button className={classes.cartbutton} onClick={() => addToCart()}>Add to Cart</button>
                                    :
                                    <button className={classes.cartbutton} onClick={() => removeFromCart()}>Remove from Cart</button>
                            }
                            {
                                product.sold === 0 ? <>
                                    <button className={classes.cartbutton} onClick={() => placeOrder()}>Place Order</button>
                                    <button className={classes.cartbutton} onClick={() => sendRequest()}>Request Order</button>
                                    </>
                                : <></>
                            }
                            {
                                showOTPInput === true ? 
                                <>
                                    <div>
                                        <input type="text" name="otp" onChange={otpChangeHandler} className={classes.inp} />
                                        <button onClick={finallyConfirmOrder} className={`classes.cartbutton ${disable ? classes.disable : ''}`} disabled={disable}>Confirm Order</button>
                                        <button onClick={() => { setOTP(""); setShowOTPInput(false); }} className={classes.cartbutton}>Cancel Order</button>
                                    </div>
                                </> : <></>
                            }
                            {
                                message.length !== 0 ? 
                                <div className={classes.message}>
                                    <p className={classes.showmessage}>{message}</p>
                                    <button onClick={() => setMessage("")} className={classes.cancelbutton}><i className="bi bi-x"></i></button>
                                </div> : <></>
                            }
                        </div>
                    </div>
                </div>
            }
            {product === null && <p className={classes.loading}>Loading !!</p>}
        </>

    );
}

export default CardDetails;