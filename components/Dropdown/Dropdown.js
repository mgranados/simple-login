import React, { useState } from 'react';

const Dropdown = ({ heading, list }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => { setIsOpen(!isOpen); };


    return (
        <div className={styles.dropdown}>
            <button onClick={toggle}></button>
            <ul>
                <li></li>
            </ul>
        </div>
    )

};

export default Dropdown;