import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  buildMusculoskeletalModel,
  AnatomySceneGraph,
  CAMERA_PRESETS,
} from './proceduralAnatomy';
import { MUSCLE_DATA } from '../../data/muscleData';

export type VisualMode = 'anatomic' | 'xray' | 'neon';

interface BodyCanvasProps {
  selectedMuscleId: string | null;
  onSelectMuscle: (muscleId: string | null) => void;
  activePresetView: keyof typeof CAMERA_PRESETS | null;
  visualMode: VisualMode;
  autoRotate: boolean;
  highlightedMuscleIds?: string[]; // for split view or multi-target
}

export const BodyCanvas: React.FC<BodyCanvasProps> = ({
  selectedMuscleId,
  onSelectMuscle,
  activePresetView,
  visualMode,
  autoRotate,
  highlightedMuscleIds = [],
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Mouse hover state for 3D tooltip
  const [hoveredMuscle, setHoveredMuscle] = useState<{
    id: string;
    name: string;
    latinName: string;
    x: number;
    y: number;
  } | null>(null);

  // References to keep mutable Three.js objects without triggering re-mounts
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const anatomyGraphRef = useRef<AnatomySceneGraph | null>(null);

  // Target camera positions for smooth dampening
  const targetCamPos = useRef<THREE.Vector3>(CAMERA_PRESETS.front.pos.clone());
  const targetLookAt = useRef<THREE.Vector3>(CAMERA_PRESETS.front.target.clone());
  const isTransitioningCamera = useRef<boolean>(false);

  // Keep latest props in refs for animation loop
  const propsRef = useRef({
    selectedMuscleId,
    visualMode,
    autoRotate,
    highlightedMuscleIds,
  });

  useEffect(() => {
    propsRef.current = {
      selectedMuscleId,
      visualMode,
      autoRotate,
      highlightedMuscleIds,
    };
  }, [selectedMuscleId, visualMode, autoRotate, highlightedMuscleIds]);

  // Handle camera view preset changes
  useEffect(() => {
    if (activePresetView && CAMERA_PRESETS[activePresetView]) {
      const preset = CAMERA_PRESETS[activePresetView];
      targetCamPos.current.copy(preset.pos);
      targetLookAt.current.copy(preset.target);
      isTransitioningCamera.current = true;
    }
  }, [activePresetView]);

  // Main Three.js initialization effect
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL as per Three.js skill guidelines
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070a13);
    scene.fog = new THREE.FogExp2(0x070a13, 0.08);
    sceneRef.current = scene;

    // 2. Camera
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.copy(CAMERA_PRESETS.front.pos);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Environment Lighting (RoomEnvironment PMREM)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Studio 3-Point Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x111625, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(3.5, 5, 4.5);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2); // Cool cyan rim
    rimLight.position.set(-4, 3.5, -4);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xf472b6, 0.6); // Warm magenta rim
    fillLight.position.set(4, 2, -3.5);
    scene.add(fillLight);

    // Floor grid pattern for spatial depth
    const gridHelper = new THREE.GridHelper(10, 20, 0x1e293b, 0x0f172a);
    gridHelper.position.y = 0.001;
    scene.add(gridHelper);

    // 6. Musculoskeletal Model
    const anatomy = buildMusculoskeletalModel();
    scene.add(anatomy.rootGroup);
    anatomyGraphRef.current = anatomy;

    // 7. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.4;
    controls.maxDistance = 8.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // Prevent camera sinking under floor
    controls.target.copy(CAMERA_PRESETS.front.target);
    controlsRef.current = controls;

    // Cancel scripted camera transition when user interacts with mouse
    controls.addEventListener('start', () => {
      isTransitioningCamera.current = false;
    });

    // 8. Raycasting Setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getRaycastMuscle = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(anatomy.muscleMeshes, false);
      if (intersects.length > 0) {
        const topHit = intersects[0].object as THREE.Mesh;
        if (topHit.userData?.muscleId) {
          return {
            muscleId: topHit.userData.muscleId as string,
            clientX: event.clientX,
            clientY: event.clientY,
          };
        }
      }
      return null;
    };

    let hoveredId: string | null = null;

    const handlePointerMove = (e: MouseEvent) => {
      const hit = getRaycastMuscle(e);
      if (hit) {
        if (hoveredId !== hit.muscleId) {
          hoveredId = hit.muscleId;
          const data = MUSCLE_DATA[hit.muscleId];
          if (data) {
            setHoveredMuscle({
              id: hit.muscleId,
              name: data.name,
              latinName: data.latinName,
              x: hit.clientX,
              y: hit.clientY,
            });
          }
        } else if (hoveredMuscle) {
          setHoveredMuscle((prev) =>
            prev ? { ...prev, x: hit.clientX, y: hit.clientY } : null
          );
        }
        renderer.domElement.style.cursor = 'pointer';
      } else {
        if (hoveredId !== null) {
          hoveredId = null;
          setHoveredMuscle(null);
          renderer.domElement.style.cursor = 'grab';
        }
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      // Only handle left clicks
      if (e.button !== 0) return;
      const hit = getRaycastMuscle(e);
      if (hit) {
        onSelectMuscle(hit.muscleId);
      }
    };

    renderer.domElement.addEventListener('mousemove', handlePointerMove);
    renderer.domElement.addEventListener('mousedown', handlePointerDown);

    // 9. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 10. Animation Loop
    let animationFrameId = 0;
    const clock = new THREE.Clock();

    function animate() {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Camera preset smooth damping transition
      if (isTransitioningCamera.current) {
        camera.position.lerp(targetCamPos.current, 0.08);
        controls.target.lerp(targetLookAt.current, 0.08);

        if (
          camera.position.distanceTo(targetCamPos.current) < 0.02 &&
          controls.target.distanceTo(targetLookAt.current) < 0.02
        ) {
          camera.position.copy(targetCamPos.current);
          controls.target.copy(targetLookAt.current);
          isTransitioningCamera.current = false;
        }
      }

      // Auto rotation turntable
      if (propsRef.current.autoRotate && !isTransitioningCamera.current) {
        anatomy.rootGroup.rotation.y += delta * 0.45;
      }

      // Update muscle materials & glowing shaders
      const activeId = propsRef.current.selectedMuscleId;
      const multiHighlights = propsRef.current.highlightedMuscleIds;
      const mode = propsRef.current.visualMode;

      // Pulse factor for selected muscle
      const pulse = 0.65 + 0.35 * Math.sin(elapsedTime * 4.0);

      anatomy.muscleMeshes.forEach((mesh) => {
        const mId = mesh.userData.muscleId;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const isSelected = mId === activeId;
        const isHovered = mId === hoveredId;
        const isHighlightedInSplit =
          multiHighlights.length > 0 && multiHighlights.includes(mId);

        if (mode === 'xray') {
          // Holographic X-Ray mode
          mat.map = null;
          mat.normalMap = null;
          mat.wireframe = !isSelected && !isHovered && !isHighlightedInSplit;
          mat.transparent = true;
          mat.opacity = isSelected || isHovered ? 0.95 : 0.28;

          if (isSelected) {
            mat.emissive.set(mesh.userData.originalGlow || 0x06b6d4);
            mat.emissiveIntensity = 1.4 * pulse;
          } else if (isHovered) {
            mat.emissive.set(0x38bdf8);
            mat.emissiveIntensity = 0.8;
          } else if (isHighlightedInSplit) {
            mat.emissive.set(mesh.userData.originalColor || 0x06b6d4);
            mat.emissiveIntensity = 0.6;
          } else {
            mat.emissive.set(0x0f172a);
            mat.emissiveIntensity = 0.1;
          }
        } else if (mode === 'neon') {
          // High-contrast neon mode
          mat.map = null;
          mat.normalMap = null;
          mat.wireframe = false;
          mat.transparent = false;
          mat.opacity = 1.0;

          if (isSelected) {
            mat.color.set(mesh.userData.originalColor);
            mat.emissive.set(mesh.userData.originalGlow);
            mat.emissiveIntensity = 1.6 * pulse;
          } else if (isHovered) {
            mat.color.set(mesh.userData.originalColor);
            mat.emissive.set(0xffffff);
            mat.emissiveIntensity = 0.7;
          } else if (isHighlightedInSplit) {
            mat.color.set(mesh.userData.originalColor);
            mat.emissive.set(mesh.userData.originalColor);
            mat.emissiveIntensity = 0.7;
          } else {
            mat.color.set(0x1e293b);
            mat.emissive.set(0x000000);
            mat.emissiveIntensity = 0;
          }
        } else {
          // 'anatomic' Realistic Human Muscle Texture Mode
          mat.wireframe = false;
          mat.transparent = false;
          mat.opacity = 1.0;
          mat.map = anatomy.muscleAlbedoTexture;
          mat.normalMap = anatomy.muscleNormalTexture;
          mat.roughnessMap = anatomy.muscleRoughnessTexture;

          if (isSelected) {
            // Keep full muscle texture, add pulsating bio-kinetic emissive accent
            mat.color.set(0xffffff);
            mat.emissive.set(mesh.userData.originalGlow || 0xef4444);
            mat.emissiveIntensity = 0.85 * pulse;
            mat.roughness = 0.32;
          } else if (isHovered) {
            // Subtle highlight on hover
            mat.color.set(0xffffff);
            mat.emissive.set(0xffffff);
            mat.emissiveIntensity = 0.28;
            mat.roughness = 0.35;
          } else if (isHighlightedInSplit) {
            // Highlighted in active split
            mat.color.set(0xffffff);
            mat.emissive.set(mesh.userData.originalColor || 0x38bdf8);
            mat.emissiveIntensity = 0.45;
            mat.roughness = 0.38;
          } else if (activeId || multiHighlights.length > 0) {
            // Subtle dim on unfocused muscles while preserving realistic muscle fibers
            mat.color.set(0x9a9a9a);
            mat.emissive.set(0x000000);
            mat.emissiveIntensity = 0;
            mat.roughness = 0.45;
          } else {
            // Natural pristine human muscle texture
            mat.color.set(0xffffff);
            mat.emissive.set(0x000000);
            mat.emissiveIntensity = 0;
            mat.roughness = 0.38;
          }
        }
      });

      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('mousemove', handlePointerMove);
      renderer.domElement.removeEventListener('mousedown', handlePointerDown);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      anatomy.muscleAlbedoTexture.dispose();
      anatomy.muscleNormalTexture.dispose();
      anatomy.muscleRoughnessTexture.dispose();
      anatomy.boneTexture.dispose();
    };
  }, [onSelectMuscle]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#070a13]">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Hover Tooltip */}
      {hoveredMuscle && (
        <div
          className="fixed pointer-events-none z-40 transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2 bg-slate-900/95 border border-cyan-500/50 rounded-xl shadow-xl backdrop-blur-md transition-all duration-75"
          style={{
            left: `${hoveredMuscle.x}px`,
            top: `${hoveredMuscle.y - 12}px`,
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <span className="text-sm font-semibold text-white tracking-wide">
              {hoveredMuscle.name}
            </span>
          </div>
          <div className="text-[11px] font-mono text-cyan-300/80 mt-0.5">
            {hoveredMuscle.latinName}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
            <span>Click to view exercise guide &amp; anatomy</span>
          </div>
        </div>
      )}
    </div>
  );
};
