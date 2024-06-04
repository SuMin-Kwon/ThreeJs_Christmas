import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import dat from "dat.gui";
import gsap from "gsap";

// ----- 주제: glb 파일 애니메이션 효과 추가

export default function example() {
    // Renderer
    const canvas = document.querySelector("#three-canvas");
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

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 25;
    camera.position.z = 50;
    //camera.rotation.y += Math.PI / 2;
    scene.add(camera);

    const directionalLight = new THREE.DirectionalLight("white", 5);
    directionalLight.position.x = 1;
    directionalLight.position.z = 2;
    scene.add(directionalLight);

    // Controls (카메라 시점 조절)
    const controls = new OrbitControls(camera, renderer.domElement);

    // gltf loader (gltf 파일 불러오기)

    let mixer;
    const gltfLoader = new GLTFLoader();


    // Light
    const ambientLight = new THREE.AmbientLight("#FFFFFF", 10);
    scene.add(ambientLight);

    const spotLightDistance = 5;
    const spotLight1 = new THREE.SpotLight("#FFFFFF", 50);
    spotLight1.castShadow = true;
    // 그림자 좀더 선명하게 보이는 설정
    spotLight1.shadow.mapSize.width = 2048;
    spotLight1.shadow.mapSize.height = 2048;
    const spotLight2 = spotLight1.clone();
    const spotLight3 = spotLight1.clone();
    const spotLight4 = spotLight1.clone();
    spotLight1.position.set(-spotLightDistance, spotLightDistance, spotLightDistance);
    spotLight2.position.set(spotLightDistance, spotLightDistance, spotLightDistance);
    spotLight3.position.set(-spotLightDistance, spotLightDistance, -spotLightDistance);
    spotLight4.position.set(spotLightDistance, spotLightDistance, -spotLightDistance);

    scene.add(spotLight1, spotLight2, spotLight3, spotLight4);
    
    
    // room
    let desk;
    let room;
    let windowPosition;

    // 회색 
    // AllHouse.glb
    // 
    gltfLoader.load("/models/christmas/winter_house_night.glb", (gltf) => {

        gltf.scene.castShadow = true;
        gltf.scene.receiveShadow = true;
        
        gltf.scene.traverse((child) => {
            console.log(child);
        });
        // callback 함수
        room = gltf.scene.children[0]; // -> mesh
        //room.rotation.z = -Math.PI / 2;
        console.log(room);
        //room.scale.set(0.1, 0.1, 0.1);
        scene.add(room);

        hideLoadingScreen(); // 로딩 화면 숨기기

    });

    //배경



    //AxesHelper;
    //const axesHelper = new THREE.AxesHelper(100);
    //scene.add(axesHelper);

    // Dat GUI
    const gui = new dat.GUI();
    gui.add(camera.position, "x", -10, 5, 0.1).name("카메라 X");
    gui.add(camera.position, "y", -10, 100, 0.1).name("카메라 Y");
    gui.add(camera.position, "z", -10, 100, 0.1).name("카메라 Z");
    

    // 그리기
    const clock = new THREE.Clock();



    function draw() {
        const delta = clock.getDelta();

        renderer.render(scene, camera);
        renderer.setAnimationLoop(draw);
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
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'none';
        
        // canvas를 표시합니다.
        const canvas = document.getElementById('three-canvas');
        canvas.style.display = 'block';
      }
   
}

