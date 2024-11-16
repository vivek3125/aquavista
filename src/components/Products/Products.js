import React, { useState, useEffect } from 'react'
import classes from './Products.module.css';
import HorizontalCard from '../Card/HorizontalCard';
import Cookies from 'js-cookie';
import { AuthContext } from '../../store/auth-context';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { getPostedTime } from '../../utility';
import SideCard from '../Card/SideCard';
import { useNavigate } from 'react-router-dom';

const Products = () => {
    const { loginChangeHandler, logoutShowModelOpen } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [sellRecord, setSellRecord] = useState({
        totalItems: 0,
        totalSold: 0,
        totalAvailable: 0,
        percentageSold: 0,
        totalRevenue: 0,
        totalEarning: 0, 
    });
    useEffect(() => {
        const getProducts = async () => {
            const value = Cookies.get('token');
            let token = '';
            if (value) {
                token = JSON.parse(value).value;
            }
            const response = await fetch('http://localhost:8080/seller/products', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const data = await response.json();
            if (response.ok) {
                const productData = data.products.map((p) => p._doc);
                setProducts(productData);
            } else {
                if (response.status === 402) {
                    loginChangeHandler(false);
                    logoutShowModelOpen();
                } else {
                    console.log(data.error);
                }
            }
        }
        getProducts();
    }, []);

    useEffect(() => {
        // Reset sellRecord to initial values
        setSellRecord({ totalItems: 0, totalSold: 0, totalAvailable: 0, percentageSold: 0, totalRevenue: 0, totalEarning: 0, });
        if (products) {
            let totalItems = 0;
            let totalSold = 0;
            let totalRevenue = 0;
            let totalEarning = 0;

            products.forEach(data => {
                totalItems++;
                totalSold += (data.sold === 1 ? 1 : 0);
                totalRevenue += data.price;
                totalEarning += (data.sold === 1 ? data.price : 0);
            });
            let totalAvailable = totalItems - totalSold;
            let percentageSold = (totalSold/totalItems)*100;
            setSellRecord(prevState => ({
                ...prevState,
                totalItems,
                totalSold,
                totalAvailable,
                percentageSold,
                totalRevenue,
                totalEarning,
            }));
        }
    }, [products]);
    const deleteListedProduct = async (id) => {
        try {
            const value = Cookies.get('token');
            let token = '';
            if (value) {
                token = JSON.parse(value).value;
            }
            const response = await fetch(`http://localhost:8080/seller/product/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const data = await response.json();
            if (response.ok) {
                console.log("Product deleted !");
                const updatedsoldproducts = products.filter(product => product._id !== data.product._id);
                setProducts(updatedsoldproducts);
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
    
    return (
        <div className={classes.yourproducts}>
            {products.length === 0 ? <p className={classes.loading}>Loading !!</p>:
                <>
                    <div className={classes.products}>
                        {products && products.map((data) => (
                            <HorizontalCard key={data._id}>
                                <div className={classes.horizontalcard}>
                                <div className={classes.content}>
                                    <div className={classes.image}>
                                        <img src={`http://localhost:8080/${data.sellerId}/${data.title}/${data.image1}`}></img>
                                    </div>
                                    <div className={classes.details}>
                                        <div className={classes.title}>{data.title} - by {data.author}</div>
                                        <div className={classes.category}>Category: {data.category}</div>
                                        <div className={classes.language}>Language: {data.language}</div>
                                    </div>
                                    <div className={classes.amount}>
                                        <div className={classes.mrp}>MRP: &#8377;{data.mrp}</div>
                                        <div className={classes.price}>Price: &#8377;{data.price}</div>
                                    </div>
                                    {
                                        
                                        <div className={classes.seller}>
                                            <div className={classes.name}><i class="bi bi-circle-fill"></i>About Seller</div>
                                            <div className={classes.contact}><i class="bi bi-envelope"></i>{data.email}</div>
                                            <div className={classes.contact}><i class="bi bi-telephone"></i>{data.phonenumber}</div>
                                            <div className={classes.address}><i class="bi bi-geo-alt"></i>{data.address}</div>
                                            <div className={classes.posteddate}><i class="bi bi-calendar"></i>{getPostedTime(data.createdAt.toString())}</div>
                                        </div>
                                    }
                                </div>
                                {
                                    data.sold === 0 &&
                                    <div className={classes.btn}>
                                        <button onClick={() => {navigate(`/sold/edit?_id=${data._id}&edit=true`);}}>EDIT</button>
                                        <button onClick={() => deleteListedProduct(data._id)}>REMOVE</button>
                                    </div>
                                }
                                </div>
                            </ HorizontalCard>
                        ))
                        }
                    </div>
                    <div className={classes.sidecard}>
                        <SideCard isYourProducts={true} sellRecord={sellRecord}/>
                    </div>
                </>
            }
        </div>
    )
}

export default Products;
