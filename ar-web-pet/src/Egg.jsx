
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Egg(props) {
    const { nodes, materials } = useGLTF('/models/egg.glb')
    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.bottomegg.geometry}
                material={materials['Material.002']}
                scale={[1, 1.151, 1]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.topegg.geometry}
                material={materials['Material.002']}
                position={[0, -0.005, 0]}
                scale={[1, 1.151, 1]}
            />
        </group>
    )
}

useGLTF.preload('/models/egg.glb')

