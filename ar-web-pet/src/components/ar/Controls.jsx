import React from 'react';

const Controls = () => {
    return (
        <div className="controls">
            <button onClick={() => console.log('Interact with pet')}>Interact</button>
            <button onClick={() => console.log('Feed pet')}>Feed</button>
            <button onClick={() => console.log('Play with pet')}>Play</button>
        </div>
    );
};

export default Controls;