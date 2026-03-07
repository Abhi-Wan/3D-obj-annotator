import { Html } from "@react-three/drei";
import type { Vector3 } from "three";
import "./Textbox.css";

type TextboxProps = {
  position: Vector3
  text: string
}

export function Textbox({ position, text }: TextboxProps) {
  return (
    <Html position={position} distanceFactor={0.5}>
      <div className='text-box'>{text}</div>
    </Html>
  )
}