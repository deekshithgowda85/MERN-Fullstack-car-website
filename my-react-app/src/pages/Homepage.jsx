import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { gsap } from 'gsap';
import './homestyle.css';

function Homepage() {
  const containerRef = useRef();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let car, mixer, renderer, animationId;
    const clock = new THREE.Clock();
    let cinematicTime = 0;
    const cinematicDuration = 2.5; // seconds per shot

    // Create loading manager
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = (itemsLoaded / itemsTotal) * 100;
      setLoadingProgress(progress);
    };
    loadingManager.onLoad = () => {
      setIsLoading(false);
    };
    loadingManager.onError = (url) => {
      console.error('Error loading:', url);
    };

    // Initialize DRACOLoader for model compression
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/'); // Make sure to copy draco decoder files to public folder
    dracoLoader.setDecoderConfig({ type: 'js' });

    // Initialize GLTFLoader with DRACOLoader and loading manager
    const loader = new GLTFLoader(loadingManager);
    loader.setDRACOLoader(dracoLoader);

    // Enable model caching
    const cache = new Map();
    loader.setResourcePath('/assets/');

    // Cinematic shots for banner section
    const cinematicShots = [
      // Front right view
      { position: new THREE.Vector3(2, 1.5, 3.5), lookAt: new THREE.Vector3(0, 1, 0) },
      // Rear left view
      { position: new THREE.Vector3(-3, 2, 2), lookAt: new THREE.Vector3(0, 1, 0) },
      // Top-down view
      { position: new THREE.Vector3(0, 4, 0), lookAt: new THREE.Vector3(0, 0, 0) },
      // Front left view
      { position: new THREE.Vector3(4, 1, -2), lookAt: new THREE.Vector3(0, 1, 0) },
      // Back of the car, zoomed out to show headlights
      { position: new THREE.Vector3(0, 1.3, -3.2), lookAt: new THREE.Vector3(0, 1, 0) },
      // Further back view
      { position: new THREE.Vector3(0, 2, -2), lookAt: new THREE.Vector3(0, 1, 0) },
    ];

    const camera = new THREE.PerspectiveCamera(
      45, // Reduced FOV for better perspective
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 5); // Adjusted initial camera position

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111); // Dark background

    // Lighting
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(5, 10, 5); // Directional light position
    scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0x888888);
    scene.add(ambientLight);

    // Add extra spotlights for more dramatic lighting on the car
    const spotLight1 = new THREE.SpotLight(0xffffff, 2);
    spotLight1.position.set(0, 10, 5); // Above and in front of the car
    spotLight1.angle = Math.PI / 6;
    spotLight1.penumbra = 0.4;
    spotLight1.castShadow = true;
    scene.add(spotLight1);

    const spotLight2 = new THREE.SpotLight(0xffffff, 1.5);
    spotLight2.position.set(0, 8, -5); // Above and behind the car
    spotLight2.angle = Math.PI / 7;
    spotLight2.penumbra = 0.3;
    spotLight2.castShadow = true;
    scene.add(spotLight2);

    // Optional: Add a point light for subtle fill
    const pointLight = new THREE.PointLight(0xffffff, 0.7, 20);
    pointLight.position.set(2, 4, 2);
    scene.add(pointLight);

    // Add red spotlights for headlights (front)
    const frontLeftHeadlight = new THREE.SpotLight(0xff0000, 5, 20, Math.PI / 4, 0.5);
    frontLeftHeadlight.position.set(-0.7, 1, 4.2);
    frontLeftHeadlight.target.position.set(-0.7, 1, 6);
    frontLeftHeadlight.castShadow = false;
    scene.add(frontLeftHeadlight);
    scene.add(frontLeftHeadlight.target);

    const frontRightHeadlight = new THREE.SpotLight(0xff0000, 5, 20, Math.PI / 4, 0.5);
    frontRightHeadlight.position.set(0.7, 1, 4.2);
    frontRightHeadlight.target.position.set(0.7, 1, 6);
    frontRightHeadlight.castShadow = false;
    scene.add(frontRightHeadlight);
    scene.add(frontRightHeadlight.target);

    // Add red spotlights for taillights (rear)
    const rearLeftTaillight = new THREE.SpotLight(0xff0000, 5, 20, Math.PI / 4, 0.5);
    rearLeftTaillight.position.set(-0.5, 1, -4.2);
    rearLeftTaillight.target.position.set(-0.5, 1, -6);
    rearLeftTaillight.castShadow = false;
    scene.add(rearLeftTaillight);
    scene.add(rearLeftTaillight.target);

    const rearRightTaillight = new THREE.SpotLight(0xff0000, 5, 20, Math.PI / 4, 0.5);
    rearRightTaillight.position.set(0.5, 1, -4.2);
    rearRightTaillight.target.position.set(0.5, 1, -6);
    rearRightTaillight.castShadow = false;
    scene.add(rearRightTaillight);
    scene.add(rearRightTaillight.target);

    // Add glowing effects for headlights and taillights
    const frontLeftGlow = new THREE.PointLight(0xff0000, 2, 2);
    frontLeftGlow.position.set(-0.7, 1, 4.3);
    scene.add(frontLeftGlow);

    const frontRightGlow = new THREE.PointLight(0xff0000, 2, 2);
    frontRightGlow.position.set(0.7, 1, 4.3);
    scene.add(frontRightGlow);

    const rearLeftGlow = new THREE.PointLight(0xff0000, 2, 2);
    rearLeftGlow.position.set(-0.5, 1, -4.3);
    scene.add(rearLeftGlow);

    const rearRightGlow = new THREE.PointLight(0xff0000, 2, 2);
    rearRightGlow.position.set(0.5, 1, -4.3);
    scene.add(rearRightGlow);

    // Add lighting under the hood of the car
    const hoodLight = new THREE.PointLight(0x3399ff, 8, 6);
    hoodLight.position.set(0, 1.7, 1.2);
    scene.add(hoodLight);

    // Add blue lighting to all sides of the car for dramatic effect
    // Left side
    const leftLight = new THREE.PointLight(0x3399ff, 4, 6);
    leftLight.position.set(-2.5, 1.5, 0);
    scene.add(leftLight);

    // Right side
    const rightLight = new THREE.PointLight(0x3399ff, 4, 6);
    rightLight.position.set(2.5, 1.5, 0);
    scene.add(rightLight);

    // Front (low)
    const frontLight = new THREE.PointLight(0x3399ff, 4, 6);
    frontLight.position.set(0, 1, 4);
    scene.add(frontLight);

    // Rear (low)
    const rearLight = new THREE.PointLight(0x3399ff, 4, 6);
    rearLight.position.set(0, 1, -4);
    scene.add(rearLight);

    // Top (roof)
    const topLight = new THREE.PointLight(0x3399ff, 3, 6);
    topLight.position.set(0, 3, 0);
    scene.add(topLight);

    // Load Car with optimizations
    loader.load(
      '/assets/ford.glb',
      function (gltf) {
        car = gltf.scene;
        car.traverse((child) => {
          if (child.isMesh) {
            child.material.side = THREE.DoubleSide;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;

            // Optimize geometry
            if (child.geometry) {
              child.geometry.computeBoundingSphere();
              child.geometry.computeBoundingBox();
              child.geometry.computeVertexNormals();
            }

            // Optimize materials
            if (child.material) {
              child.material.precision = 'mediump';
              child.material.flatShading = false;
            }
          }
        });

        car.scale.set(75, 75, 75);
        car.position.set(0, 0, 0);
        scene.add(car);

        mixer = new THREE.AnimationMixer(car);
        if (gltf.animations && gltf.animations[0]) {
          mixer.clipAction(gltf.animations[0]).play();
        }
        modelMove();
      },
      // Add progress callback
      (xhr) => {
        const progress = (xhr.loaded / xhr.total) * 100;
        console.log(`Car model loading: ${progress.toFixed(2)}%`);
      },
      function (error) {
        console.error('Error loading car:', error);
      }
    );

    // Load Modern Garage with optimizations
    loader.load(
      '/assets/modern_garage1.glb',
      (gltf) => {
        const garageModel = gltf.scene;
        garageModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            // Optimize geometry
            if (child.geometry) {
              child.geometry.computeBoundingSphere();
              child.geometry.computeBoundingBox();
              child.geometry.computeVertexNormals();
            }

            // Optimize materials
            if (child.material) {
              child.material.precision = 'mediump';
              child.material.flatShading = false;
            }
          }
        });
        garageModel.position.set(0, 0, 0);
        garageModel.scale.set(1, 1, 1);
        scene.add(garageModel);
      },
      // Add progress callback
      (xhr) => {
        const progress = (xhr.loaded / xhr.total) * 100;
        console.log(`Garage model loading: ${progress.toFixed(2)}%`);
      },
      (error) => {
        console.error("Error loading garage model:", error);
      }
    );

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
      precision: 'mediump'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // Enable renderer optimizations
    renderer.info.autoReset = false;
    renderer.sortObjects = true;

    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }

    // Model movement logic
    let arrPositionModel = [
      {
        id: 'banner',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      {
        id: "intro",
        position: { x: 1, y: 0, z: -2 },
        rotation: { x: 0, y: -0.5, z: 0 },
      },
      {
        id: "description",
        position: { x: -1, y: 0, z: -2 },
        rotation: { x: 0, y: 0.5, z: 0 },
      },
      {
        id: "contact",
        position: { x: 0.8, y: 0, z: 0 },
        rotation: { x: 0, y: -0.5, z: 0 },
      },
    ];

    function modelMove() {
      const sections = document.querySelectorAll('.section');
      let currentSection;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 3) {
          currentSection = section.id;
        }
      });
      let position_active = arrPositionModel.findIndex(
        (val) => val.id === currentSection
      );
      if (position_active >= 0 && car) {
        let new_coordinates = arrPositionModel[position_active];
        gsap.to(car.position, {
          x: new_coordinates.position.x,
          y: new_coordinates.position.y,
          z: new_coordinates.position.z,
          duration: 2,
          ease: "power1.out"
        });
        gsap.to(car.rotation, {
          x: new_coordinates.rotation.x,
          y: new_coordinates.rotation.y,
          z: new_coordinates.rotation.z,
          duration: 2,
          ease: "power1.out"
        });
      }
    }

    // Animation loop
    const reRender3D = () => {
      animationId = requestAnimationFrame(reRender3D);
      const delta = clock.getDelta();

      // Check if we're in the banner section
      const sections = document.querySelectorAll('.section');
      let isBannerSection = false;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 3 && section.id === 'banner') {
          isBannerSection = true;
        }
      });

      if (isBannerSection) {
        // Cinematic camera movement for banner section
        cinematicTime += delta;
        const shotIdx = Math.floor(cinematicTime / cinematicDuration) % cinematicShots.length;
        const nextIdx = (shotIdx + 1) % cinematicShots.length;
        const t = (cinematicTime % cinematicDuration) / cinematicDuration;
        const from = cinematicShots[shotIdx];
        const to = cinematicShots[nextIdx];
        camera.position.lerpVectors(from.position, to.position, t);
        const lookAt = new THREE.Vector3().lerpVectors(from.lookAt, to.lookAt, t);
        camera.lookAt(lookAt);
      } else {
        // Regular rotation for other sections
        if (car) {
          car.rotation.y -= 0.005;
        }
      }

      renderer.render(scene, camera);
      if (mixer) mixer.update(0.02);
    };
    reRender3D();

    const handleScroll = () => {
      if (car) {
        modelMove();
      }
    };

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
      }
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div ref={containerRef} id="container3D" style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          textAlign: 'center',
          zIndex: 1000
        }}>
          <div>Loading Models: {Math.round(loadingProgress)}%</div>
          <div style={{
            width: '200px',
            height: '4px',
            background: '#333',
            marginTop: '10px',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${loadingProgress}%`,
              height: '100%',
              background: '#fff',
              transition: 'width 0.3s ease-in-out'
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;
