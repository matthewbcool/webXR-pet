import React, { useRef, useEffect, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

export function Glub(props) {
    const group = useRef()
    const { nodes, materials, animations } = useGLTF('/models/glub.gltf')
    const { actions } = useAnimations(animations, group)

    // Play the Flying_Idle animation by default when component mounts
    useEffect(() => {
        // Reset all animations
        Object.values(actions).forEach(action => action?.reset())

        // Play the Flying_Idle animation with a fade-in
        if (actions["Flying_Idle"]) {
            actions["Flying_Idle"].reset().fadeIn(0.5).play()
        }

        return () => {
            // Clean up animations when component unmounts
            Object.values(actions).forEach(action => action?.fadeOut(0.5))
        }
    }, [actions])

    return (
        <group ref={group} {...props} dispose={null}>
            <group name="Scene">
                <group name="CharacterArmature">
                    <skinnedMesh
                        name="Glub"
                        geometry={nodes.Glub.geometry}
                        material={materials.Atlas}
                        skeleton={nodes.Glub.skeleton}
                    />
                    <primitive object={nodes.Root} />
                </group>
            </group>
        </group>
    )
}

// Preload the model
useGLTF.preload('/models/glub.gltf')

