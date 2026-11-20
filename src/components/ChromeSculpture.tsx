import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import type { Group } from 'three'
import { ACESFilmicToneMapping, CatmullRomCurve3, IcosahedronGeometry, TubeGeometry, Vector3 } from 'three'

function createOrganicShell() {
  const geometry = new IcosahedronGeometry(2.05, 6)
  const positions = geometry.attributes.position

  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index)
    const y = positions.getY(index)
    const z = positions.getZ(index)
    const length = Math.sqrt(x * x + y * y + z * z)
    const nx = x / length
    const ny = y / length
    const nz = z / length
    const broad = Math.sin(nx * 2.1 + ny * 1.2) * Math.cos(nz * 2.4)
    const fine = Math.sin((nx + ny - nz) * 5.2)
    const elongation = 1 + 0.13 * nz
    const radius = 1 + broad * 0.11 + fine * 0.025
    positions.setXYZ(index, nx * 2.05 * radius * elongation, ny * 2.05 * radius, nz * 2.05 * radius * (1 - 0.08 * nx))
  }

  positions.needsUpdate = true
  geometry.computeVertexNormals()
  return geometry
}

function createRibbon(points: Vector3[], radius: number) {
  const curve = new CatmullRomCurve3(points, true, 'centripetal')
  return new TubeGeometry(curve, 180, radius, 12, true)
}

function Sculpture() {
  const world = useRef<Group>(null)
  const foreground = useRef<Group>(null)
  const shell = useMemo(() => createOrganicShell(), [])
  const limeRibbon = useMemo(
    () => createRibbon([
      new Vector3(-1.45, -0.75, 1.25),
      new Vector3(-0.85, 0.95, 1.65),
      new Vector3(0.45, 1.55, 1.12),
      new Vector3(1.55, 0.65, 0.72),
      new Vector3(1.3, -1.05, 1.05),
    ], 0.035),
    [],
  )
  const blueRibbon = useMemo(
    () => createRibbon([
      new Vector3(-1.55, 0.15, -0.95),
      new Vector3(-0.45, -1.45, -0.65),
      new Vector3(0.95, -1.15, -0.2),
      new Vector3(1.62, 0.25, -0.48),
      new Vector3(0.65, 1.42, -0.72),
    ], 0.028),
    [],
  )

  useEffect(() => () => {
    shell.dispose()
    limeRibbon.dispose()
    blueRibbon.dispose()
  }, [shell, limeRibbon, blueRibbon])

  useFrame((state, delta) => {
    if (!world.current || !foreground.current) return
    const mobile = state.size.width < 760
    const tablet = state.size.width >= 760 && state.size.width < 980
    const targetScale = mobile ? 0.72 : tablet ? 0.86 : 1
    const targetWorldX = mobile ? -0.45 : tablet ? 0.25 : state.pointer.x * 0.18
    const targetWorldY = mobile ? -2.25 : tablet ? -0.35 : state.pointer.y * 0.12
    const targetCameraZ = mobile ? 11.5 : tablet ? 10.2 : 8.8

    world.current.scale.x += (targetScale - world.current.scale.x) * 0.025
    world.current.scale.y += (targetScale - world.current.scale.y) * 0.025
    world.current.scale.z += (targetScale - world.current.scale.z) * 0.025
    world.current.position.x += (targetWorldX - world.current.position.x) * 0.018
    world.current.position.y += (targetWorldY - world.current.position.y) * 0.018
    state.camera.position.z += (targetCameraZ - state.camera.position.z) * 0.025
    state.camera.position.x += (state.pointer.x * (mobile ? 0.08 : 0.35) - state.camera.position.x) * 0.012
    state.camera.position.y += (state.pointer.y * (mobile ? 0.05 : 0.18) - state.camera.position.y) * 0.012
    world.current.rotation.y = 0.15 + Math.sin(state.clock.elapsedTime * 0.09) * 0.025
    world.current.rotation.z = -0.04 + Math.sin(state.clock.elapsedTime * 0.12) * 0.018
    foreground.current.position.y = Math.sin(state.clock.elapsedTime * 0.24) * 0.08
    foreground.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.018
    world.current.rotation.x += delta * 0.0008
  })

  return (
    <group ref={world}>
      <group position={[4.15, 0.15, -1.15]} scale={2.05} rotation={[0.12, -0.25, -0.08]}>
        <mesh geometry={shell}>
          <meshPhysicalMaterial
            color="#aab2bf"
            metalness={1}
            roughness={0.11}
            clearcoat={0.9}
            clearcoatRoughness={0.08}
            envMapIntensity={2.2}
          />
        </mesh>
        <mesh geometry={limeRibbon}>
          <meshPhysicalMaterial color="#d4ff24" emissive="#d4ff24" emissiveIntensity={0.8} metalness={0.72} roughness={0.2} clearcoat={1} />
        </mesh>
        <mesh geometry={blueRibbon}>
          <meshPhysicalMaterial color="#1558c9" emissive="#1558c9" emissiveIntensity={0.58} metalness={0.82} roughness={0.16} clearcoat={1} />
        </mesh>
      </group>
      <group ref={foreground} position={[6.1, -2.15, 0.55]} scale={1.45} rotation={[0.25, 0.65, 0.3]}>
        <mesh geometry={shell}>
          <meshPhysicalMaterial color="#7e8798" metalness={1} roughness={0.21} clearcoat={0.55} clearcoatRoughness={0.16} envMapIntensity={1.6} />
        </mesh>
      </group>
      <group position={[-5.2, 2.15, -5]} scale={1.65} rotation={[0.1, 0.8, -0.2]}>
        <mesh geometry={shell}>
          <meshPhysicalMaterial color="#5f6a7a" metalness={1} roughness={0.28} clearcoat={0.35} envMapIntensity={1.2} />
        </mesh>
      </group>
      <mesh position={[1.8, -3.35, -2.2]} scale={[5.2, 0.035, 1]}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshPhysicalMaterial color="#1558c9" emissive="#1558c9" emissiveIntensity={0.22} metalness={0.75} roughness={0.24} />
      </mesh>
    </group>
  )
}

export default function ChromeSculpture() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8.8], fov: 34 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance', stencil: false, depth: true }}
      onCreated={({ gl }) => {
        gl.setClearColor('#030407', 0)
        gl.toneMapping = ACESFilmicToneMapping
        gl.toneMappingExposure = 1.08
      }}
      fallback={<div className="sculpture-fallback" aria-hidden="true" />}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 4, 6]} intensity={3} color="#ffffff" />
      <pointLight position={[-4, -2, 3]} intensity={18} color="#1558c9" distance={8} />
      <pointLight position={[4, 2, 2]} intensity={12} color="#d4ff24" distance={7} />
      <Suspense fallback={null}>
        <Sculpture />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
}
