import React, { createContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';
import { node, string, oneOfType } from 'prop-types';
import useSWR from 'swr';
import cookie from 'js-cookie';
import { Header, Footer } from '~components';

export const UserContext = createContext({});

const Layout = ({ children }) => {
    const { query: { alert } } = useRouter();
    const {data = {}, revalidate} = useSWR('/api/me', async function(args) {
        const res = await fetch(args);
        return res.json(); 
    })

    useEffect(() =>{ revalidate(); }, [children]);

    if (!data) return <h1>Loading...</h1>;
    
    // let loggedIn = !!data.profileId;

    return (
        <UserContext.Provider value={data}>
            <Header />
            {!!alert && <p>{alert}</p>}
            {children}
            <Footer cookie={cookie} revalidate={revalidate} />
        </UserContext.Provider>
    );
};

Layout.propTypes = {
    children: oneOfType([node, string]).isRequired
}

export default Layout;