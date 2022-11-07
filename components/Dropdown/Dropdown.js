import React, { useState } from 'react';

const Dropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => { setIsOpen(!isOpen); };


    return (
        <div className={''}>
            <button onClick={toggle}></button>
            <ul>
                <li></li>
            </ul>
        </div>
    )

};

export default Dropdown;