import React, { useEffect, useState }from 'react'
import classes from './Profile.module.css';
import logo from '../../assets/logo.png';
import { AuthContext } from '../../store/auth-context';
import { useContext } from 'react';
import Cookies from 'js-cookie';


const Profile = () => {
    const [prevfullName, setPrevFullName] = useState('');
    const [prevemail, setPrevEmail] = useState('');
    const [prevmobileNumber, setPrevMobileNumber] = useState('');
    const [prevaddress, setPrevAddress] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [address, setAddress] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [image, setImage] = useState(null);

    const { loginChangeHandler, logoutShowModelOpen } = useContext(AuthContext);

    // fetching the profile 
    useEffect(() => {
        console.log("inside");
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
                console.log(data.message);
                setPrevFullName(data.user.fullname);
                setPrevEmail(data.user.email);
                setPrevMobileNumber(data.user.phonenumber);
                setPrevAddress(data.user.address);

                setFullName(prevfullName);
                setEmail(prevemail);
                setMobileNumber(prevmobileNumber);
                setAddress(prevaddress);
                // if(data.user.image) setImage(data.user.image);
            }else{
                if(response.status === 402){
                    loginChangeHandler(false);
                    logoutShowModelOpen();
                }else{
                    console.log(data.error);
                }
            }
        };

        fetchProfile();
    },[]);

    const handleImageChange = (event) => {
        // Get the selected file
        const selectedImage = event.target.files[0];
        
        // Set the selected image in state
        setImage(selectedImage);

        // Submit the form
        event.target.form.submit();
    };
    const handleEdit = () => {
        setEditMode(true);
    }
    const handleCancel = () => {
        setEditMode(false);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        // Update previous values with current values after successful submission
        setPrevFullName(fullName);
        setPrevEmail(email);
        setPrevMobileNumber(mobileNumber);
        setPrevAddress(address);
        setEditMode(false);
    }
  return (
    <div className={classes.profilecomponent}>
      <div className={classes.profilecontainer}>
        <div className={classes.first}>
            <form action="">
                <div className={classes.icon}><i className="bi bi-pencil-square"></i></div>
                <div className={classes.image}><label for="userimage"><img src={logo}></img></label></div>
                <input type="file" id="userimage" name="userimage" onChange={handleImageChange} ></input>
            </form>
            <h1><span>Hello,</span> {prevfullName}</h1>
        </div>
        <div className={classes.second}>
            <form action="" className={classes.form} onSubmit={handleSubmit}>
                <div className={classes.field}>
                    <div><label>Full Name</label></div>
                    <div>
                        {editMode ? (
                            <input type="text" name="fullname" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        ) : (
                            <input type="text" name="fullname" value={prevfullName} readOnly />
                        )}
                    </div>
                </div>
                <div className={classes.field}>
                    <div><label>Email Address</label></div>
                    <div>
                        {editMode ? (
                            <input type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        ) : (
                            <input type="text" name="email" value={prevemail} readOnly />
                        )}
                    </div>
                </div>
                <div className={classes.field}>
                    <div><label>Mobile Number</label></div>
                    <div>
                        {editMode ? (
                            <input type="text" name="mobilenumber" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                        ) : (
                            <input type="text" name="mobilenumber" value={prevmobileNumber} readOnly />
                        )}
                    </div>
                </div>
                <div className={classes.field}>
                    <div><label>Address</label></div>
                    <div>
                        {editMode ? (
                            <input type="text" name="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                        ) : (
                            <input type="text" name="address" value={prevaddress} readOnly />
                        )}
                    </div>
                </div>
                {editMode ? 
                <>
                    <div className={classes.btn}>
                        <button type="submit">Save</button>
                    </div>
                    <span onClick={handleCancel}>Cancel</span>
                </> : 
                <span onClick={handleEdit}>Edit</span>
                }
            </form>  
        </div>
        {/* <div className={classes.third}>
            <form action="" className={classes.form}>
                <div className={classes.field}>
                    <div><label>Address</label><button type="submit">Edit</button></div>
                    <div><input type="text" name="address"/></div>
                </div>
            </form>
        </div> */}
      </div>
    </div>
  )
}

export default Profile
