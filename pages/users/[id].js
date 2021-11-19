import { useRouter } from 'next/router';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import Link from 'next/link';
import cookie from 'js-cookie';

const User = () => {
    const { query: { id } } = useRouter();
    
    return (
      <div>
        <Head>
          <title>Welcome to PTE Staffing</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <h1>PTESTAFFING.COM</h1>
  
        <h2>Proudly using Next.js, Mongodb and deployed with Now</h2>
      </div>
    );
}

export default User;