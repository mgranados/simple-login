import Link from 'next/link';
import axios from 'axios';

  const onClick = (e) => {
    e.preventDefault();
    console.log('post sent to /api/emails')
    axios.post('/api/emails').then(({ data }) => {
      console.log({ data });
    }).catch((err) => console.log({err}));
  };


const Header = () => {
    return (
        <div>
            <button onClick={onClick}>send mail</button>
            <div><Link href="/events">Event Consultation & Staffing</Link></div>
            <div><Link href="/healthcare">Medical & Allied Health Care Staffing</Link></div>
            <div><Link href="/cleaning">Cleaning Services</Link></div>
            <div><Link href="/privacy">Privacy Policy</Link></div>
            <div><Link href="/">Home</Link></div>
            <div><Link href="/users">Users</Link></div>
        </div>
    )
};

export default Header;