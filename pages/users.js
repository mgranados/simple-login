import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

const Users = () => {
    const [userData, setUserData] = useState([]);
    console.log({userData})
    useEffect(() => {
        let source = axios.CancelToken.source();
        axios.get('api/users', {
            cancelToken: source.token
        }).then((response) => {
            const { data: users } = response?.data;
            setUserData(users);
        });
        
        return () => { console.log('users unmounting'); source.cancel("Cancelling in cleanup") };
    }, []);

    const userProfiles = Array.isArray(userData) && userData.length > 0 &&
        userData.map(({ profileId, firstName, lastName, email }, index) => (
            <div key={index}>
                <div>First Name: {firstName}</div>
                <div>Last Name: {lastName}</div>
                <div>Email: {email}</div>
                <div><Link href="/users/[id]" as={`/users/${profileId}`}>profilePage</Link></div>
            </div>
        ));

    return (
        <div>
            User Profiles:
            {userProfiles}
        </div>
    );
}

export default Users;