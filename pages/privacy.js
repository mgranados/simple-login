import Head from 'next/head';
import Link from 'next/link';

function Privacy() {
  return (
    <div>
      <Head>
        <title>Privacy Policy | PTE Staffing</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h1>Privacy Policy</h1>
      <p>
        We only collect the information you choose to give us, and we process it with 
        your consent, or on another legal basis-we only require the minimum amount of 
        personal information that is necessary to fulfill the purpose of your interaction 
        with us – we don’t sell it to third parties – and we only use it as this privacy 
        statement describes. We are compliant with the general data protection regulation 
        (GDPR). No matter where you are where you live or what your citizenship is, we 
        provide the same standard of privacy protection to all our users around the world, 
        regardless of their country or origin or location
      </p>
      <Link href="/contact">Contact Us</Link>
    </div>
  );
}

export default Privacy;