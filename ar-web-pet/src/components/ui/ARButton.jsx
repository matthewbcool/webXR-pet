import React from 'react';

const ARButton = () => {
    const handleClick = () => {
        // Logic to enter AR mode
        console.log('Entering AR mode...');
    };

    return (
        <button onClick={handleClick} className="ar-button">
            Enter AR
        </button>
    );
};

export default ARButton;