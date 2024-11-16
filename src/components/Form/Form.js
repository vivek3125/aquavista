import React, { useState, useEffect } from "react";
import classes from './Form.module.css';
import { CATEGORY } from "../NavBar/category";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from '../../store/auth-context';
import { useProfileContext } from '../../store/ProfileContext';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';




const Form = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const edit = queryParams.get('edit');
    const productId = queryParams.get('_id');
    const navigate = useNavigate();
    const { loginChangeHandler, logoutShowModelOpen } = useContext(AuthContext);
    const { _id } = useProfileContext();


    // Define the states 
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [publisher, setPublisher] = useState("");
    const [publicationyear, setPublicationYear] = useState("");
    const [edition, setEdition] = useState("");
    const [language, setLanguage] = useState("hindi");
    const [category, setCategory] = useState("Drama");
    const [pages, setPages] = useState("");
    const [period, setPeriod] = useState("0-1");
    const [mrp, setMRP] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [desc, setDesc] = useState("");
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);
    const [image1text, setImage1text] = useState();
    const [image2text, setImage2text] = useState();
    const [image3text, setImage3text] = useState();
    const [image4text, setImage4text] = useState();
    const [email, setEmail] = useState("");
    const [phonenumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [errorType, setErrorType] = useState("");
    const [showMessage, setShowMessage] = useState(false);


    useEffect(() => {
        const getEditProductDetails = async () => {
            const value = Cookies.get('token');
            let token = '';
            if (value) {
                token = JSON.parse(value).value;
            }
            const response = await fetch(`http://localhost:8080/seller/product/${productId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data.product);
                setTitle(prev => data.product.title);
                setAuthor(prev => data.product.author);
                setPublisher(prev => data.product.publisher);
                setPublicationYear(prev => data.product.publicationyear);
                setEdition(prev => data.product.edition);
                setLanguage(prev => data.product.language);
                setCategory(prev => data.product.category);
                setPages(prev => data.product.pages);
                setPeriod(prev => data.product.period);
                setMRP(prev => data.product.mrp);
                setPrice(prev => data.product.price);
                setQuantity(prev => data.product.quantity);
                setDesc(prev => data.product.desc);
                // set the image if required : display images rather filling it into input field
                setImage1text(prev => data.product.image1);
                setImage2text(prev => data.product.image2);
                setImage3text(prev => data.product.image3);
                setImage4text(prev => data.product.image4);
                setEmail(prev => data.product.email);
                setPhoneNumber(prev => data.product.phonenumber);
                setAddress(prev => data.product.address);

            } else {
                if (response.status === 402) {
                    loginChangeHandler(false);
                    logoutShowModelOpen();
                } else {
                    console.log(data.error);
                }
            }
        };
        if (edit == 'true') getEditProductDetails();
        else {
            setTitle(prev => "");
            setAuthor(prev => "");
            setPublisher(prev => "");
            setPublicationYear(prev => "");
            setEdition(prev => "");
            setLanguage(prev => "hindi");
            setCategory(prev => "Drama");
            setPages(prev => "");
            setPeriod(prev => "0-1");
            setMRP(prev => "");
            setPrice(prev => "");
            setQuantity(prev => "");
            setDesc(prev => "");
            setImage1(null);
            setImage2(null);
            setImage3(null);
            setImage4(null);
            setImage1text();
            setImage2text();
            setImage3text();
            setImage4text();
            setEmail(prev => "");
            setPhoneNumber(prev => "");
            setAddress(prev => "");
        }
    }, [edit])






    // Handler for title input change
    const titleChangeHandler = (event) => {
        setTitle(event.target.value);
    }
    // Handler for author input change
    const authorChangeHandler = (event) => {
        setAuthor(event.target.value);
    }
    // Handler for publisher input change
    const publisherChangeHandler = (event) => {
        setPublisher(event.target.value);
    }
    // Handler for publication year input change
    const publicationyearChangeHandler = (event) => {
        setPublicationYear(event.target.value);
    }
    // Handler for edition input change
    const editionChangeHandler = (event) => {
        setEdition(event.target.value);
    }
    // Handler for language select change
    const selectHandleChange = (event) => {
        setLanguage(event.target.value);
    }
    // Handler for category select change
    const categoryHandleChange = (event) => {
        setCategory(event.target.value);
    }
    // Handler for pages input change
    const pageChangeHandler = (event) => {
        setPages(event.target.value);
    }
    // Handler for buying period select change
    const periodHandleChange = (event) => {
        setPeriod(event.target.value);
    }
    // Handler for MRP input change
    const mrpChangeHandler = (event) => {
        setMRP(event.target.value);
    }
    // Handler for price input change
    const priceChangeHandler = (event) => {
        setPrice(event.target.value);
    }
    // Handler for quantity input change
    const quantityChangeHandler = (event) => {
        setQuantity(event.target.value);
    }
    // Handler for description input change
    const descChangeHandler = (event) => {
        setDesc(event.target.value);
    }
    // Handler for image file input change
    const image1ChangeHandler = (event) => {
        const image = event.target.files[0];
        setImage1(image);
    }
    const image2ChangeHandler = (event) => {
        const image = event.target.files[0];
        setImage2(image);
    }
    const image3ChangeHandler = (event) => {
        const image = event.target.files[0];
        setImage3(image);
    }
    const image4ChangeHandler = (event) => {
        const image = event.target.files[0];
        setImage4(image);
    }

    // Handler for email input change
    const emailChangeHandler = (event) => {
        setEmail(event.target.value);
    }
    // Handler for phone number input change
    const phonenumberChangeHandler = (event) => {
        setPhoneNumber(event.target.value);
    }
    // Handler for address input change
    const addressChangeHandler = (event) => {
        setAddress(event.target.value);
    }

    // Form submit handler
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Handle form submission, including image upload
        // console.log(image1['name']);
        const data = {
            title, author, publisher, publicationyear, edition, language, category, pages, period, mrp, price, quantity, desc, image1, image2, image3,
            image4, email, phonenumber, address
        };
        console.log(data);

        // to parse formdata we have to use multer 
        const formData = new FormData();
        formData.append("title", title);
        formData.append('author', author);
        formData.append('publisher', publisher);
        formData.append('publicationyear', publicationyear);
        formData.append('edition', edition);
        formData.append('language', language);
        formData.append('category', category);
        formData.append('pages', pages);
        formData.append('period', period);
        formData.append('mrp', mrp);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('desc', desc);
        formData.append("images", image1);
        formData.append('images', image2);
        formData.append("images", image3);
        formData.append("images", image4);
        formData.append('email', email);
        formData.append('phonenumber', phonenumber);
        formData.append('address', address);
        console.log(formData);
        try {
            const value = Cookies.get('token');
            let token = '';
            if (value) {
                token = JSON.parse(value).value;
            }
            const response = await fetch('http://localhost:8080/seller/product', {
                method: "POST",
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            console.log(response.status);
            if (response.ok) {
                console.log("Product saved !");
                if (edit == 'true') navigate('/sold')
                else navigate('/');
            } else {
                if (response.status === 402) {
                    loginChangeHandler(false);
                    logoutShowModelOpen();
                } else {
                    const data = await response.json();
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                    setErrorType(data.type);
                    setErrorMessage(data.error);
                    setShowMessage(true);
                    console.log("Product saving failed !");
                }
            }
        } catch (err) {
            console.log("inside catch block of fetch !", err);
        }
    }

    const handleEditProduct = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append('author', author);
        formData.append('publisher', publisher);
        formData.append('publicationyear', publicationyear);
        formData.append('edition', edition);
        formData.append('language', language);
        formData.append('category', category);
        formData.append('pages', pages);
        formData.append('period', period);
        formData.append('mrp', mrp);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('desc', desc);
        formData.append("images", image1);
        formData.append('images', image2);
        formData.append("images", image3);
        formData.append("images", image4);
        formData.append('email', email);
        formData.append('phonenumber', phonenumber);
        formData.append('address', address);

        try {
            const value = Cookies.get('token');
            let token = '';
            if (value) {
                token = JSON.parse(value).value;
            }
            const response = await fetch(`http://localhost:8080/seller/product/${productId}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            console.log(response.status);
            if (response.ok) {
                console.log("Product Edited !");
                navigate('/sold')
            } else {
                if (response.status === 402) {
                    loginChangeHandler(false);
                    logoutShowModelOpen();
                } else {
                    const data = await response.json();
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                    setErrorType(data.type);
                    setErrorMessage(data.error);
                    setShowMessage(true);
                    console.log("Product Editing failed !");
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    const getImageUrl = (image, imagetext) => {
        if (edit == 'true' && image === null) {
            // console.log(_id, title, imagetext);
            return `http://localhost:8080/${_id.toString()}/${title}/${imagetext}`;
        } else if (image !== null) {
            return URL.createObjectURL(image);
        }
    }

    return (
        <div className={classes.bookformComponent}>
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
            <div className={classes.bookformContainer}>
                <h1 className={classes.heading}>{edit == 'true' ? 'EDIT BOOK' : 'UPLOAD YOUR BOOK'}</h1>
                <form onSubmit={edit == 'true' ? handleEditProduct : handleSubmit} className={classes.form}>
                    <label className={classes.desc}>BOOK DETAILS</label>
                    {/* Input fields for book details */}
                    <div className={classes.field}>
                        <div><label>Title</label></div>
                        <div><input type="text" name="title" onChange={titleChangeHandler} value={title} /></div>
                    </div>
                    <div className={classes.field}>
                        <div><label>Author</label></div>
                        <div><input type="text" name="author" onChange={authorChangeHandler} value={author} /></div>
                    </div>
                    <div className={classes.field}>
                        <div><label>Publisher</label></div>
                        <div><input type="text" name="publisher" onChange={publisherChangeHandler} value={publisher} /></div>
                    </div>
                    <div className={classes.field}>
                        <div><label>Publication Year</label></div>
                        <div><input type="text" name="publicationyear" onChange={publicationyearChangeHandler} placeholder="YYYY" value={publicationyear} /></div>
                    </div>
                    <div className={classes.field}>
                        <div><label>Edition</label></div>
                        <div><input type="text" name="edition" onChange={editionChangeHandler} value={edition} /></div>
                    </div>
                    <div className={classes.field}>
                        <div><label>Language</label></div>
                        <div>
                            <select onChange={selectHandleChange} value={language}>
                                <option value="hindi">Hindi</option>
                                <option value="english">English</option>
                                <option value="chinese">Chinese</option>
                            </select>
                        </div>
                    </div>
                    <div className={classes.field}>
                        <div><label>Genre / Category</label></div>
                        <div>
                            <select onChange={categoryHandleChange} value={category}>
                                {CATEGORY.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>

                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={classes.field}>
                        <div><label>Pages</label></div>
                        <div><input type="text" name="pages" onChange={pageChangeHandler} value={pages} /></div>
                    </div>
                    <div className={classes.field}>
                        <div><label>Buying Period</label></div>
                        <div>
                            <select onChange={periodHandleChange} value={period}>
                                <option value="0-1">Between 0 - 1 years</option>
                                <option value="1-2">Between 1-2 years</option>
                                <option value="2-3">Between 2-3 years</option>
                                <option value="3">More than 3 years</option>
                            </select>
                        </div>
                    </div>
                    <div className={classes.field}>
                        <div><label>MRP</label></div>
                        <div><input type="text" name="mrp" onChange={mrpChangeHandler} value={mrp} /></div>
                    </div>
                    <div className={classes.field}>
                        <div><label>Price</label></div>
                        <div><input type="text" name="price" onChange={priceChangeHandler} value={price} /></div>
                    </div>
                    <div className={classes.field}>
                        <div><label>Quantity</label></div>
                        <div><input type="text" name="quantity" onChange={quantityChangeHandler} value={quantity} /></div>
                    </div>
                    <div className={classes.field}>
                        <div><label>Description</label></div>
                        <div><textarea type="textbox" name="description" rows={4} onChange={descChangeHandler} value={desc} /></div>
                    </div>

                    {/* Input fields for images */}
                    <div className={classes.field}>
                        <div><label>Upload Images</label></div>
                        <div className={classes.image}>
                            <div><input type="file" name="image1" id="image1" onChange={image1ChangeHandler} accept="image/*" /></div>
                            <label for="image1">{image1 || image1text ? <img src={getImageUrl(image1, image1text)} width={80} height={80} /> : <i class="bi bi-card-image"></i>}</label>
                            <div><input type="file" name="image2" id="image2" onChange={image2ChangeHandler} accept="image/*" /></div>
                            <label for="image2">{image2 || image2text ? <img src={getImageUrl(image2, image2text)} width={80} height={80} /> : <i class="bi bi-card-image"></i>}</label>
                            <div><input type="file" name="image3" id="image3" onChange={image3ChangeHandler} accept="image/*" /></div>
                            <label for="image3">{image3 || image3text ? <img src={getImageUrl(image3, image3text)} width={80} height={80} /> : <i class="bi bi-card-image"></i>}</label>
                            <div><input type="file" name="image4" id="image4" onChange={image4ChangeHandler} accept="image/*" /></div>
                            <label for="image4">{image4 || image4text ? <img src={getImageUrl(image4, image4text)} width={80} height={80} /> : <i class="bi bi-card-image"></i>}</label>
                        </div>
                    </div>

                    {/* Input fields for seller contacts */}
                    <label className={classes.desc}>SELLER CONTACTS</label>
                    <div className={classes.field}>
                        <div><label>Email</label></div>
                        <div><input type="email" name="email" onChange={emailChangeHandler} value={email} /></div>
                    </div>
                    <div className={classes.field}>
                        <div><label>Contact No.</label></div>
                        <div><input type="text" name="phonenumber" onChange={phonenumberChangeHandler} value={phonenumber} /></div>
                    </div>
                    <div className={classes.field}>
                        <div><label>Address</label></div>
                        <div><input type="text" name="address" onChange={addressChangeHandler} value={address} /></div>
                    </div>

                    {/* Submit button */}
                    {
                        edit == 'true' ?
                            <div className={classes.btn}>
                                <button type="submit">Edit Product</button>
                            </div>
                            :
                            <div className={classes.btn}>
                                <button type="submit">Submit</button>
                            </div>
                    }
                    {
                        edit == 'true' && <div className={classes.btn}>
                            <button onClick={() => navigate('/sold')}>Cancel</button>
                        </div>
                    }
                </form>
            </div>
        </div>
    )
};

export default Form;

