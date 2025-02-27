import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { XR, Interactive, Controllers, Hands } from '@react-three/xr';
import { Environment, OrbitControls } from '@react-three/drei';
import usePetStore from '../../hooks/usePetStore';
import { Egg } from '../../Egg'; // Import the proper Egg component
import { Glub } from '../Glub'; // Import Glub component

const PetModel = () => {
    const isEgg = usePetStore(state => state.isEgg);
    const hatchEgg = usePetStore(state => state.hatchEgg);

    return (
        <Suspense fallback={null}>
            <Interactive onSelect={() => isEgg && hatchEgg()}>
                {isEgg ? (
                    // Use the imported Egg component from egg.jsx
                    <Egg position={[0, 0, -0.5]} scale={0.25} />
                ) : (
                    <Glub position={[0, 0, -0.5]} scale={0.15} />
                )}
            </Interactive>
            <Environment preset="sunset" />
        </Suspense>
    );
};

const ARScene = () => {
    return (
        <Canvas>
            <XR>
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <OrbitControls />
                <PetModel />
                <Controllers />
                <Hands />
            </XR>
        </Canvas>
    );
};

export default ARScene;