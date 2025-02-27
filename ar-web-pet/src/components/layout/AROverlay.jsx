import React from 'react';
import usePetStore from '../../hooks/usePetStore';
import { VRButton, ARButton } from '@react-three/xr';

const AROverlay = () => {
    const isEgg = usePetStore(state => state.isEgg);
    const hatchEgg = usePetStore(state => state.hatchEgg);

    return (
        <div style={{
            position: 'absolute',
            bottom: 20,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 1000
        }}>
            <div style={{ pointerEvents: 'auto' }}>
                <ARButton
                    style={{
                        padding: '10px 20px',
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        margin: '0 10px'
                    }}
                />
                {isEgg && (
                    <button
                        onClick={() => hatchEgg()}
                        style={{
                            padding: '10px 20px',
                            background: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            margin: '0 10px'
                        }}
                    >
                        Hatch Egg
                    </button>
                )}
            </div>
        </div>
    );
};

export default AROverlay;