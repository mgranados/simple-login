const Footer = ({ revalidate, cookie }) =>
(
    <p>
        <button
            onClick={() => {
            cookie.remove('token');
            revalidate();
        }}>
            Logout
        </button>
    </p>
);
export default Footer;