import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import { Redirector } from '~components';

const User = () => {
    const router = useRouter();
    const { query: { profileId } } = router;

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        let source = axios.CancelToken.source();
        axios.get(`/api/users/${profileId}`, {
            cancelToken: source.token
        }).then((response) => {

            setUserData(response?.data?.data);
        }).catch((err) => {
          console.log({ err })
        });
        
        return () => { source.cancel("Cancelling in cleanup") };
    }, []);

    const { 
      email,
      firstName,
      lastName,
      phone,
      address1,
      address2,
      city,
      state,
      zip,
      positions,
      profilePic1,
      profilePic2,
      resume
     } = userData || {};
    const profilePic1Url = `https://drive.google.com/uc?id=${profilePic1}`;
    const profilePic2Url = `https://drive.google.com/uc?id=${profilePic2}`;
    
    return (!!email &&
      <Redirector>
        <Head>
          <title>Profile Page: {profileId}</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <div>
          {profilePic1 && <img src={profilePic1Url}width={120}/>}
          {profilePic2 && <img src={profilePic2Url}width={120}/>}
        </div>
        <h1>{profileId}</h1>
        <h3>{firstName + ' ' + lastName}</h3>
  
        <div>phone: {phone}</div>
        <div>email: {email}</div>
        <div>positions: {positions}</div>
        <div>
          <p>Address:</p>
          {address1 && <div>{address1}</div>}
          {address2 && <div>{address2}</div>}
          {(city || state || zip) && <div>{`${city}, ${state} ${zip}`}</div>}
        </div>
        {resume && <h3><a href={`https://drive.google.com/uc?id=${resume}`} target="_blank" rel="noreferrer">resume</a></h3>}
      </Redirector>
    );
}

export default User;