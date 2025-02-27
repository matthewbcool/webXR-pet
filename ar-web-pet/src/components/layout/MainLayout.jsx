import React from 'react';
import ARScene from '../ar/ARScene';
import AROverlay from './AROverlay';

const MainLayout = ({ children }) => {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            {children || <ARScene />}
            <AROverlay />
        </div>
    );
};

export default MainLayout;