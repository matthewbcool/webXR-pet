import React, { useRef, useEffect, forwardRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

export const Glub = forwardRef((props, ref) => {
    const group = useRef()
    const finalRef = ref || group
    const { nodes, materials, animations } = useGLTF('/models/glub.gltf')
    const { actions } = useAnimations(animations, finalRef)

    // Extract material-specific props
    const { 'material-opacity': opacity, 'material-transparent': transparent, ...restProps } = props

    // Apply opacity to all materials if specified
    useEffect(() => {
        if (opacity !== undefined && materials) {
            // Handle the Atlas material used by Glub
            if (materials.Atlas) {
                materials.Atlas.transparent = true
                materials.Atlas.opacity = opacity
                materials.Atlas.needsUpdate = true
            }
        }
    }, [opacity, materials])

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
        <group ref={finalRef} {...restProps} dispose={null}>
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
})

// Preload the model
useGLTF.preload('/models/glub.gltf')

