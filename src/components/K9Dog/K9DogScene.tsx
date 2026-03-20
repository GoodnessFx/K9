import { Suspense } from 'react'; 
import { Canvas } from '@react-three/fiber'; 
import { ContactShadows, Environment, Float, Sparkles } from '@react-three/drei'; 
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'; 
import { BlendFunction } from 'postprocessing'; 
import { K9DogMesh } from './K9DogMesh'; 
import * as THREE from 'three'; 
 
type DogState = 'idle' | 'running' | 'sniffing' | 'alert' | 'celebrating'; 
 
interface K9DogSceneProps { 
  state: DogState; 
  signalColor?: string; 
} 
 
function SceneLights({ signalColor = '#8B5CF6' }: { signalColor?: string }) { 
  return ( 
    <> 
      {/* Key light — warm from above-front */} 
      <directionalLight 
        position={[3, 4, 2]} 
        intensity={2.5} 
        color="#FFF5E0" 
        castShadow 
        shadow-mapSize={[2048, 2048]} 
        shadow-camera-far={20} 
        shadow-camera-left={-4} 
        shadow-camera-right={4} 
        shadow-camera-top={4} 
        shadow-camera-bottom={-4} 
      /> 
      {/* Fill light — cool from opposite side */} 
      <directionalLight position={[-2, 2, -1]} intensity={0.8} color="#C0D8FF" /> 
      {/* Rim light — makes dog pop from background */} 
      <directionalLight position={[-1, 1, -3]} intensity={1.2} color="#E8D5FF" /> 
      {/* Signal color accent — emanates from front */} 
      <pointLight position={[2, 0.5, 1.5]} intensity={1.5} color={signalColor} distance={4} /> 
      {/* Ground bounce — warm subtle fill */} 
      <hemisphereLight groundColor="#1A0A00" color="#FFF8F0" intensity={0.4} /> 
    </> 
  ); 
} 
 
function Ground() { 
  return ( 
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.58, 0]} receiveShadow> 
      <planeGeometry args={[10, 10]} /> 
      <meshStandardMaterial 
        color="#07090D" 
        roughness={1} 
        metalness={0} 
        transparent 
        opacity={0} 
      /> 
    </mesh> 
  ); 
} 
 
function AlertParticles({ active, color }: { active: boolean; color: string }) { 
  if (!active) return null; 
  return ( 
    <Sparkles 
      count={60} 
      scale={[2, 1.5, 2]} 
      size={3} 
      speed={0.8} 
      color={color} 
      position={[0, 0.2, 0]} 
    /> 
  ); 
} 
 
export function K9DogScene({ state, signalColor = '#8B5CF6' }: K9DogSceneProps) { 
  const isCelebrating = state === 'celebrating' || state === 'alert'; 
 
  return ( 
    <Canvas 
      shadows 
      gl={{ 
        antialias: true, 
        toneMapping: THREE.ACESFilmicToneMapping, 
        toneMappingExposure: 1.4, 
        outputColorSpace: THREE.SRGBColorSpace, 
      }} 
      camera={{ position: [2.2, 0.6, 2.5], fov: 42 }} 
      style={{ background: 'transparent' }} 
    > 
      {/* World-class environment lighting */} 
      <Environment preset="city" /> 
 
      <SceneLights signalColor={signalColor} /> 
 
      {/* The K9 Dog */} 
      <Float 
        speed={state === 'idle' ? 1.5 : 0} 
        rotationIntensity={state === 'idle' ? 0.05 : 0} 
        floatIntensity={state === 'idle' ? 0.08 : 0} 
      > 
        <Suspense fallback={null}> 
          <K9DogMesh state={state} signalColor={signalColor} /> 
        </Suspense> 
      </Float> 
 
      {/* Contact shadow — makes dog feel grounded */} 
      <ContactShadows 
        position={[0, -0.58, 0]} 
        opacity={0.6} 
        scale={3} 
        blur={1.5} 
        far={1.5} 
        color="#000000" 
      /> 
 
      {/* Celebration particles */} 
      <AlertParticles active={isCelebrating} color={signalColor} /> 
 
      {/* Post-processing — the secret to "world-class graphics" */} 
      <EffectComposer> 
        {/* Bloom — makes lights glow beautifully */} 
        <Bloom 
          intensity={isCelebrating ? 1.8 : 0.6} 
          luminanceThreshold={0.3} 
          luminanceSmoothing={0.9} 
          height={300} 
          blendFunction={BlendFunction.ADD} 
        /> 
        {/* Subtle chromatic aberration — cinematic */} 
        <ChromaticAberration 
          offset={new THREE.Vector2(0.0005, 0.0005)} 
          blendFunction={BlendFunction.NORMAL} 
          radialModulation={false} 
          modulationOffset={0} 
        /> 
      </EffectComposer> 
 
      {/* Ground plane to catch shadows */} 
      <Ground /> 
    </Canvas> 
  ); 
} 
