document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('earth-container');
    if (!container) return;

    // Dimensions
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2; // Distance from Earth

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Earth Geometry & Material
    const geometry = new THREE.SphereGeometry(0.55, 64, 64); // Radius 0.55 (reduced to avoid clipping)
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('equirectangular/2zqc_425t_220222.jpg');

    // Fix texture seam: crop edges (Zoom in slightly)
    earthTexture.wrapS = THREE.RepeatWrapping;
    earthTexture.wrapT = THREE.RepeatWrapping;
    earthTexture.repeat.set(0.92, 0.92); // Zoom in on both axes
    earthTexture.offset.set(0.04, 0.04); // Center the crop

    // Use MeshPhongMaterial for better lighting reaction
    const material = new THREE.MeshPhongMaterial({
        map: earthTexture,
        bumpMap: earthTexture,
        bumpScale: 0.015,
        specularMap: earthTexture,
        specular: new THREE.Color('grey')
    });

    const earth = new THREE.Mesh(geometry, material);
    earth.rotation.z = 23.5 * (Math.PI / 180); // Axial tilt
    scene.add(earth);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5); // From top-right-front
    scene.add(directionalLight);

    // Interaction: Hover Zoom
    let targetScale = 1.0; // Base scale
    const hoverScale = 1.1; // Zoomed scale (reduced)

    container.addEventListener('mouseenter', () => {
        targetScale = hoverScale;
    });

    container.addEventListener('mouseleave', () => {
        targetScale = 1.0;
    });

    // --- Moon Implementation ---
    function createMoonTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Background (Pale Gray)
        ctx.fillStyle = '#e5e5e5';
        ctx.fillRect(0, 0, 512, 256);

        // Craters (Stylized)
        ctx.fillStyle = '#d4d4d4';
        const craters = [
            { x: 100, y: 100, r: 20 },
            { x: 200, y: 150, r: 30 },
            { x: 300, y: 80, r: 15 },
            { x: 400, y: 120, r: 25 },
            { x: 50, y: 200, r: 10 },
            { x: 450, y: 40, r: 12 }
        ];

        craters.forEach(c => {
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
            ctx.fill();
        });

        return new THREE.CanvasTexture(canvas);
    }

    const moonTexture = createMoonTexture();
    const moonGeometry = new THREE.SphereGeometry(0.12, 32, 32); // 20% of Earth size
    const moonMaterial = new THREE.MeshStandardMaterial({
        map: moonTexture,
        roughness: 0.8,
        metalness: 0.1,
        transparent: true,
        opacity: 1
    });

    const moon = new THREE.Mesh(moonGeometry, moonMaterial);

    // Moon Pivot (for orbiting Earth)
    const moonPivot = new THREE.Object3D();
    scene.add(moonPivot);
    moonPivot.add(moon);

    // Position Moon relative to Earth
    moon.position.set(2, 0, 0); // Distance

    // Tilt the orbit slightly
    moonPivot.rotation.z = 23.5 * (Math.PI / 180);

    // Animation Loop
    let rotationSpeed = 0.0005; // Auto-rotation speed (Slower)
    const moonPosition = new THREE.Vector3();

    const animate = () => {
        requestAnimationFrame(animate);

        // Auto-rotation
        earth.rotation.y += rotationSpeed;

        // Moon Orbit
        moonPivot.rotation.y += 0.002; // Orbit Speed
        moon.rotation.y += 0.01; // Moon self-rotation (optional)

        // Moon Opacity Logic (Occlusion Fade)
        moon.getWorldPosition(moonPosition);

        // Only fade if behind Earth (z < -0.2) AND visually close to the Earth's radius
        // Earth Radius is 0.55. Let's start fading at 0.75 distance from center.
        if (moonPosition.z < -0.2) {
            const distFromCenter = Math.sqrt(moonPosition.x * moonPosition.x + moonPosition.y * moonPosition.y);
            const fadeStart = 0.8; // Distance to start fading out
            const fadeEnd = 0.55;  // Distance where it should be fully invisible (Earth visual edge)

            if (distFromCenter < fadeStart) {
                // Map distance to opacity: 0.8 -> 1, 0.55 -> 0
                let opacity = THREE.MathUtils.mapLinear(distFromCenter, fadeStart, fadeEnd, 1, 0);
                opacity = Math.max(0, Math.min(1, opacity));
                moonMaterial.opacity = opacity;
            } else {
                moonMaterial.opacity = 1;
            }
        } else {
            moonMaterial.opacity = 1;
        }

        // Smooth Zoom
        earth.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);

        renderer.render(scene, camera);
    };

    animate();

    function toRadians(angle) {
        return angle * (Math.PI / 180);
    }
});
