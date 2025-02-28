import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { XR, Controllers, Hands, ARButton, RayGrab, Interactive } from '@react-three/xr';
import PetModel from '../PetModel';

const ARScene = () => {
    return (
        <>
            <ARButton
                sessionInit={{
                    requiredFeatures: ['hit-test', 'hand-tracking'],
                    optionalFeatures: ['dom-overlay'],
                    domOverlay: { root: document.body }
                }}
            />
            <Canvas>
                <XR referenceSpace="local">
                    <ambientLight intensity={0.8} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <Suspense fallback={null}>
                        <PetModel />
                    </Suspense>
                    <Controllers rayMaterial={{ color: 'blue' }} />
                    <Hands 
                        pinchDistance={0.05} // Reduced pinch distance for better detection
                        hideRays={false}     // Show rays for debugging
                    />
                </XR>
            </Canvas>
        </>
    );
};

export default ARScene;