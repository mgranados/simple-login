import React, { useState, useEffect, useContext } from 'react';
import Router, { useRouter } from 'next/router';
import { UserContext } from '~components/Layout/Layout';

const Redirector = ({ children }) => {

    const router = useRouter();
    const { query = {} } = router;
    const { accountId } = query;
    const { userId, profileId, emailConfirmed, email } = useContext(UserContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {   
        if (!userId) {
            const alert = 'you must be logged in to view this page.'
            Router.push(`/login?alert=${alert}`);
            return;
        }
        
        // TODO: increase login security by comparing userId
        if (!!accountId && accountId !== profileId) {
            const alert = 'you are unauthorized to view this page.'
            Router.push(`/?alert=${alert}`);
            return;
        }

        if (!emailConfirmed) {
            Router.push(`/confirmation?email=${email}`);
            return;
        }
        setLoading(false);
    }, [router]);

    if (loading) return <h1>Loading...</h1>;

    return (
        <div>
            {children}
        </div>
    );
}

export default Redirector;