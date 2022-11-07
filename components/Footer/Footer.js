import { shape, func } from 'prop-types';

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

Footer.propTypes = {
    revalidate: func.isRequired,
    cookie: shape({
        remove: func
    }).isRequired
}

export default Footer;