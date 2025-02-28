import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useXR, Interactive, RayGrab } from '@react-three/xr';
import { Environment } from '@react-three/drei';
import { Vector3 } from 'three';
import usePetStore from '../hooks/usePetStore';
import { Egg } from '../Egg';
import { Glub } from './Glub';

const PetModel = () => {
    const isEgg = usePetStore(state => state.isEgg);
    const interactWithEgg = usePetStore(state => state.interactWithEgg);
    const isPresenting = useXR(state => state.isPresenting);

    // For placement
    const [hasPlaced, setHasPlaced] = useState(false);
    const [placementPosition, setPlacementPosition] = useState([0, 0.8, -0.5]); // Changed from 1.2 to 0.8

    // For hit testing
    const hitTestPosition = new Vector3();
    const [showHitIndicator, setShowHitIndicator] = useState(false);

    // For transition animation
    const [showEgg, setShowEgg] = useState(true);
    const [showHatchedPet, setShowHatchedPet] = useState(false);
    const [petScale, setPetScale] = useState(0.05);

    // Animation state for useFrame
    const animState = useRef({
        isGrowing: false,
        growProgress: 0,
        growSpeed: 0.01,
        startScale: 0.05,
        endScale: 0.15,
    });

    const groupRef = useRef();
    const [lastInteractionTime, setLastInteractionTime] = useState(0);

    // Add these new state variables after your existing useState declarations
    const lastPosition = useRef(new Vector3());
    const movementThreshold = 0.1; // Adjust this value to change sensitivity
    const velocityHistory = useRef([]);
    const velocityHistoryLength = 5; // Number of frames to track

    // Add this state to track the hatching position
    const [hatchPosition, setHatchPosition] = useState(null);

    // Place egg
    const placeEgg = () => {
        if (!hasPlaced && hitTestPosition.lengthSq() > 0) {
            setPlacementPosition([hitTestPosition.x, hitTestPosition.y, hitTestPosition.z]);
            setHasPlaced(true);
            setShowHitIndicator(false);
        }
    };

    // Update the handleInteraction function to remove scaling animation
    const handleInteraction = (event) => {
        // Prevent event bubbling
        if (event) {
            event.stopPropagation();
        }
        
        console.log("Egg interaction detected!", event?.type);

        if (isEgg) {
            if (!hasPlaced && isPresenting) {
                console.log("Placing egg...");
                placeEgg();
            } else {
                console.log("Interacting with egg...");
                interactWithEgg();

                // Get the egg mesh (either from event or using ref)
                const eggMesh = event?.object || groupRef.current;
                if (eggMesh) {
                    // Only apply rotation animation, no scaling
                    const originalRotation = eggMesh.rotation.clone();
                    eggMesh.rotation.z += 0.1; // Reduced rotation amount
                    
                    setTimeout(() => {
                        if (eggMesh) {
                            eggMesh.rotation.copy(originalRotation);
                        }
                    }, 150);
                }
            }
        }
    };

    // Also update the debounced interaction handler
    const handleDebouncedInteraction = () => {
        const now = Date.now();
        if (now - lastInteractionTime > 500) { // Debounce interval
            console.log('Egg interaction!');
            setLastInteractionTime(now);
            interactWithEgg();
            
            if (groupRef.current) {
                // Only apply rotation animation, no scaling
                const group = groupRef.current;
                const originalRotation = group.rotation.clone();
                group.rotation.z += 0.1;
                setTimeout(() => {
                    if (group) {
                        group.rotation.copy(originalRotation);
                    }
                }, 150);
            }
        }
    };

    // Handle both grab and select events
    const handleGrab = (e) => {
        console.log('Grab event:', e);
        handleDebouncedInteraction();
    };

    const handleSelect = (e) => {
        console.log('Select event:', e);
        handleDebouncedInteraction();
    };

    useFrame((state, delta) => {
        if (animState.current.isGrowing) {
            animState.current.growProgress += delta * animState.current.growSpeed * 60;

            if (animState.current.growProgress >= 1) {
                animState.current.growProgress = 1;
                animState.current.isGrowing = false;
                setTimeout(() => {
                    setShowEgg(false);
                }, 300);
            }

            const newScale = animState.current.startScale +
                (animState.current.endScale - animState.current.startScale) *
                animState.current.growProgress;

            setPetScale(newScale);
        }

        // Add movement detection
        if (groupRef.current && showEgg) {
            const currentPosition = new Vector3();
            groupRef.current.getWorldPosition(currentPosition);

            // Calculate velocity (movement speed)
            const velocity = currentPosition.distanceTo(lastPosition.current) / delta;
            velocityHistory.current.push(velocity);

            // Keep history at fixed length
            if (velocityHistory.current.length > velocityHistoryLength) {
                velocityHistory.current.shift();
            }

            // Check for shake - look for alternating high velocity
            const averageVelocity = velocityHistory.current.reduce((a, b) => a + b, 0) 
                / velocityHistory.current.length;

            if (averageVelocity > movementThreshold) {
                handleDebouncedInteraction();
                // Reset velocity history after triggering
                velocityHistory.current = [];
            }

            // Update last position
            lastPosition.current.copy(currentPosition);
        }
    });

    useEffect(() => {
        if (!isEgg && showEgg) {
            console.log("Egg is hatching!");
            
            // Store the current egg position as the hatching position
            if (groupRef.current) {
                const position = new Vector3();
                groupRef.current.getWorldPosition(position);
                setHatchPosition([position.x, position.y, position.z]);
            } else {
                // Fallback to the current placement position
                setHatchPosition(getModelPosition());
            }
            
            setShowHatchedPet(true);
            animState.current.isGrowing = true;
            animState.current.growProgress = 0;
        }
    }, [isEgg]);

    const getModelPosition = () => {
        if (hasPlaced) return placementPosition;
        return [0, 0, -0.5];
    };

    // Update the getPetPosition function to properly position the pet at the egg's center
    const getPetPosition = () => {
        const basePos = getModelPosition();
        return [basePos[0], basePos[1] - 0.1, basePos[2]]; // Changed from -0.15 to -0.1
    };

    return (
        <>
            {showEgg && (
                <RayGrab>
                    <Interactive 
                        onSelect={handleInteraction}
                        onSqueeze={handleInteraction}
                    >
                        <group 
                            ref={groupRef} 
                            position={placementPosition}
                            onPointerMove={(e) => {
                                // Optional: Add direct movement tracking for non-VR interaction
                                if (e.delta > movementThreshold) {
                                    handleDebouncedInteraction();
                                }
                            }}
                        >
                            {/* Larger invisible interaction mesh */}
                            <mesh
                                visible={false}
                                scale={[0.4, 0.4, 0.4]}
                            >
                                <sphereGeometry />
                                <meshBasicMaterial transparent opacity={0} />
                            </mesh>
                            
                            <Egg
                                rotation={[0, Math.PI / 4, 0]}
                                scale={0.25}
                                onClick={handleInteraction}
                                onPointerDown={handleInteraction}
                            />
                        </group>
                    </Interactive>
                </RayGrab>
            )}

            {showHatchedPet && (
                <Glub
                    position={hatchPosition ? 
                        // Use stored hatch position with slight Y adjustment
                        [hatchPosition[0], hatchPosition[1] - 0.1, hatchPosition[2]] // Changed from -0.15 to -0.1
                        : 
                        // Fallback to calculated position
                        getPetPosition()
                    }
                    scale={petScale}
                    rotation={[0, Math.PI / 4, 0]}
                />
            )}

            {showHitIndicator && (
                <mesh position={hitTestPosition} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.1, 0.12, 32]} />
                    <meshBasicMaterial color="#4CAF50" transparent opacity={0.8} />
                </mesh>
            )}

            <Environment preset="sunset" />
        </>
    );
};

export default PetModel;