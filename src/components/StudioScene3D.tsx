import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Colorway, EquippedKit, GarmentPattern, UniformItem } from '../types/uniform';
import { UniformThumbnail } from './UniformThumbnail';

interface StudioScene3DProps {
  kit: EquippedKit;
  focusTarget: 'full' | 'footwear' | 'bag';
}

const _tmpVec = new THREE.Vector3();

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
  grad.addColorStop(0, 'rgba(20, 26, 38, 0.34)');
  grad.addColorStop(0.5, 'rgba(20, 26, 38, 0.14)');
  grad.addColorStop(1, 'rgba(20, 26, 38, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createFabricBumpTexture(isPuffer: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  if (isPuffer) {
    const bands = 7;
    const bandH = 256 / bands;
    for (let i = 0; i < bands; i++) {
      const y = i * bandH;
      const g = ctx.createLinearGradient(0, y, 0, y + bandH);
      g.addColorStop(0, '#3a3a3a');
      g.addColorStop(0.15, '#c8c8c8');
      g.addColorStop(0.5, '#ededed');
      g.addColorStop(0.85, '#c8c8c8');
      g.addColorStop(1, '#3a3a3a');
      ctx.fillStyle = g;
      ctx.fillRect(0, y, 256, bandH);
    }
  } else {
    ctx.fillStyle = '#9a9a9a';
    for (let y = 0; y < 256; y += 4) {
      for (let x = y % 8 === 0 ? 0 : 2; x < 256; x += 4) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  if (!isPuffer) tex.repeat.set(4, 4);
  return tex;
}

function createTopGarmentTexture(
  item: UniformItem,
  colorway: Colorway,
  squadNumber: string,
  teamName: string,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const { primary, secondary, trim } = colorway;
  const pattern: GarmentPattern = item.pattern;

  ctx.fillStyle = primary;
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  for (let y = 0; y < 512; y += 4) {
    ctx.fillRect(0, y, 512, 1);
  }

  if (pattern === 'stripes') {
    ctx.fillStyle = secondary;
    ctx.globalAlpha = 0.48;
    for (let x = 16; x < 512; x += 48) {
      ctx.fillRect(x, 0, 20, 512);
    }
    ctx.globalAlpha = 1;
  } else if (pattern === 'colorblock') {
    ctx.fillStyle = secondary;
    ctx.fillRect(0, 340, 512, 172);
    ctx.fillStyle = trim;
    ctx.fillRect(248, 0, 16, 512);
    ctx.fillRect(0, 0, 8, 512);
    ctx.fillRect(504, 0, 8, 512);
  } else if (pattern === 'chevron') {
    ctx.fillStyle = trim;
    ctx.beginPath();
    ctx.moveTo(0, 240);
    ctx.lineTo(128, 180);
    ctx.lineTo(256, 240);
    ctx.lineTo(384, 180);
    ctx.lineTo(512, 240);
    ctx.lineTo(512, 270);
    ctx.lineTo(384, 210);
    ctx.lineTo(256, 270);
    ctx.lineTo(128, 210);
    ctx.lineTo(0, 270);
    ctx.closePath();
    ctx.fill();
  } else if (pattern === 'sash') {
    ctx.fillStyle = trim;
    ctx.beginPath();
    ctx.moveTo(40, 80);
    ctx.lineTo(220, 440);
    ctx.lineTo(180, 440);
    ctx.lineTo(10, 80);
    ctx.closePath();
    ctx.fill();
  } else if (pattern === 'gradient') {
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, secondary);
    grad.addColorStop(0.55, primary);
    grad.addColorStop(1, primary);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
  } else if (pattern === 'puffer') {
    ctx.fillStyle = secondary;
    ctx.fillRect(0, 395, 512, 117);
    ctx.fillStyle = trim;
    ctx.fillRect(249, 30, 13, 430);
    ctx.fillRect(0, 30, 7, 430);
    ctx.fillRect(505, 30, 7, 430);
  }

  const frontX = 128;
  const backX = 384;

  if (item.category === 'jerseys' || item.silhouette !== 'tracksuit_puffer') {
    const cleanTeam = (teamName || 'GEMINI').toUpperCase().slice(0, 14);
    ctx.fillStyle = trim;
    ctx.font = '700 15px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(cleanTeam, frontX, 172);

    ctx.beginPath();
    ctx.arc(frontX + 32, 122, 8, 0, Math.PI * 2);
    ctx.fillStyle = trim;
    ctx.fill();
    ctx.fillStyle = secondary;
    ctx.font = '700 9px Outfit, sans-serif';
    ctx.fillText('G', frontX + 32, 123);

    if (squadNumber) {
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = secondary;
      ctx.lineWidth = 2.5;
      ctx.font = '700 28px Outfit, sans-serif';
      ctx.strokeText(squadNumber, frontX, 222);
      ctx.fillText(squadNumber, frontX, 222);
    }

    ctx.fillStyle = trim;
    ctx.font = '700 14px Outfit, sans-serif';
    ctx.fillText(cleanTeam, backX, 122);

    if (squadNumber) {
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = secondary;
      ctx.lineWidth = 4;
      ctx.font = '700 66px Outfit, sans-serif';
      ctx.strokeText(squadNumber, backX, 202);
      ctx.fillText(squadNumber, backX, 202);
    }
  } else {
    ctx.beginPath();
    ctx.arc(frontX + 32, 135, 7, 0, Math.PI * 2);
    ctx.fillStyle = trim;
    ctx.fill();
    ctx.fillStyle = secondary;
    ctx.font = '700 8px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('G', frontX + 32, 136);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

export const StudioFallback2D: React.FC<{ kit: EquippedKit }> = ({ kit }) => {
  const topSlot = kit.activeTopLayer === 'tracksuit' ? kit.tracksuit : kit.top;
  const topCw = topSlot.item.colorways[topSlot.colorwayIndex] || topSlot.item.colorways[0];
  const shoeCw =
    kit.footwear.item.colorways[kit.footwear.colorwayIndex] || kit.footwear.item.colorways[0];
  const bagCw = kit.bag.item.colorways[kit.bag.colorwayIndex] || kit.bag.item.colorways[0];

  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-none">
      <div className="relative flex flex-col items-center justify-end h-[420px] w-[260px]">
        <div className="w-48 h-48">
          <UniformThumbnail item={topSlot.item} colorway={topCw} />
        </div>
        <div className="flex items-end gap-4 -mt-4">
          {kit.showBagOnStage && (
            <div className="w-24 h-24">
              <UniformThumbnail item={kit.bag.item} colorway={bagCw} />
            </div>
          )}
          <div className="w-24 h-20">
            <UniformThumbnail item={kit.footwear.item} colorway={shoeCw} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const StudioScene3D: React.FC<StudioScene3DProps> = ({ kit, focusTarget }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglError, setWebglError] = useState(false);

  const updateSceneRef = useRef<((k: EquippedKit, focus: 'full' | 'footwear' | 'bag') => void) | null>(
    null,
  );

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'default',
      });
    } catch {
      setWebglError(true);
      return;
    }

    // Detect software WebGL from the already-created renderer context (single WebGL context)
    const isSoftwareGl = (() => {
      try {
        const gl = renderer.getContext();
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param) || '');
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(
      Math.max(container.clientWidth, 1),
      Math.max(container.clientHeight, 1),
    );
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglError(true);
    };
    const handleContextRestored = () => {
      setWebglError(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const scene = new THREE.Scene();

    let roomEnvTexture: THREE.Texture | null = null;
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const roomEnv = new RoomEnvironment();
      roomEnvTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
      scene.environment = roomEnvTexture;
      roomEnv.dispose();
      pmremGenerator.dispose();
    } catch {
      // Fallback safely to 3-point studio lighting if PMREM fails on older drivers
    }

    const camera = new THREE.PerspectiveCamera(
      34,
      Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1),
      0.1,
      50,
    );
    camera.position.set(0, 1.04, 3.65);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.92, 0);
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 2.45;
    controls.maxDistance = 4.6;
    controls.minPolarAngle = Math.PI * 0.34;
    controls.maxPolarAngle = Math.PI * 0.54;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = 0.72;
    controls.update();

    // 3-Point Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xf2f6ff, 0xa8b0be, 1.15);
    hemiLight.position.set(0, 6, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff9f0, 1.55);
    keyLight.position.set(2.8, 4.6, 3.6);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 512;
    keyLight.shadow.mapSize.height = 512;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 14;
    const sd = 1.6;
    keyLight.shadow.camera.left = -sd;
    keyLight.shadow.camera.right = sd;
    keyLight.shadow.camera.top = sd;
    keyLight.shadow.camera.bottom = -sd;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0ebff, 0.7);
    fillLight.position.set(-3.2, 2.4, 2.2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.85);
    rimLight.position.set(0.2, 3.2, -3.4);
    scene.add(rimLight);

    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.ShadowMaterial({ opacity: 0.16 }),
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    const contactTex = createContactShadowTexture();
    const athleteContactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.95, 0.68),
      new THREE.MeshBasicMaterial({
        map: contactTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.85,
      }),
    );
    athleteContactShadow.rotation.x = -Math.PI / 2;
    athleteContactShadow.position.set(0, 0.002, 0.02);
    scene.add(athleteContactShadow);

    const bagContactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.68, 0.52),
      new THREE.MeshBasicMaterial({
        map: contactTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.75,
      }),
    );
    bagContactShadow.rotation.x = -Math.PI / 2;
    bagContactShadow.position.set(-0.46, 0.002, 0.05);
    scene.add(bagContactShadow);

    // ================= MATERIALS =================
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xd9a888,
      roughness: 0.56,
      metalness: 0.02,
    });
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x201d1c,
      roughness: 0.76,
      metalness: 0.04,
    });
    const topMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.74,
      metalness: 0.04,
      bumpScale: 0.012,
    });
    const sleeveMat = new THREE.MeshStandardMaterial({
      color: 0x1e50c8,
      roughness: 0.74,
      metalness: 0.04,
    });
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0xd4ff2a,
      roughness: 0.62,
      metalness: 0.05,
    });
    const metalHardwareMat = new THREE.MeshStandardMaterial({
      color: 0xd9e0eb,
      roughness: 0.2,
      metalness: 0.88,
    });
    const bottomMat = new THREE.MeshStandardMaterial({
      color: 0x262b35,
      roughness: 0.78,
      metalness: 0.03,
    });
    const sockMat = new THREE.MeshStandardMaterial({
      color: 0xf4f5f7,
      roughness: 0.84,
      metalness: 0.0,
    });
    const shoeUpperMat = new THREE.MeshStandardMaterial({
      color: 0xe8eaee,
      roughness: 0.44,
      metalness: 0.08,
    });
    const shoeAccentMat = new THREE.MeshStandardMaterial({
      color: 0x1e232b,
      roughness: 0.48,
      metalness: 0.1,
    });
    const shoeTrimMat = new THREE.MeshStandardMaterial({
      color: 0xc8f12b,
      roughness: 0.42,
      metalness: 0.06,
    });
    const shoeSoleMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.55,
      metalness: 0.02,
    });
    const bagPrimaryMat = new THREE.MeshStandardMaterial({
      color: 0xd31c28,
      roughness: 0.46,
      metalness: 0.06,
    });
    const bagSecondaryMat = new THREE.MeshStandardMaterial({
      color: 0x24272f,
      roughness: 0.68,
      metalness: 0.08,
    });
    const bagTrimMat = new THREE.MeshStandardMaterial({
      color: 0xe6e9ef,
      roughness: 0.36,
      metalness: 0.35,
    });

    // ================= ATHLETE ROOT GROUP =================
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    const athleteGroup = new THREE.Group();
    stageGroup.add(athleteGroup);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.59, 0.01);
    athleteGroup.add(headGroup);

    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.044, 0.054, 0.1, 18),
      skinMat,
    );
    neck.position.set(0, -0.075, -0.005);
    neck.castShadow = true;
    headGroup.add(neck);

    const craniumGeo = new THREE.SphereGeometry(0.096, 22, 18);
    craniumGeo.scale(0.84, 1.08, 0.94);
    const cranium = new THREE.Mesh(craniumGeo, skinMat);
    cranium.position.set(0, 0.025, 0);
    cranium.castShadow = true;
    headGroup.add(cranium);

    const jawGeo = new THREE.CylinderGeometry(0.072, 0.046, 0.07, 18);
    jawGeo.scale(0.84, 1, 0.9);
    const jaw = new THREE.Mesh(jawGeo, skinMat);
    jaw.position.set(0, -0.025, 0.012);
    headGroup.add(jaw);

    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.032, 10), skinMat);
    nose.rotation.x = Math.PI * 0.42;
    nose.position.set(0, 0.018, 0.086);
    headGroup.add(nose);

    const hairCapGeo = new THREE.SphereGeometry(0.101, 22, 16, 0, Math.PI * 2, 0, Math.PI * 0.56);
    hairCapGeo.scale(0.86, 1.05, 0.97);
    const hairCap = new THREE.Mesh(hairCapGeo, hairMat);
    hairCap.position.set(0, 0.032, -0.008);
    hairCap.rotation.x = -0.24;
    hairCap.castShadow = true;
    headGroup.add(hairCap);

    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 0.92, 0);
    athleteGroup.add(torsoGroup);

    const torsoProfile = [
      new THREE.Vector2(0.01, 0.0),
      new THREE.Vector2(0.145, 0.015),
      new THREE.Vector2(0.142, 0.09),
      new THREE.Vector2(0.132, 0.2),
      new THREE.Vector2(0.148, 0.34),
      new THREE.Vector2(0.168, 0.48),
      new THREE.Vector2(0.16, 0.56),
      new THREE.Vector2(0.072, 0.595),
      new THREE.Vector2(0.048, 0.605),
    ];
    const torsoGeo = new THREE.LatheGeometry(torsoProfile, 28);
    torsoGeo.scale(1.16, 1.0, 0.68);
    const torsoMesh = new THREE.Mesh(torsoGeo, topMat);
    torsoMesh.rotation.y = Math.PI / 2;
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    torsoGroup.add(torsoMesh);

    const crewCollar = new THREE.Mesh(
      new THREE.TorusGeometry(0.068, 0.012, 10, 24),
      trimMat,
    );
    crewCollar.rotation.x = Math.PI / 2 + 0.12;
    crewCollar.position.set(0, 0.588, 0.01);
    crewCollar.scale.set(1.08, 0.9, 1);
    torsoGroup.add(crewCollar);

    const standCollar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.068, 0.074, 0.068, 20, 1, true),
      trimMat,
    );
    standCollar.position.set(0, 0.612, 0.005);
    standCollar.scale.set(1.06, 1, 0.85);
    torsoGroup.add(standCollar);

    const zipLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.008, 0.57, 0.014),
      metalHardwareMat,
    );
    zipLine.position.set(0, 0.31, 0.11);
    torsoGroup.add(zipLine);

    const poloCollarGroup = new THREE.Group();
    poloCollarGroup.position.set(0, 0.592, 0.015);
    const poloFlapL = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.028, 0.016), trimMat);
    poloFlapL.position.set(-0.036, 0, 0.044);
    poloFlapL.rotation.set(0.35, -0.3, -0.35);
    const poloFlapR = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.028, 0.016), trimMat);
    poloFlapR.position.set(0.036, 0, 0.044);
    poloFlapR.rotation.set(0.35, 0.3, 0.35);
    poloCollarGroup.add(poloFlapL, poloFlapR);
    torsoGroup.add(poloCollarGroup);

    const hoodCollar = new THREE.Mesh(
      new THREE.TorusGeometry(0.088, 0.032, 12, 22, Math.PI * 1.45),
      sleeveMat,
    );
    hoodCollar.rotation.set(Math.PI / 2 - 0.3, 0, Math.PI * 0.78);
    hoodCollar.position.set(0, 0.58, -0.025);
    torsoGroup.add(hoodCollar);

    function buildArm(side: -1 | 1) {
      const armGroup = new THREE.Group();
      armGroup.position.set(side * 0.21, 1.46, 0);
      armGroup.rotation.z = side * 0.095;
      athleteGroup.add(armGroup);

      const upperArmSkin = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.045, 0.22, 6, 14),
        skinMat,
      );
      upperArmSkin.position.set(0, -0.14, 0);
      upperArmSkin.castShadow = true;
      armGroup.add(upperArmSkin);

      const forearmGroup = new THREE.Group();
      forearmGroup.position.set(0, -0.27, 0);
      forearmGroup.rotation.x = -0.12;
      armGroup.add(forearmGroup);

      const forearmSkin = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.037, 0.21, 6, 14),
        skinMat,
      );
      forearmSkin.position.set(0, -0.13, 0);
      forearmSkin.castShadow = true;
      forearmGroup.add(forearmSkin);

      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 10), skinMat);
      hand.scale.set(0.75, 1.28, 0.58);
      hand.position.set(0, -0.27, 0.008);
      forearmGroup.add(hand);

      const shortSleeve = new THREE.Mesh(
        new THREE.CylinderGeometry(0.058, 0.052, 0.19, 18),
        sleeveMat,
      );
      shortSleeve.position.set(0, -0.08, 0);
      shortSleeve.castShadow = true;
      armGroup.add(shortSleeve);

      const shortCuff = new THREE.Mesh(
        new THREE.CylinderGeometry(0.054, 0.054, 0.018, 18),
        trimMat,
      );
      shortCuff.position.set(0, -0.172, 0);
      armGroup.add(shortCuff);

      const longSleeveUpper = new THREE.Mesh(
        new THREE.CylinderGeometry(0.062, 0.055, 0.27, 18),
        sleeveMat,
      );
      longSleeveUpper.position.set(0, -0.13, 0);
      longSleeveUpper.castShadow = true;
      armGroup.add(longSleeveUpper);

      const longSleeveLower = new THREE.Mesh(
        new THREE.CylinderGeometry(0.052, 0.042, 0.25, 18),
        sleeveMat,
      );
      longSleeveLower.position.set(0, -0.12, 0);
      longSleeveLower.castShadow = true;
      forearmGroup.add(longSleeveLower);

      const longCuff = new THREE.Mesh(
        new THREE.CylinderGeometry(0.043, 0.04, 0.032, 18),
        trimMat,
      );
      longCuff.position.set(0, -0.235, 0);
      forearmGroup.add(longCuff);

      return { shortSleeve, shortCuff, longSleeveUpper, longSleeveLower, longCuff };
    }

    const leftArm = buildArm(-1);
    const rightArm = buildArm(1);

    const pelvisMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.162, 0.155, 0.15, 20),
      bottomMat,
    );
    pelvisMesh.scale.set(1.12, 1, 0.72);
    pelvisMesh.position.set(0, 0.87, 0);
    pelvisMesh.castShadow = true;
    athleteGroup.add(pelvisMesh);

    function buildLeg(side: -1 | 1) {
      const legGroup = new THREE.Group();
      legGroup.position.set(side * 0.095, 0.84, 0);
      athleteGroup.add(legGroup);

      const shortsLeg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.088, 0.078, 0.28, 20),
        bottomMat,
      );
      shortsLeg.position.set(0, -0.13, 0);
      shortsLeg.castShadow = true;
      legGroup.add(shortsLeg);

      const pantsProfile = [
        new THREE.Vector2(0.052, 0.0),
        new THREE.Vector2(0.06, 0.2),
        new THREE.Vector2(0.068, 0.42),
        new THREE.Vector2(0.082, 0.62),
        new THREE.Vector2(0.092, 0.76),
      ];
      const pantsGeo = new THREE.LatheGeometry(pantsProfile, 20);
      const pantsLeg = new THREE.Mesh(pantsGeo, bottomMat);
      pantsLeg.position.set(0, -0.76, 0);
      pantsLeg.castShadow = true;
      legGroup.add(pantsLeg);

      const bareLeg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.058, 0.042, 0.46, 16),
        skinMat,
      );
      bareLeg.position.set(0, -0.44, 0);
      bareLeg.castShadow = true;
      legGroup.add(bareLeg);

      const sock = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.04, 0.2, 16),
        sockMat,
      );
      sock.position.set(0, -0.66, 0);
      sock.castShadow = true;
      legGroup.add(sock);

      const shoeGroup = new THREE.Group();
      shoeGroup.position.set(0, -0.84, 0.032);
      legGroup.add(shoeGroup);

      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.094, 0.026, 0.235), shoeSoleMat);
      sole.position.set(0, 0.015, 0.01);
      sole.castShadow = true;
      shoeGroup.add(sole);

      const outsoleTrim = new THREE.Mesh(new THREE.BoxGeometry(0.096, 0.008, 0.236), shoeTrimMat);
      outsoleTrim.position.set(0, 0.004, 0.01);
      shoeGroup.add(outsoleTrim);

      const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.044, 0.125, 6, 14), shoeUpperMat);
      upper.rotation.x = Math.PI / 2;
      upper.scale.set(1.02, 1, 0.78);
      upper.position.set(0, 0.046, 0.018);
      upper.castShadow = true;
      shoeGroup.add(upper);

      const toeCap = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.5),
        shoeAccentMat,
      );
      toeCap.scale.set(1.02, 0.75, 1.15);
      toeCap.position.set(0, 0.03, 0.088);
      shoeGroup.add(toeCap);

      const heelCounter = new THREE.Mesh(
        new THREE.CylinderGeometry(0.044, 0.046, 0.056, 14),
        shoeAccentMat,
      );
      heelCounter.position.set(0, 0.052, -0.068);
      shoeGroup.add(heelCounter);

      const highTopCollar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.046, 0.048, 0.065, 14),
        shoeUpperMat,
      );
      highTopCollar.position.set(0, 0.095, -0.046);
      shoeGroup.add(highTopCollar);

      const sideStripe = new THREE.Mesh(new THREE.BoxGeometry(0.096, 0.014, 0.095), shoeTrimMat);
      sideStripe.position.set(0, 0.046, 0.004);
      sideStripe.rotation.x = -0.14;
      shoeGroup.add(sideStripe);

      const cleatsGroup = new THREE.Group();
      const studGeo = new THREE.CylinderGeometry(0.006, 0.004, 0.012, 6);
      const studCoords: [number, number][] = [
        [-0.025, 0.08],
        [0.025, 0.08],
        [-0.028, 0.02],
        [0.028, 0.02],
        [-0.024, -0.06],
        [0.024, -0.06],
      ];
      studCoords.forEach(([sx, sz]) => {
        const stud = new THREE.Mesh(studGeo, shoeAccentMat);
        stud.position.set(sx, -0.002, sz);
        cleatsGroup.add(stud);
      });
      shoeGroup.add(cleatsGroup);

      return { shortsLeg, pantsLeg, bareLeg, sock, highTopCollar, cleatsGroup };
    }

    const leftLeg = buildLeg(-1);
    const rightLeg = buildLeg(1);

    // 6. 3D Kit Bag Group
    const bagGroup = new THREE.Group();
    bagGroup.position.set(-0.46, 0, 0.04);
    stageGroup.add(bagGroup);

    const wheelieGroup = new THREE.Group();
    bagGroup.add(wheelieGroup);

    const caseShape = new THREE.Shape();
    const cw = 0.27;
    const ch = 0.44;
    const cr = 0.035;
    caseShape.moveTo(-cw / 2 + cr, -ch / 2);
    caseShape.lineTo(cw / 2 - cr, -ch / 2);
    caseShape.quadraticCurveTo(cw / 2, -ch / 2, cw / 2, -ch / 2 + cr);
    caseShape.lineTo(cw / 2, ch / 2 - cr);
    caseShape.quadraticCurveTo(cw / 2, ch / 2, cw / 2 - cr, ch / 2);
    caseShape.lineTo(-cw / 2 + cr, ch / 2);
    caseShape.quadraticCurveTo(-cw / 2, ch / 2, -cw / 2, ch / 2 - cr);
    caseShape.lineTo(-cw / 2, -ch / 2 + cr);
    caseShape.quadraticCurveTo(-cw / 2, -ch / 2, -cw / 2 + cr, -ch / 2);

    const caseGeo = new THREE.ExtrudeGeometry(caseShape, {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.018,
      bevelSize: 0.016,
      bevelSegments: 3,
    });
    caseGeo.center();
    const caseBody = new THREE.Mesh(caseGeo, bagPrimaryMat);
    caseBody.position.set(0, 0.275, 0);
    caseBody.castShadow = true;
    caseBody.receiveShadow = true;
    wheelieGroup.add(caseBody);

    const casePocket = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.24, 0.024), bagSecondaryMat);
    casePocket.position.set(0, 0.24, 0.095);
    wheelieGroup.add(casePocket);

    const caseBadge = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.028, 0.012), bagTrimMat);
    caseBadge.position.set(0, 0.41, 0.098);
    wheelieGroup.add(caseBadge);

    const rodL = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.34, 10), metalHardwareMat);
    rodL.position.set(-0.055, 0.66, -0.03);
    const rodR = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.34, 10), metalHardwareMat);
    rodR.position.set(0.055, 0.66, -0.03);
    const gripBar = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.15, 12), bagSecondaryMat);
    gripBar.rotation.z = Math.PI / 2;
    gripBar.position.set(0, 0.83, -0.03);
    wheelieGroup.add(rodL, rodR, gripBar);

    const wheelGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.018, 12);
    wheelGeo.rotateZ(Math.PI / 2);
    [
      [-0.1, 0.022, -0.06],
      [0.1, 0.022, -0.06],
      [-0.1, 0.022, 0.06],
      [0.1, 0.022, 0.06],
    ].forEach(([wx, wy, wz]) => {
      const w = new THREE.Mesh(wheelGeo, bagSecondaryMat);
      w.position.set(wx, wy, wz);
      w.castShadow = true;
      wheelieGroup.add(w);
    });

    const duffelGroup = new THREE.Group();
    bagGroup.add(duffelGroup);

    const duffelBarrel = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.12, 0.28, 10, 18),
      bagPrimaryMat,
    );
    duffelBarrel.rotation.z = Math.PI / 2;
    duffelBarrel.scale.set(0.95, 1, 1.05);
    duffelBarrel.position.set(0, 0.125, 0);
    duffelBarrel.castShadow = true;
    duffelGroup.add(duffelBarrel);

    const strapL = new THREE.Mesh(new THREE.TorusGeometry(0.125, 0.012, 8, 20), bagSecondaryMat);
    strapL.rotation.y = Math.PI / 2;
    strapL.position.set(-0.08, 0.13, 0);
    const strapR = new THREE.Mesh(new THREE.TorusGeometry(0.125, 0.012, 8, 20), bagSecondaryMat);
    strapR.rotation.y = Math.PI / 2;
    strapR.position.set(0.08, 0.13, 0);
    const duffelHandle = new THREE.Mesh(
      new THREE.TorusGeometry(0.085, 0.01, 8, 18, Math.PI),
      bagSecondaryMat,
    );
    duffelHandle.position.set(0, 0.24, 0);
    duffelGroup.add(strapL, strapR, duffelHandle);

    const backpackGroup = new THREE.Group();
    bagGroup.add(backpackGroup);

    const packBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.2, 10, 18), bagPrimaryMat);
    packBody.scale.set(1.05, 1, 0.72);
    packBody.position.set(0, 0.22, 0);
    packBody.castShadow = true;
    backpackGroup.add(packBody);

    const packFrontPocket = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.18, 0.06),
      bagSecondaryMat,
    );
    packFrontPocket.position.set(0, 0.16, 0.08);
    backpackGroup.add(packFrontPocket);

    let activeTopTexture: THREE.CanvasTexture | null = null;
    let activeBumpTexture: THREE.CanvasTexture | null = null;
    let currentBagScaleTarget = kit.showBagOnStage ? 1 : 0;
    let currentBagScale = currentBagScaleTarget;
    let currentCamTargetY = 0.92;
    let currentCamTargetZ = 3.65;

    const applyKit = (nextKit: EquippedKit, focus: 'full' | 'footwear' | 'bag') => {
      const topSlot = nextKit.activeTopLayer === 'tracksuit' ? nextKit.tracksuit : nextKit.top;
      const topItem = topSlot.item;
      const topColor = topItem.colorways[topSlot.colorwayIndex] || topItem.colorways[0];

      const isPuffer = topItem.silhouette === 'tracksuit_puffer';
      if (activeTopTexture) activeTopTexture.dispose();
      activeTopTexture = createTopGarmentTexture(
        topItem,
        topColor,
        nextKit.squadNumber,
        nextKit.teamName,
      );
      activeTopTexture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());

      if (activeBumpTexture) activeBumpTexture.dispose();
      activeBumpTexture = createFabricBumpTexture(isPuffer);

      topMat.map = activeTopTexture;
      topMat.bumpMap = activeBumpTexture;
      topMat.bumpScale = isPuffer ? 0.032 : 0.008;
      topMat.roughness = isPuffer ? 0.36 : 0.74;
      topMat.needsUpdate = true;

      sleeveMat.color.set(
        topItem.pattern === 'colorblock' ? topColor.secondary : topColor.primary,
      );
      sleeveMat.roughness = isPuffer ? 0.38 : 0.74;
      trimMat.color.set(topColor.trim);

      const isSleeveless = topItem.silhouette === 'jersey_sleeveless';
      const isLongSleeve =
        topItem.silhouette === 'jersey_longsleeve' ||
        topItem.silhouette === 'tracksuit_puffer' ||
        topItem.silhouette === 'tracksuit_zip' ||
        topItem.silhouette === 'tracksuit_hoodie';
      const isPolo = topItem.silhouette === 'jersey_polo';
      const isZip =
        topItem.silhouette === 'tracksuit_puffer' || topItem.silhouette === 'tracksuit_zip';
      const isHoodie = topItem.silhouette === 'tracksuit_hoodie';

      [leftArm, rightArm].forEach((arm) => {
        arm.shortSleeve.visible = !isSleeveless && !isLongSleeve;
        arm.shortCuff.visible = !isSleeveless && !isLongSleeve;
        arm.longSleeveUpper.visible = isLongSleeve;
        arm.longSleeveLower.visible = isLongSleeve;
        arm.longCuff.visible = isLongSleeve;
      });

      crewCollar.visible = !isPolo && !isZip && !isHoodie;
      standCollar.visible = isZip;
      zipLine.visible = isZip;
      poloCollarGroup.visible = isPolo;
      hoodCollar.visible = isHoodie;

      torsoMesh.scale.set(isPuffer ? 1.07 : 1.0, 1.0, isPuffer ? 1.14 : 1.0);

      const isFullPants = topItem.bottomStyle !== 'shorts';
      if (topItem.sport === 'Cricket' && topColor.id === 'whites') {
        bottomMat.color.set('#f1f2f4');
      } else if (nextKit.activeTopLayer === 'tracksuit') {
        bottomMat.color.set('#222630');
      } else {
        bottomMat.color.set(topColor.secondary);
      }

      [leftLeg, rightLeg].forEach((leg) => {
        leg.shortsLeg.visible = !isFullPants;
        leg.bareLeg.visible = !isFullPants;
        leg.sock.visible = !isFullPants;
        leg.pantsLeg.visible = isFullPants;
      });

      const shoeItem = nextKit.footwear.item;
      const shoeColor =
        shoeItem.colorways[nextKit.footwear.colorwayIndex] || shoeItem.colorways[0];
      shoeUpperMat.color.set(shoeColor.primary);
      shoeAccentMat.color.set(shoeColor.secondary);
      shoeTrimMat.color.set(shoeColor.trim);
      const isHighTop = shoeItem.silhouette === 'shoe_hightop';
      const isCleat = shoeItem.silhouette === 'shoe_cleat';
      [leftLeg, rightLeg].forEach((leg) => {
        leg.highTopCollar.visible = isHighTop;
        leg.cleatsGroup.visible = isCleat;
      });

      const bagItem = nextKit.bag.item;
      const bagColor = bagItem.colorways[nextKit.bag.colorwayIndex] || bagItem.colorways[0];
      bagPrimaryMat.color.set(bagColor.primary);
      bagSecondaryMat.color.set(bagColor.secondary);
      bagTrimMat.color.set(bagColor.trim);

      wheelieGroup.visible =
        bagItem.silhouette === 'bag_wheelie' || bagItem.silhouette === 'bag_hardcase';
      duffelGroup.visible = bagItem.silhouette === 'bag_duffel';
      backpackGroup.visible = bagItem.silhouette === 'bag_backpack';

      currentBagScaleTarget = nextKit.showBagOnStage ? 1 : 0;
      bagContactShadow.visible = nextKit.showBagOnStage;

      if (focus === 'footwear') {
        currentCamTargetY = 0.72;
        currentCamTargetZ = 3.45;
      } else if (focus === 'bag') {
        currentCamTargetY = 0.84;
        currentCamTargetZ = 3.65;
      } else {
        currentCamTargetY = 0.92;
        currentCamTargetZ = 3.65;
      }
    };

    updateSceneRef.current = applyKit;
    applyKit(kit, focusTarget);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 8);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 8);
    }

    function tick() {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.elapsedTime;

      torsoGroup.position.y = 0.92 + Math.sin(elapsed * 1.5) * 0.003;
      headGroup.position.y = 1.59 + Math.sin(elapsed * 1.5) * 0.0035;

      currentBagScale = THREE.MathUtils.damp(currentBagScale, currentBagScaleTarget, 10, dt);
      bagGroup.visible = currentBagScale > 0.02;
      bagGroup.scale.setScalar(Math.max(0.001, currentBagScale));

      controls.target.y = THREE.MathUtils.damp(controls.target.y, currentCamTargetY, 5, dt);
      _tmpVec.copy(camera.position).sub(controls.target);
      const currentDist = _tmpVec.length();
      const nextDist = THREE.MathUtils.damp(currentDist, currentCamTargetZ, 5, dt);
      if (Math.abs(currentDist - nextDist) > 0.005) {
        _tmpVec.normalize().multiplyScalar(nextDist);
        camera.position.copy(controls.target).add(_tmpVec);
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    const handleResize = () => {
      if (!container || disposed) return;
      const w = Math.max(container.clientWidth, 1);
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      controls.dispose();
      if (roomEnvTexture) roomEnvTexture.dispose();
      contactTex.dispose();
      if (activeTopTexture) activeTopTexture.dispose();
      if (activeBumpTexture) activeBumpTexture.dispose();

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry.dispose();
          if (Array.isArray(m.material)) {
            m.material.forEach((mat) => mat.dispose());
          } else {
            m.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (updateSceneRef.current) {
      updateSceneRef.current(kit, focusTarget);
    }
  }, [kit, focusTarget]);

  if (webglError) {
    return <StudioFallback2D kit={kit} />;
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      aria-label="Interactive 3D Gemini Sportwears Athlete Uniform Preview — Drag horizontally to rotate 360 degrees"
    />
  );
};
