import React, { useRef, forwardRef, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import usePetStore from './hooks/usePetStore'

export const Egg = forwardRef((props, ref) => {
    const { nodes, materials } = useGLTF('/models/egg.glb')
    const groupRef = useRef()
    const topEggRef = useRef()
    const bottomEggRef = useRef()

    // Get egg state from store
    const eggInteractions = usePetStore(state => state.eggInteractions)
    const requiredInteractions = usePetStore(state => state.requiredInteractions)
    const isEgg = usePetStore(state => state.isEgg)

    // For shake animation
    const [shaking, setShaking] = useState(false)
    const [intensity, setIntensity] = useState(0)
    const [isHatching, setIsHatching] = useState(false)

    // Track previous interaction count to detect changes
    const prevInteractions = useRef(eggInteractions)

    // Spring animations for hatching
    const topEggSpring = useSpring({
        position: isHatching ? [0, 0.5, 0] : [0, -0.005, 0],
        rotation: isHatching ? [0, 0, 0.2] : [0, 0, 0],
        config: { mass: 1, tension: 80, friction: 20 }
    })

    const bottomEggSpring = useSpring({
        position: isHatching ? [0, -0.5, 0] : [0, 0, 0],
        rotation: isHatching ? [0, 0, -0.2] : [0, 0, 0],
        config: { mass: 1, tension: 80, friction: 20 }
    })

    // Handle egg shake animation
    useFrame(() => {
        if (shaking && groupRef.current) {
            // Random shake offset based on intensity
            const shakeX = (Math.random() - 0.5) * 0.03 * intensity
            const shakeY = (Math.random() - 0.5) * 0.02 * intensity

            // Apply shake to the group
            groupRef.current.rotation.x = shakeX
            groupRef.current.rotation.z = shakeY

            // Gradually reduce intensity
            setIntensity(prev => Math.max(0, prev - 0.05))

            // Stop shaking when intensity reaches zero
            if (intensity <= 0) {
                setShaking(false)
                // Reset rotation
                groupRef.current.rotation.x = 0
                groupRef.current.rotation.z = 0
            }
        }
    })

    // Detect when interaction count changes
    useEffect(() => {
        if (eggInteractions > prevInteractions.current) {
            // Start shaking with intensity based on progress toward hatching
            setShaking(true)
            setIntensity(0.5 + (eggInteractions / requiredInteractions) * 1.5)

            // If this is the final interaction to hatch, trigger hatching animation
            if (eggInteractions >= requiredInteractions) {
                setTimeout(() => {
                    setIsHatching(true)
                }, 500)
            }

            prevInteractions.current = eggInteractions
        }
    }, [eggInteractions, requiredInteractions])

    return (
        <group ref={ref || groupRef} {...props} dispose={null}>
            <animated.mesh
                ref={bottomEggRef}
                castShadow
                receiveShadow
                geometry={nodes.bottomegg.geometry}
                material={materials['Material.002']}
                scale={[1, 1.151, 1]}
                {...bottomEggSpring}
            />
            <animated.mesh
                ref={topEggRef}
                castShadow
                receiveShadow
                geometry={nodes.topegg.geometry}
                material={materials['Material.002']}
                position={[0, -0.005, 0]}
                scale={[1, 1.151, 1]}
                {...topEggSpring}
            />
        </group>
    )
})

useGLTF.preload('/models/egg.glb')

