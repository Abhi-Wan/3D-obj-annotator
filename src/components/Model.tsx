import type { ThreeElements } from "@react-three/fiber";

export function Model(props: ThreeElements["primitive"]) {
    return (
        <primitive {...props} />
    )
}