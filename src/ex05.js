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
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 0;
    camera.position.y = 13;
    camera.position.z = 8;
    scene.add(camera);

    // Controls (카메라 시점 조절)
    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true; // 관성 효과 활성화
    controls.dampingFactor = 0.5; // 관성의 정도

    // 회전 범위 설정
    controls.minAzimuthAngle = 0 ; // -90도 -Math.PI / 2
    controls.maxAzimuthAngle = Math.PI / 2;  // 90도

    // 회전 비활성화
    // controls.enableRotate = false;

    // 카메라가 타겟에 가까워질 수 있는 최소 거리 설정
    controls.minDistance = 10;

    // 카메라가 타겟으로부터 멀어질 수 있는 최대 거리 설정
    controls.maxDistance = 20;

    const ambientLight = new THREE.AmbientLight("#ffffff", 1000);
    scene.add(ambientLight); 

    const spotLight1 = new THREE.SpotLight("#FF9E09", 1000);
    spotLight1.castShadow = true;

    spotLight1.position.set(0,15,0);
    spotLight1.angle = Math.PI /8; // 조명의 최대 확산 각도를 30도로 설정 (라디안 단위)
    spotLight1.penumbra = 0.1; 

    // 그림자 좀더 선명하게 보이는 설정
    spotLight1.shadow.mapSize.width = 1024;
    spotLight1.shadow.mapSize.height = 1024;


    scene.add(spotLight1);

    // Add SpotLightHelpers
    // const spotLightHelper1 = new SpotLightHelper(spotLight1);
    // scene.add(spotLightHelper1);
    

    // gltf loader (gltf 파일 불러오기)
    let mixer;
    const gltfLoader = new GLTFLoader();

    let room;
    let letter;
    gltfLoader.load("/models/odomak.glb", (gltf) => {
        if (gltf.scene) {
            gltf.scene.castShadow = true;
    
            gltf.scene.traverse((child) => {
                //console.log(child);
                if (child.name === "Plane013"
                        //||child.name === "Plane009"   //원통
                        || child.name === "Cube005"     //벽돌
                        || child.name === "Cube006"     //창문 반사효과
                        || child.name === "pngfindcom-medieval-banner-png-1287972"
                        || child.name === "Cube010"     //창문 옆 횟불
                        || child.name === "Cylinder003"
                        || child.name === "Cylinder005"
                        //|| child.name === "Plane010"
                        //|| child.name === "Plane011"
                ) {
                    child.visible = false;
                } else if( child.name === "Cube007"     //벽면
                        || child.name === "Plane"       //판자
                        || child.name === "Plane001"    //판자1
                        || child.name === "Plane002"    //판자2
                        || child.name === "Plane003"    //판자3
                        || child.name === "Plane004"    //판자4
                        || child.name === "Plane005"    //판자5
                ){    // 벽면
                    // 현재 위치를 저장
                    const originalPosition = child.position.clone();

                    // x축 스케일을 1.5배로 늘림
                    const scaleFactor = 1.5;
                    child.scale.x *= scaleFactor;

                    // 새로운 경계 상자를 계산
                    const box = new THREE.Box3().setFromObject(child);
                    const size = box.getSize(new THREE.Vector3());

                    // x축 중심을 기준으로 위치 조정
                    child.position.set(
                        originalPosition.x + (size.x / 2 - (size.x / scaleFactor) / 2),
                        originalPosition.y,
                        originalPosition.z
                    );
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
            room.position.set(10, 1, 13);
            room.scale.set(0.03, 0.03, 0.03);
            scene.add(room);

            hideLoadingScreen();
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
        tree.position.set(5, 0.5, -3);
        tree.scale.set(0.5, 0.5, 0.5);
        scene.add(tree);

    }, undefined, (error) => {
        console.error('GLTF 파일 로드 오류', error);
    });


    let giftBox;
    let giftBoxPosition = [
        { "x" : 0.3 , "y" : 2.55 , "z" : -1.6 }, // 책상위 좌표
        { "x" : 4   , "y" : 1    , "z" : 0    }, // 트리옆
        { "x" : -4.5, "y" : 2.55 , "z" : -1   }, // 술통 위
    ]; 
    gltfLoader.load("/models/giftBox_joinSpare.glb", (gltf) => {

        if (gltf.scene) {
            gltf.scene.castShadow = true;
    
            gltf.scene.traverse((child) => {

                //Cylinder
                if (    child.name == "rebon" 
                    ||  child.name == "BezierCircle"
                    ||  child.name == "BezierCircle001"
                    ||  child.name == "BezierCircle002"
                    ||  child.name == "BezierCircle003"  
                ) {
                    const rebonMaterial = child.material.clone();
                    rebonMaterial.color.set("red");
                    
                    child.material = rebonMaterial;
                    if (child.isMesh) {
                        child.material = rebonMaterial;
                    }
                } else if (child.name == "cube" ){
                    const cubeMaterial = child.material.clone();
                    cubeMaterial.color.set("green");
                    
                    child.material = cubeMaterial;
                    if (child.isMesh) {
                        child.material = cubeMaterial;
                    }
                } 
                child.castShadow = true; // 그림자 캐스팅
                child.receiveShadow = true; // 그림자 수신
                
            });
        }
        giftBox = gltf.scene;
        console.log(giftBox);
        //giftBox.position.set(0.3, 2.55, -1.6);    // 책상위 좌표
        //giftBox.position.set(4, 1, 0);            // 트리옆에
        //giftBox.position.set(-4.5, 2.55, -1);     // 술통 위에
        // 바닥을 클릭했을때는 바닥 좌표위에 올라가도록 설정 필요

        giftBox.scale.set(0.7, 0.7, 0.7);
        giftBox.visible = false;
        scene.add(giftBox);

    }, undefined, (error) => {
        console.error('GLTF 파일 로드 오류', error);
    });


    // CylinderGeometry를 이용하여 기둥의 형태를 정의합니다.
    const onegeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);

    // 갈색으로 색칠된 재질을 만듭니다.
    const onematerial = new THREE.MeshBasicMaterial({ color: "#7C3E29" }); // 갈색 색상

    // 기둥의 메쉬를 생성합니다.
    const cylinder = new THREE.Mesh(onegeometry, onematerial);
    cylinder.position.set(5, 1.3, -2.5);

    // scene에 기둥을 추가합니다.
    scene.add(cylinder);


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
    // const numLights = 30; 
    // const lightColors = [0xff0000, 0xffa500, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0xee82ee]; 
    // const treeHeight = 3.5; 
    // const treeRadius = 2; 
    // const turns = 3;
    // const offsetX = 4.7;
    // const offsetY = 2;
    // const offsetZ = -2.3;

    // for (let i = 0; i < numLights; i++) {
    //   const color = lightColors[i % lightColors.length]; 
    //   const light = new THREE.PointLight(color, 1, 5);

    //   const t = i / numLights;
    //   const angle = t * turns * Math.PI * 2;
    //   const y = t * treeHeight + offsetY;
    //   const x = Math.cos(angle) * (treeRadius * (1 - t)) + offsetX;
    //   const z = Math.sin(angle) * (treeRadius * (1 - t)) + offsetZ;

    //   light.position.set(x, y, z);
    //   scene.add(light);

    //   const sphereGeometry = new THREE.SphereGeometry(0.1, 18, 18);
    //   const sphereMaterial = new THREE.MeshBasicMaterial({ color });
    //   const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    //   sphere.position.set(x, y, z);
    //   scene.add(sphere);
    // }

    // // 별빛을 표현할 재질 생성
    // const starMaterial = new THREE.PointsMaterial({
    //     color: 0xffffff, // 별빛 색상
    //     size: 0.3 // 별빛 크기
    // });

    // // 별빛 점들 생성
    // const starGeometry = new THREE.BufferGeometry();

    // const stars = new THREE.Points(starGeometry, starMaterial);
    //     // 버퍼 속성 생성
    // const positions = new Float32Array(1000 * 3); // 1000개의 점 * 3차원 좌표 (x, y, z)
    // starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // // 별빛을 생성하고 버퍼 속성에 추가하는 반복문
    // for (let i = 0; i < 1000; i++) {
    //     const star = new THREE.Vector3(
    //         Math.random() * 600 - 300, // x 좌표
    //         Math.random() * 600 - 300, // y 좌표
    //         Math.random() * 600 - 300  // z 좌표
    //     );
    //     positions[i * 3] = star.x;
    //     positions[i * 3 + 1] = star.y;
    //     positions[i * 3 + 2] = star.z;
    // }

    // // 씬에 별빛 객체 추가
    // scene.add(stars);

    // 눈송이효과
    const snowflakes = [];

    function createSnowflake() {
        const geometry = new THREE.CircleGeometry(0.1, 20);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const snowflake = new THREE.Mesh(geometry, material);

        snowflake.position.x = Math.random() * 100 - 50; // x 좌표를 -100에서 100까지로 제한
        snowflake.position.y = Math.random() * 100 - 50; // y 좌표를 -100에서 100까지로 제한
        snowflake.position.z = Math.random() * 100 - 50; // z 좌표를 -100에서 100까지로 제한
        snowflake.velocity = Math.random() * 0.5 + 0.1;

        scene.add(snowflake);
        snowflakes.push(snowflake);
    }

    // 눈송이 여러개 생성
    for (let i = 0; i < 2500; i++) {
        createSnowflake();
    }

    // 사운드 매니저 생성
    const audioLoader = new THREE.AudioLoader();
    const listener = new THREE.AudioListener();
    const sound = new THREE.PositionalAudio(listener);

    // 사운드 파일 로드
    audioLoader.load('/sounds/joyful-snowman.mp3', function(buffer) {
        sound.setBuffer(buffer);
        sound.setRefDistance(20);
        sound.setLoop(true);
        sound.setVolume(0.2);
        sound.play(); // 화면 로드시 재생
    });

    camera.add(listener);

    // 오디오 객체를 씬에 추가
    scene.add(sound);

    // 사용자 인터랙션을 통한 재생/정지 버튼 생성
    const button = document.createElement('button');
    button.innerText = "Pause Sound"; // 디폴트로 재생 중이므로 정지 버튼 활성화
    button.style.position = 'absolute';
    button.style.top = '10px';
    button.style.left = '10px';
    button.style.zIndex = 1000;
    document.body.appendChild(button);

    let isPlaying = true; // 디폴트로 재생 중

    button.addEventListener('click', function() {
        if (isPlaying) {
            sound.pause(); // 소리 정지
            button.innerText = "Play Sound";
        } else {
            sound.play(); // 소리 재생
            button.innerText = "Pause Sound";
        }
        isPlaying = !isPlaying;
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
        //stars.rotation.x += 0.001;
        //stars.rotation.y += 0.001;

        renderer.render(scene, camera);

        //각 눈송이마다 이동 처리
        for (const snowflake of snowflakes) {
            snowflake.position.y -= snowflake.velocity;
                if (snowflake.position.y < -50) {
                    snowflake.position.y = 50;
                    snowflake.position.x = Math.random() * 200 - 50;
                    snowflake.position.z = Math.random() * 200 - 50;
                }
        }
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

    //window.addEventListener('click', onDocumentClick);

    let isDragging = false;
    let mouseDownTime = 0;

    // 마우스 다운 이벤트 핸들러
    function onDocumentMouseDown(event) {
        isDragging = false;
        mouseDownTime = Date.now();
    }

    // 마우스 무브 이벤트 핸들러
    function onDocumentMouseMove(event) {
        isDragging = true;
    }

    // 마우스 업 이벤트 핸들러
    function onDocumentMouseUp(event) {
        if (!isDragging) {
            // 짧은 클릭인 경우에만 onDocumentClick 호출
            onDocumentClick(event);
        } else {
            const clickDuration = Date.now() - mouseDownTime;
            if (clickDuration < 200) { // 200ms 이하인 경우 짧은 클릭으로 간주
                onDocumentClick(event);
            }
        }
        isDragging = false;
    }

    // 클릭한 객체 저장 변수
    let lastClickedObjectName = "";

    function onDocumentClick(event) {
        event.preventDefault();

        // 마우스의 클릭 위치를 정규화된 장치 좌표로 변환
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        // Raycaster를 생성하여 클릭한 객체를 찾음
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        // 클릭된 객체들을 저장할 배열
        const intersects = raycaster.intersectObject(room, true);

        // 클릭된 객체가 있을 경우
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;

            console.log(intersects[0].object.name);

            // 클릭된 객체의 이름이 "pngfind.com-medieval-banner-png-1287972"인지 확인
            if (clickedObject.name === "Plane007") {
                // 이미지를 보여주는 함수 호출
                showImageFullScreen('/images/letter.png', 'default');
            } else if (clickedObject.name === "Cube004"        || clickedObject.name.includes("Cube008") 
                    || clickedObject.name.includes("Cube007")  || clickedObject.name.includes("Plane006") 
                    || clickedObject.name.includes("Plane005") || clickedObject.name.includes("Plane007") 
                    || clickedObject.name.includes("Plane009")) {
                lastClickedObjectName = clickedObject;
                showImageFullScreen('/images/question01.png', 'custom');
            }
        }
    }

    // 버튼 위치를 조정하는 함수
    function positionButtons(imageElement, yesButton, noButton) {
        const imgRect = imageElement.getBoundingClientRect();
        const btnSize = imgRect.width * 0.2;

        yesButton.style.width = `${btnSize}px`;
        yesButton.style.height = 'auto';
        yesButton.style.left = `${imgRect.left + imgRect.width * 0.25 - btnSize / 2}px`;
        yesButton.style.top = `${imgRect.bottom - btnSize * 1.1}px`;

        noButton.style.width = `${btnSize}px`;
        noButton.style.height = 'auto';
        noButton.style.left = `${imgRect.left + imgRect.width * 0.75 - btnSize / 2}px`;
        noButton.style.top = `${imgRect.bottom - btnSize * 1.1}px`;
    }

    // 전체 화면에 이미지를 보여주는 함수
    function showImageFullScreen(imageUrl, styleType) {
        // 기존 이미지 요소가 있는지 확인
        if (document.getElementById('fullscreenImage')) {
            return;
        }

        const imageElement = document.createElement('img');
        imageElement.src = imageUrl;
        imageElement.id = 'fullscreenImage';

        if (styleType === 'custom') {
            imageElement.style.maxWidth = '90vh';
            imageElement.style.maxHeight = '70vw';

            const yesButton = document.createElement('img');
            yesButton.src = '/images/yesBtn.png';
            yesButton.id = 'yesButton';
            yesButton.style.position = 'absolute';
            yesButton.style.zIndex = '10000';

            const noButton = document.createElement('img');
            noButton.src = '/images/noBtn.png';
            noButton.id = 'noButton';
            noButton.style.position = 'absolute';
            noButton.style.zIndex = '10000';

            document.body.appendChild(imageElement);
            document.body.appendChild(yesButton);
            document.body.appendChild(noButton);

            imageElement.onload = () => positionButtons(imageElement, yesButton, noButton);
            window.addEventListener('resize', () => positionButtons(imageElement, yesButton, noButton));

            noButton.addEventListener('click', () => {
                imageElement.remove();
                yesButton.remove();
                noButton.remove();
                window.removeEventListener('resize', () => positionButtons(imageElement, yesButton, noButton));
            });

            yesButton.addEventListener('click', () => {
                console.log('Yes button clicked');
                imageElement.remove();
                yesButton.remove();
                noButton.remove();

                if (lastClickedObjectName && lastClickedObjectName.name.includes("Plane009")) {
                    giftBox.visible = true;
                    giftBox.position.set(giftBoxPosition[2].x,giftBoxPosition[2].y,giftBoxPosition[2].z);

                    setTimeout(() => {

                        const loadingImage = document.getElementById('loading-image');
                        const loadingText = document.querySelector('.loading-text');
                        // 로딩 이미지의 src 경로 변경
                        loadingImage.src = '/images/giftGivingSuccess.gif'; // 새로운 로딩 이미지 경로로 변경

                        // loading-text 숨기기
                        loadingText.style.display = 'none';
                        loadingScreen.style.display = 'block';
                        canvas.style.display = 'none';
                    }, 2000); // 2초 후에 실행
                }
                window.removeEventListener('resize', () => positionButtons(imageElement, yesButton, noButton));




                
            });

        } else {
            imageElement.style.maxWidth = '70vw';
            imageElement.style.maxHeight = '90vh';
            document.body.appendChild(imageElement);
        }

        imageElement.style.position = 'fixed';
        imageElement.style.top = '50%';
        imageElement.style.left = '50%';
        imageElement.style.transform = 'translate(-50%, -50%)';
        imageElement.style.zIndex = '9999';

        imageElement.addEventListener('click', () => {
            imageElement.remove();
            if (document.getElementById('yesButton')) document.getElementById('yesButton').remove();
            if (document.getElementById('noButton')) document.getElementById('noButton').remove();
            window.removeEventListener('resize', () => positionButtons(imageElement, yesButton, noButton));
        });
    }

   
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false); 
}

