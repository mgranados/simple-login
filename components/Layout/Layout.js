import React, { useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import cookie from 'js-cookie';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Layout = ({ children }) => {
    const {data, revalidate} = useSWR('/api/me', async function(args) {
        const res = await fetch(args);
        return res.json(); 
    })

    useEffect(() =>{ revalidate(); }, [children]);

    if (!data) return <h1>Loading...</h1>;
    
    let loggedIn = !!data.email;

    return (
        <>
            <Header />
            <p>you are {!loggedIn && 'not '}logged in.</p>
            {children}
            <Footer cookie={cookie} revalidate={revalidate} />
        </>
    );
};

export default Layout;