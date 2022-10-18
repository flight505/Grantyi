import * as THREE from "three";
import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";
import fragmentParticles from "./shader/fragmentParticles.glsl";
import vertexParticles from "./shader/vertexParticles.glsl";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio, 2);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );

    // let frustumSize = 10;
    // let aspect = window.innerWidth / window.innerHeight;
    // this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );
    this.camera.position.set(0, 0, 6);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.isPlaying = true;

    this.addObjects();
    this.addParticles();
    this.resize();
    this.render();
    this.setupResize();
    // this.settings(); // enable for gui
  }

  settings() {
    let that = this;
    this.settings = {
      progress: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  // add objects to scene here
  addObjects() {
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1)
        }
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment
    });

    this.geometry = new THREE.SphereBufferGeometry(1.5, 462, 462); // width, height, widthSegments, heightSegments

    this.plane = new THREE.Mesh(this.geometry, this.material); // geometry, material
    this.scene.add(this.plane); // add test plane
  }

  addParticles() {
    let that = this;
    this.particleMaterial = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1)
        }
      },
      // wireframe: true,
      transparent: true,
      vertexShader: vertexParticles,
      fragmentShader: fragmentParticles
    });

    let numParticles = 6000;
    let positions = new Float32Array(numParticles * 3);
    this.particleGeometry = new THREE.BufferGeometry();


    let inc = Math.PI * (3 - Math.sqrt(5));
    let off = 2 / numParticles;

    for (let i = 0; i < numParticles; i++) {
      let y = i * off - 1 + (off / 2);
      let r = Math.sqrt(1 - y*y);
      let phi = i * inc;
      let rad = 2.5;
    
      positions[3*i] = rad*Math.cos(phi) * r;
      positions[3*i+1] = rad*y;  
      positions[3*i+2] = rad*Math.sin(phi) * r;
    }

    this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));



    // this.particleGeometry = new THREE.SphereBufferGeometry(1.5, 162, 162); // width, height, widthSegments, heightSegments

    this.points = new THREE.Points(this.particleGeometry, this.particleMaterial); // geometry, material
    this.scene.add(this.points); // add particles to scene
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.render()
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying) return;
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    this.particleMaterial.uniforms.time.value = this.time;

    this.points.rotation.y = this.time/10;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch({
  dom: document.getElementById("container")
});
