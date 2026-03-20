import { useRef, useMemo } from 'react'; 
import { useFrame } from '@react-three/fiber'; 
import * as THREE from 'three'; 
 
interface K9DogMeshProps { 
  state: 'idle' | 'running' | 'sniffing' | 'alert' | 'celebrating'; 
  signalColor?: string; 
} 
 
// Procedural fur-like material 
function createDogMaterial(color: string, roughness = 0.85) { 
  return new THREE.MeshStandardMaterial({ 
    color: new THREE.Color(color), 
    roughness, 
    metalness: 0.0, 
    side: THREE.FrontSide, 
  }); 
} 
 
// German Shepherd color palette 
const COAT_TAN    = '#8B6914'; 
const COAT_BLACK  = '#1A1A1A'; 
const COAT_CREAM  = '#D4B483'; 
const NOSE_COLOR  = '#1A0A00'; 
const EYE_COLOR   = '#4A2800'; 
 
export function K9DogMesh({ state, signalColor = '#8B5CF6' }: K9DogMeshProps) { 
  const groupRef     = useRef<THREE.Group>(null!); 
  const headRef      = useRef<THREE.Group>(null!); 
  const tailRef      = useRef<THREE.Group>(null!); 
  const noseRef      = useRef<THREE.Mesh>(null!); 
  const legFLRef     = useRef<THREE.Group>(null!); 
  const legFRRef     = useRef<THREE.Group>(null!); 
  const legBLRef     = useRef<THREE.Group>(null!); 
  const legBRRef     = useRef<THREE.Group>(null!); 
 
  const t = useRef(0); 
 
  // Materials — memoized so they don't recreate every frame 
  const tanMat   = useMemo(() => createDogMaterial(COAT_TAN), []); 
  const blackMat = useMemo(() => createDogMaterial(COAT_BLACK), []); 
  const creamMat = useMemo(() => createDogMaterial(COAT_CREAM), []); 
  const eyeMat   = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: new THREE.Color(EYE_COLOR), 
    roughness: 0.1, metalness: 0.5, 
    emissive: new THREE.Color('#FF6B00'), 
    emissiveIntensity: 0.3, 
  }), []); 
  const noseMat2 = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: new THREE.Color(NOSE_COLOR), 
    roughness: 0.2, 
    emissive: new THREE.Color(signalColor), 
    emissiveIntensity: 0.0, // animate this 
  }), [signalColor]); 
 
  useFrame((_, delta) => { 
    t.current += delta; 
 
    // ── Leg animation ───────────────────────────────────────────── 
    const runSpeed  = state === 'running' ? 8 : 2; 
    const runAmp    = state === 'running' ? 0.6 : state === 'idle' ? 0.1 : 0.05; 
 
    if (legFLRef.current) legFLRef.current.rotation.x = Math.sin(t.current * runSpeed) * runAmp; 
    if (legBRRef.current) legBRRef.current.rotation.x = Math.sin(t.current * runSpeed) * runAmp; 
    if (legFRRef.current) legFRRef.current.rotation.x = Math.sin(t.current * runSpeed + Math.PI) * runAmp; 
    if (legBLRef.current) legBLRef.current.rotation.x = Math.sin(t.current * runSpeed + Math.PI) * runAmp; 
 
    // ── Body bob while running ───────────────────────────────────── 
    if (groupRef.current) { 
      const bobAmp = state === 'running' ? 0.04 : 0.01; 
      groupRef.current.position.y = Math.sin(t.current * runSpeed * 2) * bobAmp; 
    } 
 
    // ── Head behavior ───────────────────────────────────────────── 
    if (headRef.current) { 
      if (state === 'sniffing') { 
        // Head bobs down as if sniffing ground 
        headRef.current.rotation.x = -0.4 + Math.sin(t.current * 3) * 0.15; 
      } else if (state === 'alert') { 
        // Head snaps upright, ears forward 
        headRef.current.rotation.x = 0.1; 
        headRef.current.rotation.y = Math.sin(t.current * 1.5) * 0.08; 
      } else { 
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0, delta * 3); 
      } 
    } 
 
    // ── Tail wag ────────────────────────────────────────────────── 
    if (tailRef.current) { 
      const wagSpeed = state === 'celebrating' ? 12 : state === 'alert' ? 8 : 2; 
      const wagAmp   = state === 'celebrating' ? 0.8 : 0.3; 
      tailRef.current.rotation.z = Math.sin(t.current * wagSpeed) * wagAmp; 
    } 
 
    // ── Nose glow when sniffing/alert ───────────────────────────── 
    if (noseRef.current) { 
      const mat = noseRef.current.material as THREE.MeshStandardMaterial; 
      const targetIntensity = state === 'sniffing' || state === 'alert' ? 1.5 + Math.sin(t.current * 4) * 0.5 : 0; 
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetIntensity, delta * 4); 
    } 
  }); 
 
  return ( 
    <group ref={groupRef} scale={[1, 1, 1]}> 
 
      {/* ── BODY ─────────────────────────────────────────────────── */} 
      {/* Main torso — elongated, slightly tapered */} 
      <mesh material={tanMat} position={[0, 0, 0]}> 
        <capsuleGeometry args={[0.22, 0.65, 8, 16]} /> 
      </mesh> 
      {/* Black saddle marking on back */} 
      <mesh material={blackMat} position={[0, 0.18, 0]} scale={[0.9, 0.3, 0.7]}> 
        <sphereGeometry args={[0.3, 12, 8]} /> 
      </mesh> 
      {/* Chest — slightly lighter */} 
      <mesh material={creamMat} position={[0.35, -0.08, 0]} scale={[0.6, 0.8, 0.85]}> 
        <sphereGeometry args={[0.2, 10, 8]} /> 
      </mesh> 
 
      {/* ── NECK ─────────────────────────────────────────────────── */} 
      <mesh material={tanMat} position={[0.4, 0.15, 0]} rotation={[0, 0, -0.4]}> 
        <capsuleGeometry args={[0.13, 0.28, 6, 12]} /> 
      </mesh> 
 
      {/* ── HEAD ─────────────────────────────────────────────────── */} 
      <group ref={headRef} position={[0.62, 0.3, 0]}> 
        {/* Skull */} 
        <mesh material={tanMat} position={[0, 0, 0]}> 
          <sphereGeometry args={[0.2, 14, 10]} /> 
        </mesh> 
        {/* Black top of head */} 
        <mesh material={blackMat} position={[0, 0.1, 0]} scale={[0.85, 0.5, 0.85]}> 
          <sphereGeometry args={[0.2, 12, 8]} /> 
        </mesh> 
        {/* Muzzle — elongated snout */} 
        <mesh material={tanMat} position={[0.2, -0.05, 0]}> 
          <capsuleGeometry args={[0.08, 0.22, 6, 10]} /> 
        </mesh> 
        <mesh material={creamMat} position={[0.22, -0.08, 0]} scale={[0.9, 0.7, 1]}> 
          <capsuleGeometry args={[0.07, 0.18, 6, 10]} /> 
        </mesh> 
 
        {/* NOSE — glows when detecting signal */} 
        <mesh ref={noseRef} material={noseMat2} position={[0.32, -0.04, 0]}> 
          <sphereGeometry args={[0.055, 10, 8]} /> 
        </mesh> 
 
        {/* Eyes — left and right */} 
        {[-0.08, 0.08].map((z, i) => ( 
          <group key={i} position={[0.13, 0.06, z]}> 
            <mesh material={eyeMat}> 
              <sphereGeometry args={[0.038, 10, 8]} /> 
            </mesh> 
            {/* Eye highlight */} 
            <mesh material={new THREE.MeshBasicMaterial({ color: '#FFFFFF' })} position={[0.02, 0.015, 0.015]}> 
              <sphereGeometry args={[0.01, 6, 6]} /> 
            </mesh> 
          </group> 
        ))} 
 
        {/* Ears — upright German Shepherd ears */} 
        {[-0.12, 0.12].map((z, i) => ( 
          <group key={i} position={[-0.04, 0.2, z]} rotation={[0.2, 0, i === 0 ? -0.25 : 0.25]}> 
            <mesh material={blackMat}> 
              <coneGeometry args={[0.07, 0.2, 6]} /> 
            </mesh> 
            {/* Inner ear */} 
            <mesh material={tanMat} position={[0, -0.04, 0]} scale={[0.55, 0.7, 0.7]}> 
              <coneGeometry args={[0.07, 0.2, 6]} /> 
            </mesh> 
          </group> 
        ))} 
      </group> 
 
      {/* ── LEGS ─────────────────────────────────────────────────── */} 
      {/* Front Left */} 
      <group ref={legFLRef} position={[0.3, -0.2, 0.16]}> 
        <mesh material={tanMat} position={[0, -0.18, 0]}> 
          <capsuleGeometry args={[0.065, 0.28, 6, 10]} /> 
        </mesh> 
        {/* Paw */} 
        <mesh material={blackMat} position={[0, -0.36, 0.02]}> 
          <sphereGeometry args={[0.075, 8, 6]} /> 
        </mesh> 
      </group> 
 
      {/* Front Right */} 
      <group ref={legFRRef} position={[0.3, -0.2, -0.16]}> 
        <mesh material={tanMat} position={[0, -0.18, 0]}> 
          <capsuleGeometry args={[0.065, 0.28, 6, 10]} /> 
        </mesh> 
        <mesh material={blackMat} position={[0, -0.36, -0.02]}> 
          <sphereGeometry args={[0.075, 8, 6]} /> 
        </mesh> 
      </group> 
 
      {/* Back Left */} 
      <group ref={legBLRef} position={[-0.28, -0.2, 0.16]}> 
        <mesh material={tanMat} position={[0, -0.18, 0]}> 
          <capsuleGeometry args={[0.065, 0.3, 6, 10]} /> 
        </mesh> 
        <mesh material={blackMat} position={[0, -0.38, 0.02]}> 
          <sphereGeometry args={[0.075, 8, 6]} /> 
        </mesh> 
      </group> 
 
      {/* Back Right */} 
      <group ref={legBRRef} position={[-0.28, -0.2, -0.16]}> 
        <mesh material={tanMat} position={[0, -0.18, 0]}> 
          <capsuleGeometry args={[0.065, 0.3, 6, 10]} /> 
        </mesh> 
        <mesh material={blackMat} position={[0, -0.38, -0.02]}> 
          <sphereGeometry args={[0.075, 8, 6]} /> 
        </mesh> 
      </group> 
 
      {/* ── TAIL ─────────────────────────────────────────────────── */} 
      <group ref={tailRef} position={[-0.42, 0.08, 0]}> 
        <mesh material={blackMat} rotation={[0, 0, 0.5]}> 
          <capsuleGeometry args={[0.04, 0.35, 6, 10]} /> 
        </mesh> 
        <mesh material={tanMat} position={[-0.18, 0.1, 0]} rotation={[0, 0, 0.3]}> 
          <capsuleGeometry args={[0.03, 0.15, 6, 8]} /> 
        </mesh> 
      </group> 
 
      {/* ── K9 BADGE — on side of dog (like a police vest) ─────────── */} 
      <mesh material={new THREE.MeshStandardMaterial({ 
        color: '#1A1A2E', 
        emissive: new THREE.Color(signalColor), 
        emissiveIntensity: 0.8, 
        roughness: 0.2, 
      })} position={[0, 0.08, 0.24]} rotation={[0, -0.1, 0]}> 
        <boxGeometry args={[0.25, 0.12, 0.01]} /> 
      </mesh> 
 
    </group> 
  ); 
} 
