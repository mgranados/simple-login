import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Redirector } from '~components';

// TODO: remove unwanted fields from user data

const Users = () => {
    const [userData, setUserData] = useState([]);
    useEffect(() => {
        let source = axios.CancelToken.source();
        axios.get('/api/users', {
            cancelToken: source.token
        }).then((response) => {
            console.log(response)
            const users = response?.data?.data;
            setUserData(users);
        });
        
        return () => { source.cancel("Cancelling in cleanup") };
    }, []);

    const userProfiles = Array.isArray(userData) && userData.length > 0 ?
        userData.map(({ profileId, firstName, lastName, email, profilePic1 }, index) => (
            <div key={index}>
                <div><img width={120} src={profilePic1 ? `https://drive.google.com/uc?id=${profilePic1}` : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Placeholder_no_text.svg/1200px-Placeholder_no_text.svg.png'} /></div>
                <div>First Name: {firstName}</div>
                <div>Last Name: {lastName}</div>
                <div>Email: {email}</div>
                <div><Link href="/users/[profileId]" as={`/users/${profileId}`}>profilePage</Link></div>
                <div><Link href="/accounts/[accountId]" as={`/accounts/${profileId}`}>Account Page</Link></div>
            </div>
        ))
        :
        (<h1>Loading...</h1>);

    return (
        <Redirector>
            <div>
                User Profiles:
                {userProfiles}
            </div>
        </Redirector>
    );
}

export default Users;