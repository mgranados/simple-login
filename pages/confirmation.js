import { useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import cookie from 'js-cookie';



function Confirmation() {
    const router = useRouter();
    const { confirmationCode, email, profileId } = router?.query || {};


    if (confirmationCode) {
        axios
        .patch(`/api/users/${profileId}?confirmationCode=${confirmationCode}`)
        .then(({ data: { email, token, error } }) => {
            if (error) console.log({error});
            if (token) {
                cookie.set('token', token, { expires: 2 });
                Router.push(`/accounts/${profileId}`);
            }
        });

        return <h1>Redirecting...</h1>;
    }

    return (
        <div>
            <Head>
            <title>PTEStaffing | Account Confirmation Page</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <h1>PTESTAFFING.COM</h1>
            <p>
                Please confirm your account by visiting the link in the email sent to {email}
            </p>
        </div>
    );
}

export default Confirmation;
