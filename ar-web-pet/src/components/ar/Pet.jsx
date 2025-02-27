import React, { useEffect, useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Pet = () => {
    const gltf = useLoader(GLTFLoader, '/models/pet.glb'); // Adjust the path as necessary
    const petRef = useRef();

    useEffect(() => {
        if (petRef.current) {
            petRef.current.position.set(0, 0, 0); // Center the pet in the scene
        }
    }, [gltf]);

    return (
        <primitive
            ref={petRef}
            object={gltf.scene}
            scale={0.5} // Adjust scale as necessary
        />
    );
};

export default Pet;