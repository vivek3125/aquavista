import React from "react";
import HorizontalCard from "../Card/HorizontalCard";
import classes from './Order.module.css';
import Cookies from 'js-cookie';
import { AuthContext } from '../../store/auth-context';
import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPostedTime } from '../../utility';


const Order = () => {
    const { loginChangeHandler, logoutShowModelOpen } = useContext(AuthContext);
    const [order, setOrder] = useState([]);

    useEffect(() => {
        const getOrderedProducts = async () => {
            const value = Cookies.get('token');
            let token = '';
            if (value) {
                token = JSON.parse(value).value;
            }
            const response = await fetch('http://localhost:8080/buyer/order', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data.order);
                setOrder(data.order);
            } else {
                if (response.status === 402) {
                    loginChangeHandler(false);
                    logoutShowModelOpen();
                } else {
                    console.log(data.error);
                }
            }
        };
        getOrderedProducts();
    }, [])

    return (
        <div className={classes.products}>
            {order.length !== 0 &&
                order.map((data) => (
                    <HorizontalCard key={data.product._id}>
                        <div className={classes.horizontalcard}>
                            <Link to={`/product/${data.product._id}`}>
                                <div className={classes.content}>
                                    <div className={classes.image}>
                                        <img src={`http://localhost:8080/${data.product.sellerId}/${data.product.title}/${data.product.image1}`}></img>
                                    </div>
                                    <div className={classes.details}>
                                        <div className={classes.title}>{data.product.title} - by {data.product.author}</div>
                                        <div className={classes.category}>Category: {data.product.category}</div>
                                        <div className={classes.language}>Language: {data.product.language}</div>
                                    </div>
                                    <div className={classes.amount}>
                                        <div className={classes.price}>Price: {data.product.price}</div>
                                        <div className={classes.mrp}>MRP: {data.product.mrp}</div>

                                    </div>


                                    <div className={classes.seller}>
                                        <div className={classes.name}><i class="bi bi-circle-fill"></i>About Seller</div>
                                        <div className={classes.contact}>{data.product.email} - {data.product.phonenumber}</div>
                                        <div className={classes.address}>{data.product.address}</div>
                                        <div className={classes.name}><i class="bi bi-circle-fill"></i>Buyed on : {getPostedTime(data.time)}</div>
                                    </div>

                                </div>
                            </Link>

                        </div>
                    </ HorizontalCard>
                ))
            }
            {order.length === 0 && <p className={classes.loading}>Loading !!</p>}
        </div>
    )
}

export default Order;