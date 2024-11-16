import React, {useState, useEffect} from "react";
import classes from './Home.module.css';
import Courosel from '../Courosel/Courosel';
import Card from "../Card/Card";
import CardCombo from "../Card/CardCombo";
import SlidingCard from "../Card/SlidingCard";
import Courosel2 from "../Courosel/Courosel2";
import Cookies from "js-cookie";
import { CATEGORY } from "../../utility";

const Home = () => {
   const [maxDiscount, setMaxDiscount] = useState([]);
   const [priceUnder1, setPriceUnder1] = useState([]);
   const [discountUpto, setDiscountUpto] = useState([]);
   const [priceUnder2, setPriceUnder2] = useState([]);
   const [newAdded, setNewAdded] = useState([]);
   const [recentExplored, setRecentExplored] = useState([]);
   const [categoryProducts, setCategoryProducts] = useState([{category: '', products: ''}]);

    const utilityToken = () => {
        const value = Cookies.get('token');
        let token = '';
        if (value) {
            token = JSON.parse(value).value;
        }
        return token;
    }

    const getMaxDiscountProducts = async () => {
        try{
            const response = await fetch(`http://localhost:8080/product/maxdiscount`,{
                method: 'GET',
            });
            const data = await response.json();
            if(response.ok){
                const data1 = data.products.map((product)=>({
                    _id: product._id.toString(),
                    title: product.title,
                    image: product.image1,
                    sellerId: product.sellerId,
                }))
                while (data1.length < 4) {
                    data1.push({_id: '', title:'', image: '', sellerId: ''});
                }
                setMaxDiscount(data1);
            } 
            else{
                console.log(data.error);
            }
        } catch(err) {
            console.log(err);
        }
    }
    const getPriceUnderProducts1 = async(price) => {
        try{
            const response = await fetch(`http://localhost:8080/product/price/${price}`,{
                method: 'GET',
            });
            const data = await response.json();
            if(response.ok){
                const data1 = data.products.map((product)=>({
                    _id: product._id.toString(),
                    title: product.title,
                    image: product.image1,
                    sellerId: product.sellerId,
                }))
                while (data1.length < 4) {
                    data1.push({_id: '', title:'', image: '', sellerId: ''});
                }
                setPriceUnder1(data1);
            } 
            else{
                console.log(data.error);
            }
        } catch(err) {
            console.log(err);
        }
    }
    const getDiscountUptoProducts = async(discount) => {
        try{
            const response = await fetch(`http://localhost:8080/product/discount/${discount}`,{
                method: 'GET',
            });
            const data = await response.json();
            if(response.ok){
                const data1 = data.products.map((product)=>({
                    _id: product._id.toString(),
                    title: product.title,
                    image: product.image1,
                    sellerId: product.sellerId,
                }))
                while (data1.length < 4) {
                    data1.push({_id: '', title:'', image: '', sellerId: ''});
                }
                setDiscountUpto(data1);
            } 
            else{
                console.log(data.error);
            }
        } catch(err) {
            console.log(err);
        }
    }
    const getPriceUnderProducts2 = async(price) => {
        try{
            const response = await fetch(`http://localhost:8080/product/price/${price}`,{
                method: 'GET',
            });
            const data = await response.json();
            if(response.ok){
                const data1 = data.products.map((product)=>({
                    _id: product._id.toString(),
                    title: product.title,
                    image: product.image1,
                    sellerId: product.sellerId,
                }))
                while (data1.length < 4) {
                    data1.push({_id: '', title:'', image: '', sellerId: ''});
                }
                setPriceUnder2(data1);
            } 
            else{
                console.log(data.error);
            }
        } catch(err) {
            console.log(err);
        }
    }
    const getNewProducts = async() => {
        try{
            const response = await fetch(`http://localhost:8080/product/newrelease`,{
                method: 'GET',
            });
            const data = await response.json();
            if(response.ok){
                const data1 = data.products.map((product)=>({
                    _id: product._id.toString(),
                    title: product.title,
                    author: product.author,
                    price: product.price,
                    mrp: product.mrp,
                    discount: product.discount,
                    image: product.image1,
                    sellerId: product.sellerId,
                    postedDate: product.updatedAt,
                }))
                setNewAdded(data1);
            } 
            else{
                console.log(data.error);
            }
        } catch(err) {
            console.log(err);
        }
    }
    const getRecentExplored = async() => {
        try{
            const token = utilityToken();
            const response = await fetch(`http://localhost:8080/buyer/recentexplored`,{
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const data = await response.json();
            if(response.ok){
                const data1 = data.products.map((p)=>({
                    _id: p.product._id.toString(),
                    title: p.product.title,
                    author: p.product.author,
                    price: p.product.price,
                    mrp: p.product.mrp,
                    discount: p.product.discount,
                    image: p.product.image1,
                    sellerId: p.product.sellerId,
                }))
                setRecentExplored(data1);
            } 
            else{
                console.log(data.error);
            }
        } catch(err) {
            console.log(err);
        }
    }
    const getRandomCategory = (categories) => {
        const randomIndex = Math.floor(Math.random() * categories.length);
        return categories[randomIndex];
    }
    const getSpecificCategoryProduct = async(category) => {
        try{
            const response = await fetch(`http://localhost:8080/product/getCategory/${category}`,{
                method: 'GET',
            });
            const data = await response.json();
            if(response.ok){
                const data1 = data.products.map((product)=>({
                    _id: product._id.toString(),
                    title: product.title,
                    image: product.image1,
                    sellerId: product.sellerId,
                }))
                while (data1.length < 4) {
                    data1.push({_id: '', title:'', image: '', sellerId: ''});
                }
                // console.log(data);
                return {category: category, products: data1};
            } 
            else{
                console.log(data.error);
                return null;
            }
        } catch(err) {
            console.log(err);
        }
    }
    const getExploredCategoriesProducts = async(categories) => {
        const promises = categories.map((category) => getSpecificCategoryProduct(category));
        try {
            const data = await Promise.all(promises);
            const filteredData = data.filter((item) => item !== null);
            // console.log(filteredData);
            setCategoryProducts(filteredData);
            // console.log(categoryProducts);
            // console.log(data);
            // setCategoryProducts(data);
        } catch (error) {
            console.error('Error fetching category products:', error);
        }
    };

    const getMostExploredCategory = async() => {
        try{
            const token = utilityToken();
            const response = await fetch(`http://localhost:8080/buyer/exploredcategories`,{
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const data = await response.json();
            if(response.ok){
                // console.log(data.categories);
                const data1 = data.categories.map((c)=>(
                    c.category
                ));
                while(data1.length < 4){
                    const randomCategory = getRandomCategory(CATEGORY);
                    // Set to keep track of unique categories already in data1
                    const uniqueCategories = new Set(data1);
                    if (!uniqueCategories.has(randomCategory)) {
                        data1.push(randomCategory); // Add the random category to data1
                        uniqueCategories.add(randomCategory); // Add it to the set of unique categories
                    }
                }
                // console.log(data1);
                getExploredCategoriesProducts(data1);
            } 
            else{
                console.log(data.error);
            }
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(()=>{
        getMaxDiscountProducts();
        getPriceUnderProducts1(500);
        getDiscountUptoProducts(20);
        getPriceUnderProducts2(500);
        getNewProducts();
        if(utilityToken()) getRecentExplored();
        if(utilityToken()) getMostExploredCategory();
    },[]);

    return (
        <div className={classes.home}>
            <div className={classes.coursoselcontainer}>
                <Courosel/>
            </div>
            <div className={classes.homecontent}>
                {/* <Card  />      */}
                
                {/* <SlidingCard/> */}
                {/* <Courosel2/> */}
                {/* {products.length == 0 && <p>No Product</p>} */}
                {/* {products.length !== 0 && <>
                    {products.map(product => {
                    return <Card key={product._id} id={product._id} title={product['title']} author={product['author']} mrp={product['mrp']} price={product['price']} image={product['image1']} />
                    // <Card  title={products[1]['title']} mrp={products[1]['mrp']} price={products[1]['price']}/>
                    })}
                    </>    
                } */}

            </div>
            <div className={classes.combocontainer}>
                {maxDiscount.length === 4 && 
                    <CardCombo heading={"Grab incredible discount on must have items today"} products={maxDiscount}/>
                }
                {priceUnder1.length === 4 && 
                    <CardCombo heading={"Under Rs 500 | Unlock a world of reading pleasures"} products={priceUnder1}/>
                }
                {discountUpto.length === 4 && 
                    <CardCombo heading={"Save big! Up to 20% off on bestsellers"} products={discountUpto}/>
                }
                {priceUnder2.length === 4 && 
                    <CardCombo heading={"Under Rs 500 | Unleash your imagination"} products={priceUnder2}/>
                }
            </div>
            {
                recentExplored.length > 0 &&
                <div className={classes.slidercontainer}>
                    <SlidingCard heading={"Pick up where you left off"} products={recentExplored}/>
                </div> 
            }
            {
                newAdded.length > 0 &&
                <div className={classes.slidercontainer}>
                    <SlidingCard heading={"Discover your next library gem among our latest additions"} products={newAdded} isNewAdded={true}/>
                </div> 
            }
            <div className={classes.courosel}>
                <Courosel2/>
            </div>
             {categoryProducts && (
                <div className={classes.combocontainer}>
                    {categoryProducts.map((category)=>(
                        category && category.products && (
                            <CardCombo key={category.category} heading={`Discover Tailored ${category.category} Tales: Your Story Awaits!`} products={category.products}/>
                        )                   
                    ))}
                </div>
            )}

        </div>
    )
};

export default Home;
