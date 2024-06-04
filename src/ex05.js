import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import dat from "dat.gui";
import gsap from "gsap";
import { SpotLightHelper } from "three";

// ----- 주제: glb 파일 애니메이션 효과 추가

export default function example() {
    
    const canvas = document.querySelector("#three-canvas");
    const loadingScreen = document.getElementById('loading-screen');

    // GIF가 일정 시간 동안 표시된 후 canvas가 나타나도록 설정
    /*
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        canvas.style.display = 'block';
        hideLoadingScreen();
    }, 1000); // 3초 후에 canvas를 보여줍니다. (3000 밀리초 = 3초)
    */

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#04052F");

    // Camera (2D -> 40, 3D -> 75 )
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 0;
    camera.position.y = 7;
    camera.position.z = 5;
    scene.add(camera);

    // Controls (카메라 시점 조절)
    const controls = new OrbitControls(camera, renderer.domElement);

    const ambientLight = new THREE.AmbientLight("#ffffff", 1000);
    scene.add(ambientLight); 

    const spotLight1 = new THREE.SpotLight("#FFEAC9", 1000);
    spotLight1.castShadow = true;

    spotLight1.position.set(0,15,0);
    spotLight1.angle = Math.PI /8; // 조명의 최대 확산 각도를 30도로 설정 (라디안 단위)
    spotLight1.penumbra = 0.1; 

    // 그림자 좀더 선명하게 보이는 설정
    spotLight1.shadow.mapSize.width = 1024;
    spotLight1.shadow.mapSize.height = 1024;


    scene.add(spotLight1);

    // Add SpotLightHelpers
    const spotLightHelper1 = new SpotLightHelper(spotLight1);
    scene.add(spotLightHelper1);
    

    // gltf loader (gltf 파일 불러오기)
    let mixer;
    const gltfLoader = new GLTFLoader();

    let room;
    gltfLoader.load("/models/odomak.glb", (gltf) => {
        if (gltf.scene) {
            gltf.scene.castShadow = true;
    
            gltf.scene.traverse((child) => {
                //console.log(child);
                if (child.name === "Plane013"
                        ||child.name === "Plane009" 
                        || child.name === "Plane010"
                        || child.name === "Plane011"
                ) {

                    child.visible = false;
                } else if(child.name === "Plane" 
                        
                        || child.name === "Cube007"   ){

                            child.castShadow = true; // 그림자 캐스팅
                            child.receiveShadow = true; // 그림자 수신
                          
                }
                 else {
                    child.castShadow = true; // 그림자 캐스팅
                    child.receiveShadow = true; // 그림자 수신
                   
                }
            });

            // callback 함수
            room = gltf.scene;
            console.log(room);
            room.position.set(15, 1, 13);
            room.scale.set(0.04, 0.03, 0.03);
            scene.add(room);

            
        }else {
            console.error('GLTF 파일 로드 오류: scene이 없습니다.');
        }
    }, undefined, (error) => {
        console.error('GLTF 파일 로드 오류', error);
    });

    let tree;
    gltfLoader.load("/models/tree3.glb", (gltf) => {

        if (gltf.scene) {
            gltf.scene.castShadow = true;
    
            gltf.scene.traverse((child) => {

                //Cylinder
                if (child.name === "Cylinder"
                        ||child.name === "Cylinder001"
                        ||child.name.includes("Cube") 
                ) {

                    child.visible = false;
                } else {
                    child.castShadow = true; // 그림자 캐스팅
                    child.receiveShadow = true; // 그림자 수신
                }
                   
            });
        }
        tree = gltf.scene;
        console.log(tree);
        tree.position.set(-4, 0.5, -3);
        tree.scale.set(0.5, 0.5, 0.5);
        scene.add(tree);

        hideLoadingScreen();

    }, undefined, (error) => {
        console.error('GLTF 파일 로드 오류', error);
    });
    

    // CylinderGeometry를 이용하여 기둥의 형태를 정의합니다.
    const onegeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32); // 매개변수는 (상단 반지름, 하단 반지름, 높이, 세그먼트 수)입니다.

    // 갈색으로 색칠된 재질을 만듭니다.
    const onematerial = new THREE.MeshBasicMaterial({ color: "#7C3E29" }); // 갈색 색상

    // 기둥의 메쉬를 생성합니다.
    const cylinder = new THREE.Mesh(onegeometry, onematerial);
    cylinder.position.set(-4, 1, -2.5);

    // scene에 기둥을 추가합니다.
    scene.add(cylinder);

    // 박스 생성
    const geometry = new THREE.BoxGeometry(10, 0.5, 10); // 너비, 높이, 깊이
    const material = new THREE.MeshBasicMaterial({color: "#3A2825"}); // 박스의 색상 설정
    const box = new THREE.Mesh(geometry, material);
    box.position.set(0,0,0);
    box.castShadow = true; // 그림자 캐스팅
    box.receiveShadow = true; // 그림자 수신

    // 박스를 scene에 추가
    scene.add(box);


    const pointLight = new THREE.PointLight("#FF9E09", 10, 100); // 흰색 광원, 강도 1, 거리 100

    // PointLight의 위치를 설정합니다.
    pointLight.position.set(-5, 7, 1); // (x, y, z) 좌표

    pointLight.castShadow = true;
    pointLight.receiveShadow = true;

    // scene에 PointLight를 추가합니다.
    scene.add(pointLight);

    const pointLightHelper = new THREE.PointLightHelper(pointLight);
    scene.add(pointLightHelper);

    const pointLight2 = new THREE.PointLight("#FF9E09", 50, 100);
    pointLight2.position.set(2.2, 6, -3);
    scene.add(pointLight2);

    const pointLightHelper2 = new THREE.PointLightHelper(pointLight2);
    scene.add(pointLightHelper2);

    // 크리스마스 전구 
    // Create tree lights in a spiral pattern
    const numLights = 50; // Reduced number of lights
    const lightColors = [0xff0000, 0xffa500, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0xee82ee]; // Different colors (rainbow order)
    const treeHeight = 3.5; // Further reduced tree height
    const treeRadius = 2; // Increased tree radius
    const turns = 4;
    const offsetX = -4.2;
    const offsetY = 1.9;
    const offsetZ = -2.3;

    for (let i = 0; i < numLights; i++) {
      const color = lightColors[i % lightColors.length]; // Use colors in a sequential pattern
      const light = new THREE.PointLight(color, 1, 5);

      const t = i / numLights;
      const angle = t * turns * Math.PI * 2;
      const y = t * treeHeight + offsetY;
      const x = Math.cos(angle) * (treeRadius * (1 - t)) + offsetX;
      const z = Math.sin(angle) * (treeRadius * (1 - t)) + offsetZ;

      light.position.set(x, y, z);
      scene.add(light);

      // Create a small sphere to represent the light
      const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      const sphereMaterial = new THREE.MeshBasicMaterial({ color });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(x, y, z);
      scene.add(sphere);
    }

    // 별빛을 표현할 재질 생성
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff, // 별빛 색상
        size: 0.3 // 별빛 크기
    });

    // 별빛 점들 생성
    const starGeometry = new THREE.BufferGeometry();

    const stars = new THREE.Points(starGeometry, starMaterial);
        // 버퍼 속성 생성
    const positions = new Float32Array(1000 * 3); // 1000개의 점 * 3차원 좌표 (x, y, z)
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // 별빛을 생성하고 버퍼 속성에 추가하는 반복문
    for (let i = 0; i < 1000; i++) {
        const star = new THREE.Vector3(
            Math.random() * 600 - 300, // x 좌표
            Math.random() * 600 - 300, // y 좌표
            Math.random() * 600 - 300  // z 좌표
        );
        positions[i * 3] = star.x;
        positions[i * 3 + 1] = star.y;
        positions[i * 3 + 2] = star.z;
    }

    // 씬에 별빛 객체 추가
    scene.add(stars);

    // 사운드 매니저 생성
    const audioLoader = new THREE.AudioLoader();
    const listener = new THREE.AudioListener();
    const sound = new THREE.PositionalAudio(listener);

    // 사운드 파일 로드
    audioLoader.load('/models/sounds/magic-of-christmas.mp3', function(buffer) {
        sound.setBuffer(buffer);
        sound.setRefDistance(20);
        //sound.play(); // 화면 로드시 재생
    });

    //AxesHelper;
    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    // Dat GUI
    const gui = new dat.GUI();
    gui.add(camera.position, "x", -10, 100, 0.1).name("카메라 X");
    gui.add(camera.position, "y", -10, 100, 0.1).name("카메라 Y");
    gui.add(camera.position, "z", -10, 100, 0.1).name("카메라 Z");
    

    // 그리기
    const clock = new THREE.Clock();

    function draw() {
        const delta = clock.getDelta();

        renderer.setAnimationLoop(draw);

            // 별빛 회전 효과 추가
        stars.rotation.x += 0.001;
        stars.rotation.y += 0.001;


        renderer.render(scene, camera);
    }

    function setSize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }

    // 이벤트
    window.addEventListener("resize", setSize);

    draw();

      // 로딩 화면을 숨기는 함수
      function hideLoadingScreen() {
        loadingScreen.style.display = 'none';
        canvas.style.display = 'block';
      }
   
}

