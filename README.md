# ThreeJS
Three.js

ThreeJS를 개발하기 위해 알아야 하는 기본적인 내용들은 다음과 같습니다:

1. **ThreeJS란?**
   - ThreeJS는 WebGL을 사용하여 3D 그래픽을 웹 브라우저에서 렌더링하기 위한 JavaScript 라이브러리입니다. 이를 통해 사용자는 복잡한 수학 계산 없이도 3D 콘텐츠를 쉽게 만들고 웹 페이지에 표시할 수 있습니다.

2. **기본 구성 요소**
   - **Scene**: 모든 3D 객체들이 위치하는 공간입니다.
   - **Camera**: 3D 공간을 어떤 시점에서 바라볼지 결정합니다.
   - **Renderer**: Scene과 Camera를 기반으로 실제로 화면에 그려주는 역할을 합니다.
   - **Mesh**: 3D 객체를 나타내며, Geometry(형태)와 Material(재질)로 구성됩니다.

3. **개발 환경 설정**
   - ThreeJS를 사용하기 위해서는 먼저 `<script>` 태그를 사용하여 ThreeJS 라이브러리를 HTML 파일에 포함시켜야 합니다. 또는 npm을 통해 ThreeJS를 프로젝트에 설치할 수도 있습니다.

4. **기본 예제**
   - 간단한 3D 큐브를 생성하고 화면에 렌더링하는 기본 코드 예제는 다음과 같습니다:
     ```javascript
     // Scene 생성
     var scene = new THREE.Scene();
     
     // Camera 생성
     var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
     
     // Renderer 생성
     var renderer = new THREE.WebGLRenderer();
     renderer.setSize(window.innerWidth, window.innerHeight);
     document.body.appendChild(renderer.domElement);
     
     // Cube 생성
     var geometry = new THREE.BoxGeometry();
     var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
     var cube = new THREE.Mesh(geometry, material);
     scene.add(cube);
     
     camera.position.z = 5;
     
     // 렌더링 루프
     function animate() {
       requestAnimationFrame(animate);
       cube.rotation.x += 0.01;
       cube.rotation.y += 0.01;
       renderer.render(scene, camera);
     }
     animate();
     ```
5. **학습 자료**
   - ThreeJS 공식 문서([https://threejs.org/docs/](https://threejs.org/docs/))를 참고하여 더 다양한 기능과 세부적인 사용 방법을 학습할 수 있습니다.

ThreeJS를 통해 웹에서 실감 나는 3D 경험을 제공할 수 있으며, 이를 위해 위의 기본적인 내용들을 숙지하는 것이 중요합니다.
