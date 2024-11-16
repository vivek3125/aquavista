// import React, { useEffect, useState } from "react";
// import classes from './Display.module.css';
// import { useLocation } from 'react-router-dom';
// import Cookies from "js-cookie";
// import Card from "../Card/Card";

// // NOTE : USEEFFECT MANAGE FETCH CALLS FOR BOTH LOGIN AND WITHOUT LOGIN

// const utilityToken = () => {
//     const value = Cookies.get('token');
//     let token = '';
//     if (value) {
//         token = JSON.parse(value).value;
//     }
//     return token;
// }

// const Display = () => {
//     const location = useLocation();
//     const queryParams = new URLSearchParams(location.search);
//     const key = queryParams.get('key');
//     const value = queryParams.get('value');
//     const [content, setContent] = useState([]);

//     useEffect(() => {
//         const fetchContent = async (key, value) => {
//             if (key === 'CATEGORY') {
//                 try {
//                     const token = utilityToken();
//                     const response = await fetch(`http://localhost:8080/buyer/category/${value}`, {
//                         method: 'GET',
//                         headers: {
//                             'Authorization': `Bearer ${token}`,
//                         }
//                     });
//                     const data = await response.json();
//                     if (response.ok) {
//                         console.log(data.content);
//                         setContent(data.content);
//                     } else {
//                         console.log(data.err);
//                     }
//                 } catch (err) {
//                     console.log(err);
//                     console.log('Something went wrong in fetch call !');
//                 }
//             }
//         }

//         fetchContent(key, value);
//     }, [key, value]);

//     return (
//         <div className={classes.content}>
//             <div className={classes.display}>
//             {
//                 content && content.map(product => {
//                     return <div className={classes.singlecontent}><Card 
//                         _id={product.product._id}
//                         sellerId={product.product.sellerId}
//                         title={product.product.title}
//                         author={product.product.author}
//                         image={product.product.image1}
//                         mrp={product.product.mrp}
//                         price={product.product.price}
//                         discount={product.product.discount}
//                         sold={product.product.sold}
//                         cartState={product.cartState}
//                         address={product.product.address}
//                         postedDate={product.updatedAt}
//                     /></div>
//                 })
//             }
//             </div>
//             <div className={classes.showloading}>
//             {content.length === 0 && <p className={classes.loading}>Loading !!</p>}
//             </div>
//         </div>
//     )
// }

// export default Display;

import React, { useEffect, useState } from "react";
import classes from './Display.module.css';
import { useLocation } from 'react-router-dom';
import Cookies from "js-cookie";
import Card from "../Card/Card";
import Filter from "../Filter/Filter";

// NOTE : USEEFFECT MANAGE FETCH CALLS FOR BOTH LOGIN AND WITHOUT LOGIN

const utilityToken = () => {
    const value = Cookies.get('token');
    let token = '';
    if (value) {
        token = JSON.parse(value).value;
    }
    return token;
}

const Display = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const key = queryParams.get('key');
    const value = queryParams.get('value');
    const [content, setContent] = useState([]);
    const [filteredContent, setFilteredContent] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        const fetchContent = async (key, value) => {
            if (key === 'CATEGORY') {
                try {
                    // const token = utilityToken();
                    const response = await fetch(`http://localhost:8080/product/getCategory/${value}`, {
                        method: 'GET',
                        // headers: {
                        //     'Authorization': `Bearer ${token}`,
                        // }
                    });
                    const data = await response.json();
                    if (response.ok) {
                        const data1 = data.products.map((product)=>({
                            _id: product._id.toString(),
                            title: product.title,
                            author: product.author,
                            image: product.image1,
                            sellerId: product.sellerId,
                            mrp: product.mrp,
                            price: product.price,
                            discount: product.discount,
                            buyingPeriod: product.period,
                            language: product.language,
                            category: product.category,
                            sold: product.sold,
                            cartState: product.cartState,
                            address: product.address,
                            postedDate: product.updatedAt,
                        }))
                        setContent(data1);
                        setFilteredContent(data1);
                    } else {
                        console.log(data.err);
                    }
                } catch (err) {
                    console.log(err);
                    console.log('Something went wrong in fetch call !');
                }
            }
        }

        fetchContent(key, value);
    }, [key, value]);

    useEffect(() => {
        let data = content;
        data = data.filter(product => product.price <= filters.priceRange);
        data = data.filter(product => product.discount >= filters.discountRange);
        if(filters.buyingperiod){
            data = data.filter(product => product.buyingPeriod === filters.buyingperiod);
        }
        if(filters.languages && filters.languages.length > 0){
            data = data.filter(product => filters.languages.includes(product.language));
        }
        if(filters.categories && filters.categories.length > 0){
            data = data.filter(product => filters.categories.includes(product.category));
        }
        setFilteredContent(data);
        
    },[filters])
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        console.log(filters);
    }
    return (
        <div className={classes.display}>
                <div className={classes.filterBtn}><span onClick={()=>{setShowFilter(prev=>!prev)}}><i class="bi bi-toggles2"></i> Filters</span></div>
            <div className={classes.bottomcomponent}>
                <div className={`${classes.filter} ${showFilter ? classes.active:""}`}><Filter onFilterChange={handleFilterChange}/></div>
                <div className={`${classes.content} ${showFilter ? classes.inactive:""}`}>
                    {
                        filteredContent && filteredContent.map(product => {
                            return <div className={classes.item}><Card product={product}/></div>
                        })
                    }
                </div>
            </div>
            {/* <div className={classes.showloading}>
            {content.length === 0 && <p className={classes.loading}>Loading !!</p>}
            </div> */}
        </div>
    )
}

export default Display;