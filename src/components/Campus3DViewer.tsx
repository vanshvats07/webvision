/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Interactive 3D Architectural Campus Explorer — Bright Daylight Theme
 * Natural daylight lighting, red-brick & green-glass architectural materials,
 * Pure White #FFFFFF and Warm Ivory #F7F5EF UI.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CAMPUS_BLOCKS, CampusBlock } from '../data/maitData';
import { Compass, Eye, Maximize2, Minimize2, Layers, Sun, Building2, X } from 'lucide-react';

interface Campus3DViewerProps {
  selectedBlockId?: string | null;
  onSelectBlock?: (block: CampusBlock | null) => void;
  className?: string;
}

export const Campus3DViewer: React.FC<Campus3DViewerProps> = ({
  selectedBlockId,
  onSelectBlock,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeBlock, setActiveBlock] = useState<CampusBlock | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<CampusBlock | null>(null);
  const [cameraPreset, setCameraPreset] = useState<'overview' | 'admin' | 'tech' | 'library' | 'ai' | 'audi'>('overview');
  const [lightingMode, setLightingMode] = useState<'noon' | 'morning' | 'golden'>('noon');
  const [isExploded, setIsExploded] = useState(false);
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // References for animation and interaction
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const buildingMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 24, 28));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1, -2));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1, -2));
  const isDraggingRef = useRef<boolean>(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const orbitAnglesRef = useRef<{ theta: number; phi: number; radius: number }>({
    theta: Math.PI / 2,
    phi: Math.PI / 4,
    radius: 36,
  });

  // Sync internal active block with external prop
  useEffect(() => {
    if (selectedBlockId) {
      const found = CAMPUS_BLOCKS.find((b) => b.id === selectedBlockId);
      if (found) {
        setActiveBlock(found);
        focusOnBlock(found);
      }
    }
  }, [selectedBlockId]);

  const focusOnBlock = (block: CampusBlock) => {
    const [bx, by, bz] = block.gridPos;
    targetLookAtRef.current.set(bx, by, bz);
    targetCamPosRef.current.set(bx + 10, by + 10, bz + 12);
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // 1. Software WebGL Guard
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 2. Setup Daylight Architectural Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Elegant bright daylight atmosphere
    const skyColor = lightingMode === 'golden' ? 0xfbf2e6 : lightingMode === 'morning' ? 0xf5f8fb : 0xf2f5f8;
    scene.background = new THREE.Color(skyColor);
    scene.fog = new THREE.FogExp2(skyColor, 0.012);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 300);
    camera.position.set(0, 24, 28);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Bright Natural Daylight Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xfffbf0, 0xd8e6f3, 0.85);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(
      lightingMode === 'golden' ? 0xffdfba : 0xfffaed,
      lightingMode === 'golden' ? 1.6 : 1.35
    );
    sunLight.position.set(28, 42, 24);
    if (!isSoftwareGl) {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 2048;
      sunLight.shadow.mapSize.height = 2048;
      sunLight.shadow.camera.near = 10;
      sunLight.shadow.camera.far = 110;
      sunLight.shadow.camera.left = -30;
      sunLight.shadow.camera.right = 30;
      sunLight.shadow.camera.top = 30;
      sunLight.shadow.camera.bottom = -30;
      sunLight.shadow.bias = -0.0004;
      sunLight.shadow.normalBias = 0.02;
    }
    scene.add(sunLight);

    // Subtle soft fill light
    const fillLight = new THREE.DirectionalLight(0xd9ebff, 0.35);
    fillLight.position.set(-20, 25, -20);
    scene.add(fillLight);

    // 5. Authentic Architectural PBR Materials
    const brickMaterial = new THREE.MeshStandardMaterial({
      color: 0x873a2b, // Official MAIT Brick Red
      roughness: 0.82,
      metalness: 0.05,
    });

    const concreteCorniceMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5efe6, // Clean sandstone / off-white concrete band
      roughness: 0.75,
      metalness: 0.05,
    });

    const greenGlassMaterial = new THREE.MeshStandardMaterial({
      color: 0x16745b, // Campus Green architectural glass
      roughness: 0.15,
      metalness: 0.85,
    });

    const groundLawnMaterial = new THREE.MeshStandardMaterial({
      color: 0x487954, // Lush, vibrant campus green lawn
      roughness: 0.95,
      metalness: 0.02,
    });

    const sandstonePavementMaterial = new THREE.MeshStandardMaterial({
      color: 0xe5dfd3, // Sandstone pathways
      roughness: 0.85,
      metalness: 0.05,
    });

    // 6. Ground & Landscape Construction
    const groundGeo = new THREE.PlaneGeometry(72, 64, 32, 32);
    const groundMesh = new THREE.Mesh(groundGeo, groundLawnMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = 0;
    groundMesh.receiveShadow = !isSoftwareGl;
    scene.add(groundMesh);

    // Central Sandstone Spine Walkway
    const walkwayGeo = new THREE.PlaneGeometry(7.0, 50);
    const walkwayMesh = new THREE.Mesh(walkwayGeo, sandstonePavementMaterial);
    walkwayMesh.rotation.x = -Math.PI / 2;
    walkwayMesh.position.set(0, 0.02, -3);
    walkwayMesh.receiveShadow = !isSoftwareGl;
    scene.add(walkwayMesh);

    // East-West Connecting Courtyard Boulevard
    const crossWalkGeo = new THREE.PlaneGeometry(38, 5.0);
    const crossWalkMesh = new THREE.Mesh(crossWalkGeo, sandstonePavementMaterial);
    crossWalkMesh.rotation.x = -Math.PI / 2;
    crossWalkMesh.position.set(0, 0.025, 0);
    crossWalkMesh.receiveShadow = !isSoftwareGl;
    scene.add(crossWalkMesh);

    // Campus Perimeter Fence Wall
    const fenceGeo = new THREE.BoxGeometry(64, 0.8, 0.4);
    const northFence = new THREE.Mesh(fenceGeo, brickMaterial);
    northFence.position.set(0, 0.4, -28);
    scene.add(northFence);

    // Campus Trees
    const treeTrunkGeo = new THREE.CylinderGeometry(0.12, 0.18, 1.2, 6);
    const treeFoliageGeo = new THREE.DodecahedronGeometry(0.85, 1);
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x4e3629, roughness: 0.9 });
    const treeFoliageMat = new THREE.MeshStandardMaterial({ color: 0x2e663b, roughness: 0.7 });

    const treePositions: [number, number][] = [
      [-3.8, 5], [3.8, 5], [-3.8, 2], [3.8, 2],
      [-3.8, -1], [3.8, -1], [-3.8, -5], [3.8, -5],
      [-12, 2], [-12, -4], [12, 2], [12, -4],
      [-2, -10], [2, -10], [-5, 8], [5, 8]
    ];

    treePositions.forEach(([tx, tz]) => {
      const treeGroup = new THREE.Group();
      const trunk = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
      trunk.position.y = 0.6;
      trunk.castShadow = !isSoftwareGl;
      treeGroup.add(trunk);

      const foliage = new THREE.Mesh(treeFoliageGeo, treeFoliageMat);
      foliage.position.y = 1.6;
      foliage.castShadow = !isSoftwareGl;
      treeGroup.add(foliage);

      treeGroup.position.set(tx, 0, tz);
      scene.add(treeGroup);
    });

    // 7. Procedural Construction of the 9 MAIT Blocks
    buildingMeshesRef.current.clear();

    CAMPUS_BLOCKS.forEach((block) => {
      const bGroup = new THREE.Group();
      bGroup.name = block.id;
      const [w, h, d] = block.dimensions;
      const [gx, gy, gz] = block.gridPos;

      // 1. Primary Red-Brick Facade
      const mainBodyGeo = new THREE.BoxGeometry(w, h, d);
      const mainMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(block.color),
        roughness: 0.8,
        metalness: 0.08,
      });
      const mainMesh = new THREE.Mesh(mainBodyGeo, mainMat);
      mainMesh.position.y = h / 2;
      mainMesh.castShadow = !isSoftwareGl;
      mainMesh.receiveShadow = !isSoftwareGl;
      mainMesh.userData = { blockId: block.id, isClickable: true };
      bGroup.add(mainMesh);

      // 2. Architectural Campus Green Glass Bay Inset
      const glassW = w * 0.72;
      const glassH = h * 0.78;
      const glassD = d * 1.01;
      const glassGeo = new THREE.BoxGeometry(glassW, glassH, glassD);
      const glassMesh = new THREE.Mesh(glassGeo, greenGlassMaterial);
      glassMesh.position.y = h / 2 + 0.1;
      glassMesh.castShadow = false;
      glassMesh.userData = { blockId: block.id, isClickable: true };
      bGroup.add(glassMesh);

      // 3. Sandstone Architectural Cornices / Floor Division Bands
      const bandCount = block.floorCount;
      for (let f = 1; f <= bandCount; f++) {
        const bandH = 0.12;
        const bandGeo = new THREE.BoxGeometry(w * 1.04, bandH, d * 1.04);
        const bandMesh = new THREE.Mesh(bandGeo, concreteCorniceMaterial);
        bandMesh.position.y = (h / bandCount) * f;
        bandMesh.castShadow = !isSoftwareGl;
        bGroup.add(bandMesh);
      }

      // 4. Roof Details
      if (block.roofType === 'skylight') {
        const skylightGeo = new THREE.ConeGeometry(w * 0.45, 1.2, 4);
        skylightGeo.rotateY(Math.PI / 4);
        const skylightMat = new THREE.MeshStandardMaterial({
          color: 0x16745b,
          metalness: 0.85,
          roughness: 0.15,
        });
        const skylightMesh = new THREE.Mesh(skylightGeo, skylightMat);
        skylightMesh.position.y = h + 0.6;
        skylightMesh.castShadow = !isSoftwareGl;
        bGroup.add(skylightMesh);
      } else if (block.roofType === 'colonnade') {
        const porticoGeo = new THREE.BoxGeometry(w * 0.6, 0.4, 1.4);
        const porticoRoof = new THREE.Mesh(porticoGeo, concreteCorniceMaterial);
        porticoRoof.position.set(0, h * 0.45, d / 2 + 0.7);
        bGroup.add(porticoRoof);

        const pillarGeo = new THREE.CylinderGeometry(0.12, 0.12, h * 0.45, 8);
        for (let px = -w * 0.24; px <= w * 0.25; px += w * 0.16) {
          const pillar = new THREE.Mesh(pillarGeo, concreteCorniceMaterial);
          pillar.position.set(px, (h * 0.45) / 2, d / 2 + 1.2);
          pillar.castShadow = !isSoftwareGl;
          bGroup.add(pillar);
        }

        // Clock Tower on Admin Block
        const towerGeo = new THREE.BoxGeometry(1.6, 2.0, 1.6);
        const towerMesh = new THREE.Mesh(towerGeo, brickMaterial);
        towerMesh.position.set(0, h + 1.0, 0);
        bGroup.add(towerMesh);

        const clockDialGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.05, 16);
        clockDialGeo.rotateX(Math.PI / 2);
        const clockDialMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
        const clockDial = new THREE.Mesh(clockDialGeo, clockDialMat);
        clockDial.position.set(0, h + 1.2, 0.82);
        bGroup.add(clockDial);
      } else if (block.roofType === 'dome') {
        const domeGeo = new THREE.SphereGeometry(w * 0.42, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
        const domeMat = new THREE.MeshStandardMaterial({
          color: 0x8a929a,
          metalness: 0.6,
          roughness: 0.35,
        });
        const domeMesh = new THREE.Mesh(domeGeo, domeMat);
        domeMesh.position.y = h;
        domeMesh.castShadow = !isSoftwareGl;
        bGroup.add(domeMesh);
      }

      bGroup.position.set(gx, 0, gz);
      scene.add(bGroup);
      buildingMeshesRef.current.set(block.id, bGroup);
    });

    // 8. Raycaster for Interactive Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: MouseEvent) => {
      isDraggingRef.current = false;
      const rect = renderer.domElement.getBoundingClientRect();
      const deltaX = Math.abs(e.clientX - prevMousePosRef.current.x);
      const deltaY = Math.abs(e.clientY - prevMousePosRef.current.y);

      if (deltaX < 5 && deltaY < 5) {
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);
        const hit = intersects.find((i) => i.object.userData?.blockId);
        if (hit) {
          const bId = hit.object.userData.blockId;
          const found = CAMPUS_BLOCKS.find((b) => b.id === bId);
          if (found) {
            setActiveBlock(found);
            focusOnBlock(found);
            if (onSelectBlock) onSelectBlock(found);
          }
        }
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (isDraggingRef.current) {
        const dx = e.clientX - prevMousePosRef.current.x;
        const dy = e.clientY - prevMousePosRef.current.y;
        orbitAnglesRef.current.theta -= dx * 0.006;
        orbitAnglesRef.current.phi = Math.max(0.15, Math.min(Math.PI / 2.1, orbitAnglesRef.current.phi - dy * 0.006));
        prevMousePosRef.current = { x: e.clientX, y: e.clientY };

        const { theta, phi, radius } = orbitAnglesRef.current;
        targetCamPosRef.current.x = currentLookAtRef.current.x + radius * Math.sin(phi) * Math.sin(theta);
        targetCamPosRef.current.y = currentLookAtRef.current.y + radius * Math.cos(phi);
        targetCamPosRef.current.z = currentLookAtRef.current.z + radius * Math.sin(phi) * Math.cos(theta);
        return;
      }

      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      const hit = intersects.find((i) => i.object.userData?.blockId);
      if (hit) {
        const bId = hit.object.userData.blockId;
        const found = CAMPUS_BLOCKS.find((b) => b.id === bId);
        setHoveredBlock(found || null);
        renderer.domElement.style.cursor = 'pointer';
      } else {
        setHoveredBlock(null);
        renderer.domElement.style.cursor = 'grab';
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      orbitAnglesRef.current.radius = Math.max(12, Math.min(75, orbitAnglesRef.current.radius + e.deltaY * 0.03));
      const { theta, phi, radius } = orbitAnglesRef.current;
      targetCamPosRef.current.x = currentLookAtRef.current.x + radius * Math.sin(phi) * Math.sin(theta);
      targetCamPosRef.current.y = currentLookAtRef.current.y + radius * Math.cos(phi);
      targetCamPosRef.current.z = currentLookAtRef.current.z + radius * Math.sin(phi) * Math.cos(theta);
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    domEl.addEventListener('mousemove', handlePointerMove);
    domEl.addEventListener('wheel', handleWheel, { passive: false });

    // 9. Resize Handling
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 10. Animation Loop
    let animId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.1);

      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPosRef.current.x, 3.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPosRef.current.y, 3.5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPosRef.current.z, 3.5, delta);

      currentLookAtRef.current.x = THREE.MathUtils.damp(currentLookAtRef.current.x, targetLookAtRef.current.x, 3.5, delta);
      currentLookAtRef.current.y = THREE.MathUtils.damp(currentLookAtRef.current.y, targetLookAtRef.current.y, 3.5, delta);
      currentLookAtRef.current.z = THREE.MathUtils.damp(currentLookAtRef.current.z, targetLookAtRef.current.z, 3.5, delta);

      camera.lookAt(currentLookAtRef.current);

      buildingMeshesRef.current.forEach((group, blockId) => {
        const isSelected = activeBlock?.id === blockId;
        const isHovered = hoveredBlock?.id === blockId;
        const targetElevation = isExploded ? 3.0 : isSelected ? 1.0 : isHovered ? 0.35 : 0;
        group.position.y = THREE.MathUtils.damp(group.position.y, targetElevation, 5.0, delta);
      });

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      domEl.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      domEl.removeEventListener('mousemove', handlePointerMove);
      domEl.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [lightingMode, isExploded]);

  const applyPreset = (preset: 'overview' | 'admin' | 'tech' | 'library' | 'ai' | 'audi') => {
    setCameraPreset(preset);
    if (preset === 'overview') {
      targetLookAtRef.current.set(0, 1, -2);
      targetCamPosRef.current.set(0, 24, 28);
      orbitAnglesRef.current = { theta: Math.PI / 2, phi: Math.PI / 4, radius: 36 };
      setActiveBlock(null);
    } else if (preset === 'admin') {
      const b = CAMPUS_BLOCKS.find((x) => x.id === 'block-1')!;
      setActiveBlock(b);
      focusOnBlock(b);
    } else if (preset === 'tech') {
      const b = CAMPUS_BLOCKS.find((x) => x.id === 'block-2')!;
      setActiveBlock(b);
      focusOnBlock(b);
    } else if (preset === 'library') {
      const b = CAMPUS_BLOCKS.find((x) => x.id === 'block-8')!;
      setActiveBlock(b);
      focusOnBlock(b);
    } else if (preset === 'ai') {
      const b = CAMPUS_BLOCKS.find((x) => x.id === 'block-5')!;
      setActiveBlock(b);
      focusOnBlock(b);
    } else if (preset === 'audi') {
      const b = CAMPUS_BLOCKS.find((x) => x.id === 'block-9')!;
      setActiveBlock(b);
      focusOnBlock(b);
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-[#F2F5F8] border border-[#E7E3D8] shadow-md ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen' : className || 'w-full h-[600px]'
      }`}
    >
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Telemetry & Campus Coordinate Header (Light Theme) */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-white/95 border border-[#E7E3D8] shadow-xs text-[11px] font-mono uppercase tracking-wider text-[#873A2B] font-bold">
            MAIT 3D ARCHITECTURAL MODEL
          </div>
          <div className="px-2.5 py-1 bg-[#F7F5EF]/90 border border-[#E7E3D8] shadow-xs text-[11px] font-mono text-[#657080]">
            DAYLIGHT STUDY · 10.5 ACRES
          </div>
        </div>
        <p className="text-[12px] text-[#203044] font-medium hidden sm:block max-w-sm drop-shadow-xs">
          Drag to orbit · Scroll to zoom · Click any architectural block to inspect labs and departments.
        </p>
      </div>

      {/* Top Right Viewport Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 bg-white/95 hover:bg-[#F7F5EF] border border-[#E7E3D8] text-[#203044] shadow-xs transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen 3D Campus'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Hovered Block Tooltip (Clean White Box) */}
      {hoveredBlock && !activeBlock && (
        <div className="absolute top-16 left-4 z-10 p-3.5 bg-white/95 border border-[#E7E3D8] pointer-events-none max-w-xs transition-opacity duration-200 shadow-md">
          <p className="text-[10px] uppercase font-mono tracking-widest text-[#873A2B] font-bold">
            BLOCK {hoveredBlock.number} · {hoveredBlock.category.toUpperCase()}
          </p>
          <h4 className="text-sm font-serif font-bold text-[#203044] mt-0.5">{hoveredBlock.shortName}</h4>
          <p className="text-xs text-[#657080] mt-1 line-clamp-2">{hoveredBlock.description}</p>
        </div>
      )}

      {/* Active Selected Block Architectural Spec Card (Pure White with subtle border) */}
      {activeBlock && (
        <div className="absolute top-16 right-4 z-20 w-80 sm:w-96 max-h-[80%] overflow-y-auto bg-white/95 border border-[#E7E3D8] p-5 text-[#203044] shadow-xl backdrop-blur-md">
          <div className="flex items-start justify-between gap-2 border-b border-[#F0ECE1] pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#873A2B] font-semibold">
                <span>BLOCK 0{activeBlock.number}</span>
                <span>/</span>
                <span>{activeBlock.category.toUpperCase()}</span>
                <span>/</span>
                <span>{activeBlock.floorCount} FLOORS</span>
              </div>
              <h3 className="text-base font-serif font-bold text-[#203044] mt-1">{activeBlock.name}</h3>
            </div>
            <button
              onClick={() => setActiveBlock(null)}
              className="p-1 text-[#657080] hover:text-[#203044] hover:bg-[#F7F5EF] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#657080] mt-3 leading-relaxed">{activeBlock.description}</p>

          {/* Departments */}
          <div className="mt-4">
            <h5 className="text-[11px] font-mono tracking-wider uppercase text-[#203044] font-bold">
              DEPARTMENTS & WINGS
            </h5>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {activeBlock.departments.map((dept, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-[#F7F5EF] border border-[#E7E3D8] text-[11px] text-[#203044]"
                >
                  {dept}
                </span>
              ))}
            </div>
          </div>

          {/* Key Labs */}
          <div className="mt-3">
            <h5 className="text-[11px] font-mono tracking-wider uppercase text-[#203044] font-bold">
              SPECIALIZED LABORATORIES
            </h5>
            <ul className="mt-1.5 space-y-1 text-xs text-[#657080]">
              {activeBlock.keyLabs.map((lab, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#873A2B] shrink-0" />
                  <span className="text-[#203044]">{lab}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Facilities */}
          <div className="mt-3 pt-3 border-t border-[#F0ECE1]">
            <h5 className="text-[11px] font-mono tracking-wider uppercase text-[#203044] font-bold">FACILITIES</h5>
            <p className="text-xs text-[#657080] mt-1">{activeBlock.facilities.join(' · ')}</p>
          </div>
        </div>
      )}

      {/* Ergonomic Collapsible Bottom Control Dock (Pure White & Warm Ivory) */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-4xl transition-transform duration-300 ${
          isDockCollapsed ? 'translate-y-[calc(100%-36px)]' : 'translate-y-0'
        }`}
      >
        {/* Dock Header & Toggle Button */}
        <div className="flex justify-center mb-1">
          <button
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="px-3 py-1 bg-white/95 border border-[#E7E3D8] text-[11px] font-mono text-[#203044] hover:text-[#873A2B] uppercase tracking-wider transition-colors shadow-sm font-semibold"
          >
            {isDockCollapsed ? '▴ Show Architectural Controls' : '▾ Hide Controls (Zen View)'}
          </button>
        </div>

        {/* Dock Content Bar */}
        <div className="bg-white/95 border border-[#E7E3D8] p-2.5 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Camera Preset Zone */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="text-[11px] font-mono text-[#657080] uppercase mr-1 flex items-center gap-1 font-semibold">
              <Eye className="w-3.5 h-3.5 text-[#873A2B]" />
              VIEW:
            </span>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'admin', label: 'Admin (B1)' },
              { id: 'tech', label: 'CSE & IT (B2)' },
              { id: 'library', label: 'Library (B8)' },
              { id: 'ai', label: 'AI Hub (B5)' },
              { id: 'audi', label: 'Audi (B9)' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id as any)}
                className={`px-2.5 py-1 text-xs whitespace-nowrap transition-colors border ${
                  cameraPreset === p.id
                    ? 'bg-[#873A2B] text-white border-[#873A2B] font-medium shadow-xs'
                    : 'bg-[#F7F5EF] text-[#203044] border-[#E7E3D8] hover:bg-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Quick Tools: Lighting & Exploded Mode */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Lighting Mode Selector */}
            <div className="flex items-center bg-[#F7F5EF] border border-[#E7E3D8] p-0.5">
              <button
                onClick={() => setLightingMode('noon')}
                className={`px-2 py-1 text-[11px] font-mono transition-colors ${
                  lightingMode === 'noon' ? 'bg-[#873A2B] text-white font-semibold' : 'text-[#657080] hover:text-[#203044]'
                }`}
                title="Midday Sunlit Lighting"
              >
                NOON
              </button>
              <button
                onClick={() => setLightingMode('morning')}
                className={`px-2 py-1 text-[11px] font-mono transition-colors ${
                  lightingMode === 'morning' ? 'bg-[#873A2B] text-white font-semibold' : 'text-[#657080] hover:text-[#203044]'
                }`}
                title="Crisp Morning Lighting"
              >
                MORNING
              </button>
              <button
                onClick={() => setLightingMode('golden')}
                className={`px-2 py-1 text-[11px] font-mono transition-colors ${
                  lightingMode === 'golden' ? 'bg-[#873A2B] text-white font-semibold' : 'text-[#657080] hover:text-[#203044]'
                }`}
                title="Warm Golden Hour"
              >
                GOLDEN
              </button>
            </div>

            {/* Explode / Elevation separation toggle */}
            <button
              onClick={() => setIsExploded(!isExploded)}
              className={`px-2.5 py-1.5 border text-xs flex items-center gap-1.5 transition-colors ${
                isExploded
                  ? 'bg-[#873A2B] text-white border-[#873A2B] font-medium'
                  : 'bg-[#F7F5EF] text-[#203044] border-[#E7E3D8] hover:bg-white'
              }`}
              title="Isolate & separate blocks vertically"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isExploded ? 'Exploded ON' : 'Explode'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
