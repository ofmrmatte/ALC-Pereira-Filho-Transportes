import { Vector3, Vector2, MeshStandardMaterial, MeshBasicMaterial, Mesh, BoxGeometry, CylinderGeometry, Group, PlaneGeometry, CatmullRomCurve3, TubeGeometry, BufferGeometry, Float32BufferAttribute, CanvasTexture, SRGBColorSpace, DoubleSide, TextureLoader, Raycaster, WebGLRenderer, ACESFilmicToneMapping, PCFShadowMap, Scene, Color, Fog, PerspectiveCamera, PMREMGenerator, HemisphereLight, DirectionalLight } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DESKTOP_DURATIONS, MOBILE_DURATIONS, evaluateChapter, locateChapter, evaluatePageState } from "./state.js";
import { frameCamera } from "./framing.js";
import { buildWorld } from "./world.js";
import { refineMaterials, brandFleet } from "./appearance.js";
const clamp = v => Math.max(0,Math.min(1,v));
const between = (v,a,b) => clamp((v-a)/(b-a));
const smooth = v => { v=clamp(v); return v*v*(3-2*v); };
const mix = (a,b,t) => a+(b-a)*t;
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
var sceneHost = document.querySelector("[data-scene]"), journey = document.querySelector(".experience"), motionQuery = matchMedia("(prefers-reduced-motion: reduce)"), reducedMotion = motionQuery.matches, contextLost = false, renderer, scene, camera, sun, truck, world, pendingFrame = 0, scrollDistance = 0, renderCount = 0, timeline, stageHeight = innerHeight, viewportWidth = innerWidth, viewportHeight = innerHeight, mobile = innerWidth < 768;
var cameraPosition = new Vector3(), cameraTarget = new Vector3(), cameraOffset = new Vector3(), cameraDirection = new Vector3(), panels = [...document.querySelectorAll(".scene-copy")], CHAPTER_IDS = ["origem", "caminho", "conexoes", "operacao", "trajetoria", "destino"], chapterLinks = [...document.querySelectorAll("[data-chapter-link]")], loading = document.querySelector(".scene-loading"), pageId = document.body.dataset.page || location.pathname.split("/").filter(Boolean)[0] || "home", rig;
function showStaticContent() {
  journey?.classList.add("is-static"), panels.forEach((e, t) => {
    e.classList.add("is-active"), e.removeAttribute("aria-hidden"), e.removeAttribute("inert"), e.style.opacity = "1", e.style.transform = "none", e.id = CHAPTER_IDS[t], e.querySelector(".static-art")?.removeAttribute("hidden");
  }), document.querySelectorAll("[data-anchor]").forEach((e) => e.removeAttribute("id"));
  let s37 = document.querySelector(".motion-toggle");
  reducedMotion && s37 && (s37.classList.add("motion-toggle--fixed"), document.body.append(s37)), loading && loading.replaceChildren();
}
function requestRender() {
  !pendingFrame && !document.hidden && !contextLost && (pendingFrame = requestAnimationFrame(renderFrame));
}
function labelTexture(s37, e = 1024, t = 128, n = "#252e30", i = "#f1f0eb") {
  let r = document.createElement("canvas");
  r.width = e, r.height = t;
  let a = r.getContext("2d");
  a.fillStyle = n, a.fillRect(0, 0, e, t), a.fillStyle = i, a.font = `600 ${Math.round(t * 0.42)}px Manrope,Arial,sans-serif`, a.textAlign = "center", a.textBaseline = "middle", a.fillText(s37, e / 2, t * 0.53, e * 0.88);
  let o = new CanvasTexture(r);
  return o.colorSpace = SRGBColorSpace, o.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy()), o;
}
function addBranding() {
  for (const { mesh, label } of world.signs) {
    mesh.geometry.computeBoundingBox();
    const size = mesh.geometry.boundingBox.getSize(new Vector3());
    const sign = new Mesh(new PlaneGeometry(size.x * 0.96, size.y * 0.9), new MeshBasicMaterial({ map: labelTexture(label), side: DoubleSide }));
    sign.position.z = size.z / 2 + 0.003;
    mesh.add(sign);
  }
  brandFleet(world, truck, rig, renderer).then(requestRender).catch(error => console.error("ALC: falha ao aplicar a identidade visual.", error));
}
function bindRig() {
  let s37 = (e) => truck.getObjectByName(e);
  if (rig = { tractor: s37("tractorRoot"), trailer: s37("trailerPivot"), left: s37("rearDoorLeft"), right: s37("rearDoorRight"), wheels: [], cargo: s37("cargoRoot"), pallet: s37("cargoPallet_0_-1"), locks: [s37("lockBarLeft"), s37("lockBarRight")], steer: [s37("frontSteerLeft"), s37("frontSteerRight")] }, truck.traverse((e) => {
    e.name.startsWith("wheel_") && rig.wheels.push(e);
  }), !rig.left || !rig.right || !rig.trailer) throw new Error("Articulated model is missing its required pivots.");
}
function applyState(s37) {
  truck.position.set(...s37.truckPosition), truck.rotation.y = s37.heading, rig.trailer.rotation.y = s37.trailerAngle, rig.left.rotation.y = s37.doors[0] * Math.PI * 1.5, rig.right.rotation.y = -s37.doors[1] * Math.PI * 1.5;
  for (let n of rig.locks) n && (n.rotation.y = s37.locksOpen * Math.PI / 2);
  for (let n of rig.wheels) n.rotation.x = s37.wheelAngle;
  for (let n of rig.steer) n && (n.rotation.y = s37.frontSteer);
  rig.pallet && (rig.pallet.position.z = -s37.unload * 3.8), truck.updateMatrixWorld(true), world.parcel.position.set(38, 0, mix(276, 256, smooth(s37.parcelProgress))), world.lidL.rotation.z = s37.parcelOpen * 1.65, world.lidR.rotation.z = -s37.parcelOpen * 1.65, world.unloadRamp.position.set(mix(-5, 0, smooth(between(s37.progress, 0.32, 0.38))), 0, 348), world.unloadRamp.visible = s37.chapter === 5 && s37.progress > 0.28, cameraTarget.set(...s37.target), frameCamera(camera, truck, s37, { mobile: mobile, aspect: sceneHost.clientWidth / Math.max(1, sceneHost.clientHeight) });
  let e = s37.chapter === 3 ? world.parcel.position : s37.focus ? truck.position : cameraTarget;
  sun.target.position.copy(e), sun.position.copy(e).add(new Vector3(-35, 50, -25)), sun.target.updateMatrixWorld();
  let t = s37.chapter === 2 ? 100 : 32;
  Object.assign(sun.shadow.camera, { left: -t, right: t, top: t, bottom: -t }), sun.shadow.camera.updateProjectionMatrix(), sceneHost.dataset.chapter = String(s37.chapter + 1), sceneHost.dataset.progress = s37.progress.toFixed(4), sceneHost.dataset.doors = s37.doors.map((n) => n.toFixed(3)).join(","), sceneHost.dataset.wheel = s37.wheelAngle.toFixed(4);
}
function updateEditorial(s37, e) {
  reducedMotion || (panels.forEach((t, n) => {
    let i = n === s37;
    if (t.classList.toggle("is-active", i), t.setAttribute("aria-hidden", String(!i)), t.inert = !i, i) {
      let r = s37 === 0 ? 1 : between(e, 0, 0.065), a = s37 === 5 ? 1 : 1 - between(e, 0.93, 1), o = Math.min(r, a);
      t.style.opacity = String(o), t.style.transform = `translateY(${(1 - r) * 14 - (1 - a) * 12}px)`;
    }
  }), chapterLinks.forEach((t, n) => {
    t.classList.toggle("active", n === s37), n === s37 ? t.setAttribute("aria-current", "step") : t.removeAttribute("aria-current");
  }), document.querySelectorAll(".process-steps span").forEach((t, n) => t.classList.toggle("active", n === Math.min(3, Math.floor(e * 4)))));
}
function internalPageState() {
  let s37 = [...document.querySelectorAll(".solution-item")].findIndex((e) => e.classList.contains("open"));
  return evaluatePageState(pageId, s37);
}
function renderFrame() {
  if (pendingFrame = 0, !renderer || !truck || document.hidden || contextLost) return;
  let s37 = sceneHost.clientWidth, e = sceneHost.clientHeight;
  if (!s37 || !e) return;
  let t = Math.min(devicePixelRatio, mobile ? 1.5 : 1.75, Math.sqrt(25e5 / (s37 * e)));
  renderer.getPixelRatio() !== t && renderer.setPixelRatio(t);
  let n = renderer.getSize(new Vector2());
  (n.x !== s37 || n.y !== e) && renderer.setSize(s37, e, false);
  let i;
  if (journey) {
    let r = locateChapter(scrollDistance, mobile ? MOBILE_DURATIONS : DESKTOP_DURATIONS);
    i = evaluateChapter(reducedMotion ? 0 : r.chapter, reducedMotion ? 0 : r.progress), updateEditorial(i.chapter, i.progress);
  } else i = internalPageState();
  applyState(i), renderer.render(scene, camera), renderCount++, renderer.domElement.dataset.ready = "true", sceneHost.classList.add("has-frame"), sceneHost.dataset.renderCount = String(renderCount), sceneHost.dataset.drawCalls = String(renderer.info.render.calls), sceneHost.dataset.triangles = String(renderer.info.render.triangles);
}
function setupTimeline() {
  if (timeline?.scrollTrigger?.kill(), timeline?.kill(), !journey) return;
  let s37 = mobile ? MOBILE_DURATIONS : DESKTOP_DURATIONS, e = s37.reduce((r, a) => r + a, 0);
  if (reducedMotion) {
    showStaticContent(), requestRender();
    return;
  }
  journey.classList.remove("is-static"), panels.forEach((r) => {
    r.removeAttribute("id"), r.querySelector(".static-art")?.setAttribute("hidden", "");
  });
  let t = document.querySelector(".motion-toggle");
  t && (t.classList.remove("motion-toggle--fixed"), document.querySelector(".experience-footer").append(t)), journey.style.height = `${(e + 1) * stageHeight}px`;
  let n = 0;
  document.querySelectorAll("[data-anchor]").forEach((r, a) => {
    r.id = CHAPTER_IDS[a], r.style.top = `${n * stageHeight}px`, n += s37[a];
  });
  let i = { value: 0 };
  timeline = gsap.timeline({ scrollTrigger: { trigger: journey, start: "top top", end: () => `+=${e * stageHeight}`, scrub: true, invalidateOnRefresh: true }, defaults: { ease: "none" } }), timeline.to(i, { value: e, duration: 1, onUpdate() {
    scrollDistance = i.value, requestRender();
  } }), ScrollTrigger.refresh(), requestRender();
}
function resizeScene() {
  let s37 = innerWidth, e = innerHeight;
  if (s37 === viewportWidth && Math.abs(e - viewportHeight) < 130) {
    requestRender();
    return;
  }
  if (document.activeElement?.matches("input,textarea,select")) return;
  let t = locateChapter(scrollDistance, mobile ? MOBILE_DURATIONS : DESKTOP_DURATIONS);
  if (mobile = s37 < 768, viewportWidth = s37, viewportHeight = e, stageHeight = journey ? document.querySelector(".experience-stage").clientHeight : e, setupTimeline(), journey && !reducedMotion) {
    let n = mobile ? MOBILE_DURATIONS : DESKTOP_DURATIONS, i = n.slice(0, t.chapter).reduce((r, a) => r + a, 0);
    scrollTo({ top: journey.offsetTop + (i + t.progress * n[t.chapter]) * stageHeight, behavior: "instant" });
  }
  requestRender();
}
async function startExperience() {
  if (sceneHost) try {
    renderer = new WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" }), renderer.outputColorSpace = SRGBColorSpace, renderer.toneMapping = ACESFilmicToneMapping, renderer.toneMappingExposure = 1.02, renderer.shadowMap.enabled = true, renderer.shadowMap.type = PCFShadowMap, renderer.setClearColor(15131868), sceneHost.append(renderer.domElement), scene = new Scene(), scene.background = new Color(15131868), scene.fog = new Fog(15131868, 160, 600), camera = new PerspectiveCamera(38, 1, 0.1, 1500);
    let s37 = new PMREMGenerator(renderer), e = new RoomEnvironment(), t = s37.fromScene(e, 0.04).texture;
    scene.environment = t, scene.environmentIntensity = 0.72, e.dispose(), s37.dispose();
    let n = new HemisphereLight(0xe4edf3, 0x555c62, 1.35);
    scene.add(n), sun = new DirectionalLight(0xfff2df, 3.1), sun.castShadow = true, sun.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048), sun.shadow.bias = -0.00008, sun.shadow.normalBias = 0.012, sun.shadow.camera.near = 0.1, sun.shadow.camera.far = 200, scene.add(sun, sun.target);
    let i = new DirectionalLight(0xc8e0ee, 0.7);
    i.position.set(25, 15, 30), scene.add(i), world = buildWorld({ lowDetail: mobile }), scene.add(world.world);
    let r = "/assets/experience/models/alc-tractor-trailer.glb", a = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(r);
    truck = a.scene.getObjectByName("truckRoot") || a.scene, scene.add(truck), bindRig(), refineMaterials(world, truck, renderer), pageId === "cotacao" && truck.scale.setScalar(0.1), ["equipe", "empresa", "privacidade", "404", "trabalhe-conosco"].includes(pageId) && (truck.visible = false), addBranding(), loading && loading.replaceChildren(), stageHeight = journey ? document.querySelector(".experience-stage").clientHeight : innerHeight, setupTimeline(), requestRender();
    let o = location.hash;
    if (o && journey) {
      let c = document.getElementById(o.slice(1));
      c && c.scrollIntoView({ behavior: "instant" });
    }
    addEventListener("resize", resizeScene, { passive: true }), addEventListener("pageshow", () => {
      ScrollTrigger.refresh(), requestRender();
    }), journey || addEventListener("scroll", requestRender, { passive: true }), document.addEventListener("visibilitychange", () => {
      document.hidden ? (cancelAnimationFrame(pendingFrame), pendingFrame = 0) : requestRender();
    }), renderer.domElement.addEventListener("webglcontextlost", (c) => {
      c.preventDefault(), contextLost = true, cancelAnimationFrame(pendingFrame), pendingFrame = 0, renderer.domElement.removeAttribute("data-ready"), showStaticContent(), sceneHost.classList.remove("has-frame");
    }), renderer.domElement.addEventListener("webglcontextrestored", () => {
      contextLost = false, setupTimeline(), requestRender();
    }), document.querySelector(".motion-toggle")?.addEventListener("click", (c) => {
      reducedMotion = !reducedMotion, c.currentTarget.setAttribute("aria-pressed", String(reducedMotion)), c.currentTarget.textContent = reducedMotion ? "Ativar experi\xEAncia 3D" : "Reduzir movimento", setupTimeline();
    }), motionQuery.addEventListener("change", (c) => {
      reducedMotion = c.matches, setupTimeline();
    }), document.querySelectorAll(".solution-trigger,[data-team-filter]").forEach((c) => c.addEventListener("click", requestRender)), document.fonts.ready.then(requestRender), addEventListener("pagehide", (c) => {
      c.persisted || (cancelAnimationFrame(pendingFrame), timeline?.scrollTrigger?.kill(), timeline?.kill(), scene?.traverse((l) => {
        l.geometry?.dispose();
      }), renderer.dispose());
    });
  } catch (s37) {
    console.error("ALC 3D unavailable:", s37), showStaticContent(), sceneHost.classList.remove("has-frame"), renderer?.domElement?.remove();
  }
}
startExperience();

