import React, { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

export const useProfileContext = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [_id, setid] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const handleProfileChange = (_id, name, image, email, phoneNumber, address) => {
    setid(_id);
    setName(name);
    setImage(image);
    setEmail(email);
    setPhoneNumber(phoneNumber);
    setAddress(address);
  }
  

  return (
    <ProfileContext.Provider value={{_id, name, image, email, phoneNumber, address, handleProfileChange }}>
      {children}
    </ProfileContext.Provider>
  );
}