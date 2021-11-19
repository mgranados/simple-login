import Link from 'next/link';

const Header = ({ id }) => (
    <div>
        <div><Link href="/">Home</Link></div>
        <div><Link href="/users">Users</Link></div>
    </div>
);

export default Header;