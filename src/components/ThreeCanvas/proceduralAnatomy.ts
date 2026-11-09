import * as THREE from 'three';
import { MUSCLE_DATA } from '../../data/muscleData';

/**
 * Procedural high-resolution human muscle albedo/color texture.
 * Features realistic deep myoglobin red/crimson fibers, longitudinal fascicle bundles,
 * glistening silvery-white collagen tendon aponeuroses, micro-vascularity, and sarcomere striations.
 */
export function createHumanMuscleAlbedoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // 1. Base anatomical muscle belly gradient (deep crimson & burgundy)
    const baseGrad = ctx.createLinearGradient(0, 0, 1024, 1024);
    baseGrad.addColorStop(0, '#580c13');
    baseGrad.addColorStop(0.25, '#851a23');
    baseGrad.addColorStop(0.5, '#a6242f');
    baseGrad.addColorStop(0.75, '#8d1c25');
    baseGrad.addColorStop(1, '#5e0e15');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, 1024, 1024);

    // 2. Longitudinal muscle fascicles / fiber bundles (running vertically along muscle length)
    for (let x = 0; x < 1024; x += 3) {
      const sinWave = Math.sin(x * 0.04) * 40;
      const redVal = 135 + Math.floor(sinWave + Math.random() * 55);
      const greenVal = 20 + Math.floor(Math.random() * 28);
      const blueVal = 25 + Math.floor(Math.random() * 30);
      const alpha = 0.35 + Math.random() * 0.55;

      ctx.strokeStyle = `rgba(${redVal}, ${greenVal}, ${blueVal}, ${alpha})`;
      ctx.lineWidth = 1.2 + Math.random() * 2.8;

      ctx.beginPath();
      ctx.moveTo(x, 0);
      const cx1 = x + Math.sin(x * 0.07) * 14;
      const cx2 = x - Math.cos(x * 0.07) * 14;
      ctx.bezierCurveTo(cx1, 340, cx2, 680, x, 1024);
      ctx.stroke();
    }

    // 3. Dense myoglobin micro-striations (individual microscopic fibrils)
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const len = 70 + Math.random() * 260;
      ctx.strokeStyle =
        Math.random() > 0.45
          ? 'rgba(220, 60, 72, 0.45)'
          : 'rgba(65, 8, 14, 0.55)';
      ctx.lineWidth = 1 + Math.random() * 1.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 3, y + len);
      ctx.stroke();
    }

    // 4. White / silvery collagen tendon sheaths & aponeurosis bands
    // Anatomical muscles have glistening white/ivory connective tissue at ends & inscriptions
    for (let band = 0; band < 4; band++) {
      const cy = 130 + band * 250;
      const fasciaGrad = ctx.createLinearGradient(0, cy - 40, 0, cy + 40);
      fasciaGrad.addColorStop(0, 'rgba(238, 243, 250, 0)');
      fasciaGrad.addColorStop(0.35, 'rgba(238, 243, 250, 0.65)');
      fasciaGrad.addColorStop(0.65, 'rgba(238, 243, 250, 0.65)');
      fasciaGrad.addColorStop(1, 'rgba(238, 243, 250, 0)');

      ctx.fillStyle = fasciaGrad;
      ctx.beginPath();
      ctx.ellipse(
        512,
        cy,
        490,
        28 + Math.random() * 16,
        (Math.random() - 0.5) * 0.08,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Fine tendon fibrils inside fascia
      for (let f = 0; f < 45; f++) {
        const fx = Math.random() * 1024;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1 + Math.random();
        ctx.beginPath();
        ctx.moveTo(fx, cy - 25);
        ctx.lineTo(fx + (Math.random() - 0.5) * 15, cy + 25);
        ctx.stroke();
      }
    }

    // 5. Transverse cross-striations (sarcomere Z-line microscopic banding)
    for (let y = 0; y < 1024; y += 4) {
      ctx.fillStyle = 'rgba(35, 5, 8, 0.14)';
      ctx.fillRect(0, y, 1024, 1.5);
    }

    // 6. Micro-capillary vascular branching across muscle belly
    for (let v = 0; v < 10; v++) {
      let vx = Math.random() * 1024;
      let vy = Math.random() * 1024;
      ctx.strokeStyle = 'rgba(125, 12, 22, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(vx, vy);
      for (let s = 0; s < 6; s++) {
        vx += (Math.random() - 0.5) * 45;
        vy += 20 + Math.random() * 35;
        ctx.lineTo(vx, vy);
      }
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.5, 3);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural normal / 3D striation map for organic muscle fibers
 */
export function createHumanMuscleNormalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Normal map base: RGB(128, 128, 255) represents flat surface pointing +Z
    ctx.fillStyle = '#8080ff';
    ctx.fillRect(0, 0, 1024, 1024);

    // Longitudinal fascicle fiber grooves
    for (let x = 0; x < 1024; x += 4) {
      const slope = Math.sin(x * 0.12) * 38;
      const r = Math.min(255, Math.max(0, 128 + slope));
      ctx.fillStyle = `rgb(${r}, 128, 255)`;
      ctx.fillRect(x, 0, 2, 1024);
    }

    // Horizontal sarcomere cross-striation grooves
    for (let y = 0; y < 1024; y += 6) {
      const slopeY = Math.sin(y * 0.22) * 28;
      const g = Math.min(255, Math.max(0, 128 + slopeY));
      ctx.fillStyle = `rgba(128, ${g}, 255, 0.45)`;
      ctx.fillRect(0, y, 1024, 2);
    }

    // Tendon intersection bevels
    for (let band = 0; band < 4; band++) {
      const cy = 130 + band * 250;
      ctx.fillStyle = 'rgba(115, 148, 255, 0.35)';
      ctx.fillRect(0, cy - 10, 1024, 20);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.5, 3);
  return texture;
}

/**
 * Procedural organic roughness map:
 * Gives living muscle tissue an organic wet sheen along the muscle belly,
 * while tendon aponeurosis sheaths have a matte fibrous response.
 */
export function createHumanMuscleRoughnessTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Darker = shinier/glossier (muscle belly ~ 0.3 roughness)
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, 512, 512);

    // Fascicle streaks
    for (let x = 0; x < 512; x += 4) {
      const val = 70 + Math.floor(Math.random() * 40);
      ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
      ctx.fillRect(x, 0, 2, 512);
    }

    // Matte tendon bands (lighter = rougher, ~0.7 roughness)
    for (let band = 0; band < 4; band++) {
      const cy = 65 + band * 125;
      const grad = ctx.createLinearGradient(0, cy - 25, 0, cy + 25);
      grad.addColorStop(0, 'rgba(85, 85, 85, 0)');
      grad.addColorStop(0.5, 'rgba(180, 180, 180, 0.7)');
      grad.addColorStop(1, 'rgba(85, 85, 85, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, cy - 25, 512, 50);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.5, 3);
  return texture;
}

/**
 * Procedural realistic bone / ivory skeletal texture for cranium, ribs, and joints
 */
export function createOsseousBoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Warm ivory base
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#e5decb');
    grad.addColorStop(0.5, '#eee8db');
    grad.addColorStop(1, '#dad1be');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Cortical bone grain
    for (let i = 0; i < 2400; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      ctx.fillStyle =
        Math.random() > 0.5
          ? 'rgba(180, 168, 145, 0.18)'
          : 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(x, y, 1.5, 1.5);
    }

    // Subtle osteon ring structures
    for (let c = 0; c < 15; c++) {
      const cx = Math.random() * 512;
      const cy = Math.random() * 512;
      ctx.strokeStyle = 'rgba(165, 150, 125, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 12 + Math.random() * 20, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural radial contact shadow texture
 */
export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    gradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.38)');
    gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export interface AnatomySceneGraph {
  rootGroup: THREE.Group;
  muscleMeshes: THREE.Mesh[];
  muscleMeshMap: Map<string, THREE.Mesh[]>; // muscleId -> meshes
  bodyBaseMeshes: THREE.Mesh[];
  muscleAlbedoTexture: THREE.CanvasTexture;
  muscleNormalTexture: THREE.CanvasTexture;
  muscleRoughnessTexture: THREE.CanvasTexture;
  boneTexture: THREE.CanvasTexture;
  contactShadowMesh: THREE.Mesh;
}

/**
 * Builds the high-fidelity procedural 3D human musculoskeletal model
 */
export function buildMusculoskeletalModel(): AnatomySceneGraph {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'MusculoskeletalRig';

  const muscleMeshes: THREE.Mesh[] = [];
  const muscleMeshMap = new Map<string, THREE.Mesh[]>();
  const bodyBaseMeshes: THREE.Mesh[] = [];

  // Textures
  const muscleAlbedoTexture = createHumanMuscleAlbedoTexture();
  const muscleNormalTexture = createHumanMuscleNormalTexture();
  const muscleRoughnessTexture = createHumanMuscleRoughnessTexture();
  const boneTexture = createOsseousBoneTexture();

  // Helper to register a muscle mesh
  const registerMuscle = (mesh: THREE.Mesh, muscleId: string) => {
    mesh.userData = {
      isMuscle: true,
      muscleId: muscleId,
      originalColor: MUSCLE_DATA[muscleId]?.accentColor || '#ef4444',
      originalGlow: MUSCLE_DATA[muscleId]?.glowColor || '#f87171',
    };
    muscleMeshes.push(mesh);
    if (!muscleMeshMap.has(muscleId)) {
      muscleMeshMap.set(muscleId, []);
    }
    muscleMeshMap.get(muscleId)!.push(mesh);
    rootGroup.add(mesh);
  };

  // Helper to register structural/bone/neutral anatomy base mesh
  const registerBase = (mesh: THREE.Mesh) => {
    mesh.userData = { isBase: true };
    bodyBaseMeshes.push(mesh);
    rootGroup.add(mesh);
  };

  // Realistic osseous bone material
  const osseousBoneMat = new THREE.MeshStandardMaterial({
    map: boneTexture,
    color: 0xffffff,
    roughness: 0.55,
    metalness: 0.08,
  });

  // Anatomical human muscle material
  const createMuscleMaterial = () =>
    new THREE.MeshStandardMaterial({
      map: muscleAlbedoTexture,
      normalMap: muscleNormalTexture,
      normalScale: new THREE.Vector2(0.85, 0.85),
      roughnessMap: muscleRoughnessTexture,
      roughness: 0.38,
      metalness: 0.1,
      color: 0xffffff, // pristine full color texture
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0,
    });

  // ==========================================
  // 1. HEAD, NECK & CRANIAL STRUCTURE (y: 3.1 - 3.8)
  // ==========================================
  // Cranium
  const craniumGeo = new THREE.SphereGeometry(0.24, 24, 20);
  craniumGeo.scale(0.85, 1.15, 0.95);
  const craniumMesh = new THREE.Mesh(craniumGeo, osseousBoneMat);
  craniumMesh.position.set(0, 3.48, 0.02);
  craniumMesh.castShadow = true;
  registerBase(craniumMesh);

  // Jaw / Mandible contour
  const jawGeo = new THREE.CylinderGeometry(0.12, 0.09, 0.16, 12);
  const jawMesh = new THREE.Mesh(jawGeo, osseousBoneMat);
  jawMesh.position.set(0, 3.25, 0.06);
  jawMesh.rotation.x = 0.2;
  registerBase(jawMesh);

  // Cervical Spine / Deep Neck Core
  const neckCoreGeo = new THREE.CylinderGeometry(0.11, 0.13, 0.22, 16);
  const neckCoreMesh = new THREE.Mesh(neckCoreGeo, osseousBoneMat);
  neckCoreMesh.position.set(0, 3.12, 0);
  neckCoreMesh.castShadow = true;
  registerBase(neckCoreMesh);

  // ==========================================
  // 2. UPPER BACK & TRAPEZIUS (Traps)
  // ==========================================
  // Upper Trapezius (Collar along neck and upper shoulders)
  [-1, 1].forEach((side) => {
    const sideName = side === -1 ? 'left' : 'right';
    const trapUpperGeo = new THREE.CylinderGeometry(0.08, 0.16, 0.28, 12);
    trapUpperGeo.scale(0.9, 1, 0.65);
    const trapUpperMesh = new THREE.Mesh(trapUpperGeo, createMuscleMaterial());
    trapUpperMesh.position.set(side * 0.18, 3.08, -0.04);
    trapUpperMesh.rotation.z = side * -0.35;
    trapUpperMesh.rotation.x = -0.15;
    trapUpperMesh.name = `trap_upper_${sideName}`;
    registerMuscle(trapUpperMesh, 'trapezius');
  });

  // Mid & Lower Trapezius (Diamond back shape)
  [-1, 1].forEach((side) => {
    const sideName = side === -1 ? 'left' : 'right';
    const trapMidGeo = new THREE.BoxGeometry(0.24, 0.38, 0.06);
    const trapMidMesh = new THREE.Mesh(trapMidGeo, createMuscleMaterial());
    trapMidMesh.position.set(side * 0.12, 2.78, -0.16);
    trapMidMesh.rotation.y = side * 0.1;
    trapMidMesh.rotation.z = side * 0.15;
    trapMidMesh.name = `trap_mid_${sideName}`;
    registerMuscle(trapMidMesh, 'trapezius');
  });

  // ==========================================
  // 3. CHEST / PECTORALS (Pectoralis Major)
  // ==========================================
  [-1, 1].forEach((side) => {
    const sideName = side === -1 ? 'left' : 'right';
    // Mid/Lower Sternal Head (fan plate)
    const pecGeo = new THREE.BoxGeometry(0.34, 0.26, 0.12);
    pecGeo.scale(1, 1, 0.7);
    const pecMesh = new THREE.Mesh(pecGeo, createMuscleMaterial());
    pecMesh.position.set(side * 0.22, 2.62, 0.15);
    pecMesh.rotation.y = side * -0.18;
    pecMesh.rotation.z = side * -0.08;
    pecMesh.castShadow = true;
    pecMesh.name = `chest_mid_${sideName}`;
    registerMuscle(pecMesh, 'chest');

    // Clavicular Upper Head
    const pecUpperGeo = new THREE.BoxGeometry(0.3, 0.14, 0.1);
    const pecUpperMesh = new THREE.Mesh(pecUpperGeo, createMuscleMaterial());
    pecUpperMesh.position.set(side * 0.2, 2.8, 0.14);
    pecUpperMesh.rotation.y = side * -0.15;
    pecUpperMesh.rotation.z = side * -0.15;
    pecUpperMesh.name = `chest_upper_${sideName}`;
    registerMuscle(pecUpperMesh, 'chest');
  });

  // Sternum bone center divider
  const sternumGeo = new THREE.CylinderGeometry(0.04, 0.03, 0.38, 8);
  const sternumMesh = new THREE.Mesh(sternumGeo, osseousBoneMat);
  sternumMesh.position.set(0, 2.68, 0.17);
  registerBase(sternumMesh);

  // ==========================================
  // 4. SHOULDERS / DELTOIDS
  // ==========================================
  [-1, 1].forEach((side) => {
    const sideName = side === -1 ? 'left' : 'right';
    // Lateral Deltoid (Side Cap)
    const deltLatGeo = new THREE.SphereGeometry(0.18, 16, 14);
    deltLatGeo.scale(0.85, 1.25, 1.05);
    const deltLatMesh = new THREE.Mesh(deltLatGeo, createMuscleMaterial());
    deltLatMesh.position.set(side * 0.48, 2.84, 0);
    deltLatMesh.rotation.z = side * 0.15;
    deltLatMesh.castShadow = true;
    deltLatMesh.name = `deltoid_lat_${sideName}`;
    registerMuscle(deltLatMesh, 'deltoids');

    // Anterior Deltoid (Front Head)
    const deltAntGeo = new THREE.SphereGeometry(0.14, 14, 12);
    deltAntGeo.scale(0.8, 1.15, 1.1);
    const deltAntMesh = new THREE.Mesh(deltAntGeo, createMuscleMaterial());
    deltAntMesh.position.set(side * 0.42, 2.82, 0.12);
    deltAntMesh.name = `deltoid_ant_${sideName}`;
    registerMuscle(deltAntMesh, 'deltoids');

    // Posterior Deltoid (Rear Head)
    const deltPostGeo = new THREE.SphereGeometry(0.14, 14, 12);
    deltPostGeo.scale(0.85, 1.15, 1.1);
    const deltPostMesh = new THREE.Mesh(deltPostGeo, createMuscleMaterial());
    deltPostMesh.position.set(side * 0.42, 2.82, -0.12);
    deltPostMesh.name = `deltoid_post_${sideName}`;
    registerMuscle(deltPostMesh, 'deltoids');
  });

  // ==========================================
  // 5. ARMS: BICEPS, TRICEPS & FOREARMS
  // ==========================================
  [-1, 1].forEach((side) => {
    const sideName = side === -1 ? 'left' : 'right';
    const armX = side * 0.52;

    // Humerus Bone Core
    const humerusGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.48, 10);
    const humerusMesh = new THREE.Mesh(humerusGeo, osseousBoneMat);
    humerusMesh.position.set(armX, 2.45, 0);
    registerBase(humerusMesh);

    // Biceps Brachii (Front of upper arm)
    const bicepGeo = new THREE.SphereGeometry(0.13, 16, 14);
    bicepGeo.scale(0.8, 1.6, 0.9);
    const bicepMesh = new THREE.Mesh(bicepGeo, createMuscleMaterial());
    bicepMesh.position.set(side * 0.51, 2.44, 0.08);
    bicepMesh.rotation.y = side * 0.2;
    bicepMesh.name = `bicep_${sideName}`;
    registerMuscle(bicepMesh, 'biceps');

    // Triceps Brachii (Back of upper arm horseshoe)
    const tricepGeo = new THREE.BoxGeometry(0.18, 0.42, 0.16);
    tricepGeo.scale(0.9, 1, 0.95);
    const tricepMesh = new THREE.Mesh(tricepGeo, createMuscleMaterial());
    tricepMesh.position.set(side * 0.52, 2.46, -0.07);
    tricepMesh.name = `tricep_${sideName}`;
    registerMuscle(tricepMesh, 'triceps');

    // Elbow Joint Bone
    const elbowGeo = new THREE.SphereGeometry(0.065, 10, 10);
    const elbowMesh = new THREE.Mesh(elbowGeo, osseousBoneMat);
    elbowMesh.position.set(armX, 2.18, 0);
    registerBase(elbowMesh);

    // Forearm Muscle Complex (Brachioradialis / Flexors / Extensors)
    const forearmGeo = new THREE.CylinderGeometry(0.11, 0.06, 0.44, 14);
    forearmGeo.scale(1.1, 1, 0.85);
    const forearmMesh = new THREE.Mesh(forearmGeo, createMuscleMaterial());
    forearmMesh.position.set(armX + side * 0.03, 1.94, 0.03);
    forearmMesh.rotation.z = side * -0.08;
    forearmMesh.castShadow = true;
    forearmMesh.name = `forearm_${sideName}`;
    registerMuscle(forearmMesh, 'forearms');

    // Wrist & Hand Base
    const handGeo = new THREE.BoxGeometry(0.09, 0.18, 0.04);
    const handMesh = new THREE.Mesh(handGeo, osseousBoneMat);
    handMesh.position.set(armX + side * 0.05, 1.66, 0.03);
    registerBase(handMesh);
  });

  // ==========================================
  // 6. CORE: RECTUS ABDOMINIS & OBLIQUES
  // ==========================================
  // Rectus Abdominis (6-Pack segments with tendinous inscriptions)
  const packPositionsY = [2.44, 2.28, 2.12];
  packPositionsY.forEach((posY, packIdx) => {
    [-1, 1].forEach((side) => {
      const sideName = side === -1 ? 'left' : 'right';
      const absGeo = new THREE.BoxGeometry(0.14, 0.12, 0.06);
      absGeo.scale(1, 1, 0.9);
      const absMesh = new THREE.Mesh(absGeo, createMuscleMaterial());
      absMesh.position.set(side * 0.09, posY, 0.165);
      absMesh.rotation.y = side * -0.08;
      absMesh.name = `abs_pack_${packIdx}_${sideName}`;
      registerMuscle(absMesh, 'abs');
    });
  });

  // External Obliques & Serratus Anterior (Torso flanks)
  [-1, 1].forEach((side) => {
    const sideName = side === -1 ? 'left' : 'right';
    const obliqueGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.52, 12);
    obliqueGeo.scale(0.85, 1, 1.25);
    const obliqueMesh = new THREE.Mesh(obliqueGeo, createMuscleMaterial());
    obliqueMesh.position.set(side * 0.28, 2.25, 0.05);
    obliqueMesh.rotation.z = side * 0.12;
    obliqueMesh.name = `oblique_${sideName}`;
    registerMuscle(obliqueMesh, 'obliques');
  });

  // ==========================================
  // 7. BACK: LATISSIMUS DORSI & ERECTOR SPINAE
  // ==========================================
  // Latissimus Dorsi (V-Taper back wings)
  [-1, 1].forEach((side) => {
    const sideName = side === -1 ? 'left' : 'right';
    const latGeo = new THREE.BoxGeometry(0.26, 0.54, 0.08);
    latGeo.scale(1, 1, 0.85);
    const latMesh = new THREE.Mesh(latGeo, createMuscleMaterial());
    latMesh.position.set(side * 0.27, 2.45, -0.14);
    latMesh.rotation.y = side * 0.28;
    latMesh.rotation.z = side * -0.16;
    latMesh.castShadow = true;
    latMesh.name = `lat_${sideName}`;
    registerMuscle(latMesh, 'lats');
  });

  // Erector Spinae (Lower back spinal columns)
  [-1, 1].forEach((side) => {
    const sideName = side === -1 ? 'left' : 'right';
    const erectorGeo = new THREE.CylinderGeometry(0.065, 0.085, 0.46, 10);
    const erectorMesh = new THREE.Mesh(erectorGeo, createMuscleMaterial());
    erectorMesh.position.set(side * 0.08, 2.14, -0.145);
    erectorMesh.name = `erector_${sideName}`;
    registerMuscle(erectorMesh, 'lower_back');
  });

  // Spinal Column Core
  const spineCoreGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.82, 10);
  const spineCoreMesh = new THREE.Mesh(spineCoreGeo, osseousBoneMat);
  spineCoreMesh.position.set(0, 2.48, -0.08);
  registerBase(spineCoreMesh);

  // Pelvis / Sacrum base structure
  const pelvisGeo = new THREE.CylinderGeometry(0.24, 0.19, 0.24, 16);
  pelvisGeo.scale(1.2, 1, 0.85);
  const pelvisMesh = new THREE.Mesh(pelvisGeo, osseousBoneMat);
  pelvisMesh.position.set(0, 1.9, 0);
  registerBase(pelvisMesh);

  // ==========================================
  // 8. HIPS & GLUTEUS MAXIMUS / MEDIUS
  // ==========================================
  [-1, 1].forEach((side) => {
    const sideName = side === -1 ? 'left' : 'right';
    const gluteGeo = new THREE.SphereGeometry(0.21, 16, 14);
    gluteGeo.scale(0.9, 1.15, 1.1);
    const gluteMesh = new THREE.Mesh(gluteGeo, createMuscleMaterial());
    gluteMesh.position.set(side * 0.16, 1.82, -0.12);
    gluteMesh.rotation.y = side * 0.15;
    gluteMesh.rotation.x = -0.1;
    gluteMesh.castShadow = true;
    gluteMesh.name = `glute_${sideName}`;
    registerMuscle(gluteMesh, 'glutes');
  });

  // ==========================================
  // 9. THIGHS: QUADRICEPS & HAMSTRINGS
  // ==========================================
  [-1, 1].forEach((side) => {
    const sideName = side === -1 ? 'left' : 'right';
    const legX = side * 0.19;

    // Femur Bone Core
    const femurGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.72, 12);
    const femurMesh = new THREE.Mesh(femurGeo, osseousBoneMat);
    femurMesh.position.set(legX, 1.42, 0);
    registerBase(femurMesh);

    // Quadriceps Complex (Front thigh: Vastus Lateralis + Rectus Femoris + Teardrop Medialis)
    const quadGeo = new THREE.CylinderGeometry(0.18, 0.13, 0.68, 16);
    quadGeo.scale(1.05, 1, 0.95);
    const quadMesh = new THREE.Mesh(quadGeo, createMuscleMaterial());
    quadMesh.position.set(legX, 1.42, 0.06);
    quadMesh.rotation.y = side * -0.12;
    quadMesh.castShadow = true;
    quadMesh.name = `quad_${sideName}`;
    registerMuscle(quadMesh, 'quads');

    // Vastus Medialis (Teardrop contour just above inner knee)
    const vmGeo = new THREE.SphereGeometry(0.1, 12, 10);
    vmGeo.scale(0.8, 1.3, 0.9);
    const vmMesh = new THREE.Mesh(vmGeo, createMuscleMaterial());
    vmMesh.position.set(legX - side * 0.05, 1.15, 0.08);
    vmMesh.name = `quad_teardrop_${sideName}`;
    registerMuscle(vmMesh, 'quads');

    // Hamstrings Complex (Posterior thigh: Biceps femoris & Semis)
    const hamGeo = new THREE.CylinderGeometry(0.16, 0.12, 0.62, 14);
    hamGeo.scale(0.95, 1, 1.05);
    const hamMesh = new THREE.Mesh(hamGeo, createMuscleMaterial());
    hamMesh.position.set(legX, 1.44, -0.08);
    hamMesh.rotation.y = side * 0.1;
    hamMesh.name = `hamstring_${sideName}`;
    registerMuscle(hamMesh, 'hamstrings');

    // Patella / Knee Joint
    const kneeGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const kneeMesh = new THREE.Mesh(kneeGeo, osseousBoneMat);
    kneeMesh.position.set(legX, 1.02, 0.04);
    registerBase(kneeMesh);
  });

  // ==========================================
  // 10. LOWER LEGS: CALVES, SHINS & FEET
  // ==========================================
  [-1, 1].forEach((side) => {
    const sideName = side === -1 ? 'left' : 'right';
    const legX = side * 0.19;

    // Tibia / Fibula Bone Core
    const shinBoneGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.82, 10);
    const shinBoneMesh = new THREE.Mesh(shinBoneGeo, osseousBoneMat);
    shinBoneMesh.position.set(legX, 0.55, 0);
    registerBase(shinBoneMesh);

    // Calves (Gastrocnemius diamond bellies & Soleus)
    const calfGeo = new THREE.SphereGeometry(0.14, 16, 14);
    calfGeo.scale(0.9, 1.8, 1.15);
    const calfMesh = new THREE.Mesh(calfGeo, createMuscleMaterial());
    calfMesh.position.set(legX, 0.66, -0.06);
    calfMesh.rotation.x = -0.1;
    calfMesh.castShadow = true;
    calfMesh.name = `calf_${sideName}`;
    registerMuscle(calfMesh, 'calves');

    // Ankle Joint
    const ankleGeo = new THREE.CylinderGeometry(0.055, 0.05, 0.14, 10);
    const ankleMesh = new THREE.Mesh(ankleGeo, osseousBoneMat);
    ankleMesh.position.set(legX, 0.14, 0);
    registerBase(ankleMesh);

    // Foot (Grounded on y = 0)
    const footGeo = new THREE.BoxGeometry(0.12, 0.08, 0.28);
    const footMesh = new THREE.Mesh(footGeo, osseousBoneMat);
    footMesh.position.set(legX, 0.04, 0.06);
    registerBase(footMesh);
  });

  // ==========================================
  // 11. GROUND CONTACT SHADOW DISK
  // ==========================================
  const shadowGeo = new THREE.PlaneGeometry(2.4, 2.4);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: createContactShadowTexture(),
    transparent: true,
    depthWrite: false,
    opacity: 0.7,
  });
  const contactShadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  contactShadowMesh.rotation.x = -Math.PI / 2;
  contactShadowMesh.position.set(0, 0.002, 0);
  rootGroup.add(contactShadowMesh);

  return {
    rootGroup,
    muscleMeshes,
    muscleMeshMap,
    bodyBaseMeshes,
    muscleAlbedoTexture,
    muscleNormalTexture,
    muscleRoughnessTexture,
    boneTexture,
    contactShadowMesh,
  };
}

/**
 * Camera View Angles
 */
export const CAMERA_PRESETS = {
  front: { pos: new THREE.Vector3(0, 2.0, 4.3), target: new THREE.Vector3(0, 1.9, 0) },
  back: { pos: new THREE.Vector3(0, 2.0, -4.3), target: new THREE.Vector3(0, 1.9, 0) },
  left: { pos: new THREE.Vector3(-4.2, 2.0, 0), target: new THREE.Vector3(0, 1.9, 0) },
  right: { pos: new THREE.Vector3(4.2, 2.0, 0), target: new THREE.Vector3(0, 1.9, 0) },
  upper: { pos: new THREE.Vector3(0, 2.5, 2.6), target: new THREE.Vector3(0, 2.5, 0) },
  lower: { pos: new THREE.Vector3(0, 1.1, 2.8), target: new THREE.Vector3(0, 1.1, 0) },
  iso: { pos: new THREE.Vector3(2.8, 2.8, 3.2), target: new THREE.Vector3(0, 1.9, 0) },
};
