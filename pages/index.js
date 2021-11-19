import Head from 'next/head';
import Link from 'next/link';

function Home() {
  return (
    <div>
      <Head>
        <title>Welcome to PTE Staffing</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h1>PTESTAFFING.COM</h1>
      <Link href="/login">Login</Link>
      <p>or</p>
      <Link href="/signup">Sign Up</Link>
      <h2>Proudly using Next.js, Mongodb and deployed with Now</h2>
      <p>Welcome!</p>
    </div>
  );
}

export default Home;
