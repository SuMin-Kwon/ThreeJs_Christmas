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
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        canvas.style.display = 'block';
        hideLoadingScreen();
    }, 1000); // 3초 후에 canvas를 보여줍니다. (3000 밀리초 = 3초)

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
    scene.background = new THREE.Color("#643c5d");

    // Camera (2D -> 40, 3D -> 75 )
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 0;
    camera.position.y = 5;
    camera.position.z = 4;
    scene.add(camera);

    // Controls (카메라 시점 조절)
    const controls = new OrbitControls(camera, renderer.domElement);

    const ambientLight = new THREE.AmbientLight("#fffcc3", 0.1);
    scene.add(ambientLight);     

    //2D 이미지로 가져올때 

    // 비디오 텍스처로 사용할 비디오 엘리먼트 생성
    const video = document.createElement('video');
    video.src = '/models/pinkRoom.mp4';
    video.loop = true;
    video.autoplay = true;
    video.muted = true; // Chrome의 자동재생 정책에 따라 mute 필요

    // 비디오 텍스처 생성
    const texture = new THREE.VideoTexture(video);

    // 텍스처가 업데이트될 때마다 렌더러를 업데이트하도록 설정
    video.addEventListener('canplay', function() {
        texture.needsUpdate = true;
    });

    // 비디오 재생
    video.play();


    // 비디오 텍스처를 사용하는 재질 생성
    const material = new THREE.MeshBasicMaterial({ map: texture });

    // 평면(Plane) 메쉬 생성
    const geometry = new THREE.PlaneGeometry(10, 10);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

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
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'none';
        
        // canvas를 표시합니다.
        const canvas = document.getElementById('three-canvas');
        canvas.style.display = 'block';
      }
   
}

