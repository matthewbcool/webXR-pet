import React from 'react';
import ARScene from '../ar/ARScene';

const MainLayout = ({ children }) => {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            {children || <ARScene />}
        </div>
    );
};

export default MainLayout;