import { Vector3, Vector2, MeshStandardMaterial, MeshBasicMaterial, Mesh, BoxGeometry, CylinderGeometry, Group, PlaneGeometry, CatmullRomCurve3, TubeGeometry, BufferGeometry, Float32BufferAttribute, CanvasTexture, SRGBColorSpace, DoubleSide, TextureLoader, Raycaster, WebGLRenderer, ACESFilmicToneMapping, PCFSoftShadowMap, Scene, Color, Fog, PerspectiveCamera, PMREMGenerator, HemisphereLight, DirectionalLight } from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
var material = (s37, e = 0.5, t = 0) => new MeshStandardMaterial({ color: s37, roughness: e, metalness: t });
function box(s37, e, t, n, i, r = 0.025, a = 3) {
  let o = r ? new RoundedBoxGeometry(...t, a, Math.min(r, ...t.map((l) => l / 3))) : new BoxGeometry(...t), c = new Mesh(o, i);
  return c.name = e, c.position.set(...n), c.castShadow = true, c.receiveShadow = true, s37.add(c), c;
}
function tube(s37, e, t, n, i, r = 24) {
  let a = new CatmullRomCurve3(t.map((c) => new Vector3(...c))), o = new Mesh(new TubeGeometry(a, r, n, 6, false), i);
  return o.name = e, s37.add(o), o;
}
function batchMeshes(s37) {
  let e = /* @__PURE__ */ new Map();
  s37.updateMatrixWorld(true);
  for (let t of [...s37.children]) {
    if (!t.isMesh || t.userData.keep || Array.isArray(t.material)) continue;
    let n = t.geometry.index ? t.geometry.toNonIndexed() : t.geometry.clone();
    for (let i of Object.keys(n.attributes)) ["position", "normal"].includes(i) || n.deleteAttribute(i);
    n.attributes.normal || n.computeVertexNormals(), n.applyMatrix4(t.matrix), e.has(t.material) || e.set(t.material, []), e.get(t.material).push(n), s37.remove(t);
  }
  for (let [t, n] of e) {
    let i = new Mesh(mergeGeometries(n), t);
    i.name = `Batched_${t.name || t.color.getHexString()}`, i.castShadow = true, i.receiveShadow = true, s37.add(i), n.forEach((r) => r.dispose());
  }
}
export function buildWorld({ lowDetail: s37 = false } = {}) {
  let e = (Z, re, G, Y, te, ue = 0.025) => box(Z, re, G, Y, te, ue, s37 ? 1 : 3), t = new Group();
  t.name = "ALCEnvironment";
  let n = material(14276817, 0.8), i = material(4278604, 0.67, 0.22), r = material(13175577, 0.42, 0.18), a = material(10331559, 0.5, 0.55), o = material(13158335, 0.92), c = material(2106922, 0.8), l = material(10782303, 0.88), h = material(12293476, 0.9), u = new Mesh(new PlaneGeometry(1800, 1800), material(15131868, 0.94));
  u.rotation.x = -Math.PI / 2, u.position.set(0, -0.045, 200), u.receiveShadow = true, t.add(u);
  let d = new Group();
  d.name = "ExpeditionYard", t.add(d), e(d, "PavedApron", [75, 0.04, 115], [0, -0.025, 23], o, 0);
  for (let Z = -35; Z <= 35; Z += 7) e(d, "ConcreteJoint", [0.016, 9e-3, 112], [Z, 2e-3, 23], a, 0);
  for (let Z = -30; Z < 80; Z += 7) e(d, "ConcreteJoint", [72, 9e-3, 0.016], [0, 2e-3, Z], a, 0);
  for (let Z of [-2.2, 2.2]) e(d, "DockLane", [0.09, 0.012, 27], [Z, 0.015, -1], n, 0);
  function f(Z, re, G, Y = false) {
    let te = new Group();
    te.name = Z, te.position.set(...re), t.add(te);
    let [ue, fe, De] = G, it = De / 2, P = Y ? 5 : 6.5;
    e(te, "Foundation", [ue + 0.6, 0.2, De + 0.6], [0, 0.04, 0], o, 0.025), e(te, "Back", [ue, fe, 0.18], [0, fe / 2, -De / 2], i, 0.02);
    for (let Ae of [-ue / 2, ue / 2]) e(te, "Side", [0.16, fe, De], [Ae, fe / 2, 0], n, 0.02);
    for (let Ae of [-1, 1]) e(te, "PortalWall", [(ue - P) / 2, fe, 0.18], [Ae * (ue + P) / 4, fe / 2, it], i, 0.015);
    if (e(te, "PortalHeader", [P, fe - 5.3, 0.2], [0, (fe + 5.3) / 2, it], i, 0.015), Y) {
      let Ae = te.children.find((Pe) => Pe.name === "Back");
      te.remove(Ae);
      for (let Pe of [-1, 1]) e(te, "BackPortalWall", [(ue - 5) / 2, fe, 0.18], [Pe * (ue + 5) / 4, fe / 2, -De / 2], i, 0.015);
      e(te, "BackPortalHeader", [5, fe - 5.3, 0.18], [0, (fe + 5.3) / 2, -De / 2], i, 0.015);
    }
    e(te, "Roof", [ue + 0.7, 0.18, De + 0.7], [0, fe + 0.04, 0], n, 0.025), e(te, "Fascia", [ue + 0.8, 0.16, 0.3], [0, fe - 0.25, it + 0.25], r, 0.025), e(te, "Canopy", [P + 2, 0.1, 2.4], [0, 5.5, it + 1], a, 0.025);
    for (let Ae of [-1, 1]) e(te, "PortalBumper", [0.2, 1.2, 0.15], [Ae * (P / 2 + 0.05), 0.7, it + 0.15], c, 0.02), e(te, "Bollard", [0.13, 1.1, 0.13], [Ae * (P / 2 + 0.4), 0.55, it + 0.7], r, 0.02);
    for (let Ae = -ue / 2 + 0.4; Ae < ue / 2; Ae += 0.42) Math.abs(Ae) > P / 2 + 0.1 && e(te, "WallSeam", [0.015, fe - 0.4, 0.02], [Ae, fe / 2, it + 0.11], a, 0);
    for (let Ae = -De / 2 + 2; Ae < De / 2; Ae += 5) for (let Pe of [-1, 1]) e(te, "StructuralColumn", [0.17, fe, 0.19], [Pe * (ue / 2 - 0.2), fe / 2, Ae], a, 0.01);
    return batchMeshes(te), te;
  }
  let _ = f("ServiceCenter", [0, 0, -25], [45, 8, 24]), g = f("OperationsBase", [38, 0, 270], [22, 7, 20], true), m = f("DeliveryBuilding", [-24, 0, 352], [26, 7, 22]), p = [];
  for (let [Z, re, G] of [[[0, 6.5, -12.78], 0, "SERVICE CENTER"], [[38, 5.7, 280.13], 0, "OPERA\xC7\xC3O"], [[-24, 5.7, 363.13], 0, "DESTINO"]]) {
    let Y = e(t, "SignBoard", [5.5, 0.65, 0.08], Z, c, 0.02);
    Y.rotation.y = re, p.push({ mesh: Y, label: G });
  }
  let x = new Group();
  x.name = "Road", t.add(x);
  let v = [];
  for (let Z = 42; Z < 450; Z += 2) {
    let re = Math.max(0, Math.min(1, (Z - 70) / 280));
    v.push(new Vector3(14 * Math.sin(re * Math.PI) ** 2, 4e-3, Z));
  }
  let b = new CatmullRomCurve3(v), T = [], E = [];
  for (let Z = 0; Z < v.length; Z++) {
    let re = v[Z], G = b.getTangent(Z / (v.length - 1)), Y = new Vector3(G.z, 0, -G.x).multiplyScalar(5.6);
    if (T.push(re.x - Y.x, 9e-3, re.z - Y.z, re.x + Y.x, 9e-3, re.z + Y.z), Z < v.length - 1) {
      let te = Z * 2;
      E.push(te, te + 2, te + 1, te + 1, te + 2, te + 3);
    }
  }
  let A = new BufferGeometry();
  A.setAttribute("position", new Float32BufferAttribute(T, 3)), A.setIndex(E), A.computeVertexNormals();
  let R = new Mesh(A, material(8752009, 0.94));
  R.receiveShadow = true, x.add(R);
  for (const side of [-1, 1]) {
    const edge = v.map((point, index) => {
      const tangent = b.getTangent(index / (v.length - 1));
      return [point.x + side * tangent.z * 5.15, 0.026, point.z - side * tangent.x * 5.15];
    });
    tube(x, `RoadEdge_${side}`, edge, 0.035, n, v.length);
  }
  for (let Z = 48; Z < 448; Z += 8) {
    let re = Math.max(0, Math.min(1, (Z - 70) / 280)), G = 14 * Math.sin(re * Math.PI) ** 2;
    e(x, "RoadMarking", [0.11, 0.012, 3.4], [G, 0.022, Z], n, 0);
  }
  for (let side of [-1, 1]) for (let z = 84; z < 210; z += 12) {
    const progress = Math.max(0, Math.min(1, (z - 70) / 280));
    const center = 14 * Math.sin(progress * Math.PI) ** 2;
    e(x, "RoadsideMarker", [0.12, 0.7, 0.12], [center + side * 6.4, 0.35, z], n, 0.01);
    e(x, "RoadsideReflector", [0.13, 0.13, 0.13], [center + side * 6.4, 0.6, z], r, 0.01);
  }
  let y = new Group();
  y.name = "Network", t.add(y), e(y, "NetworkPlinth", [140, 0.16, 110], [15, -0.02, 262], material(14737367, 0.83), 0.15);
  let M = [g];
  for (let Z = 0; Z < 48; Z++) {
    let re = Math.floor(Z / 8), G = Z % 8, Y = -45 + G * 17, te = 218 + re * 17;
    if (Math.abs(Y - 38) < 13 && Math.abs(te - 270) < 13) continue;
    let ue = new Group();
    ue.name = `Base_${Z + 1}`, ue.position.set(Y, 0, te), y.add(ue), e(ue, "BaseFoundation", [6.8, 0.13, 5.2], [0, 0.13, 0], o, 0.04), e(ue, "BaseVolume", [6.2, 2, 4.8], [0, 1.18, 0], n, 0.06), e(ue, "BaseRoof", [6.5, 0.14, 5], [0, 2.2, 0], Z < 37 ? i : r, 0.035), e(ue, "BaseDoor", [1.2, 1.35, 0.04], [0, 0.9, 2.42], c, 0.01), e(ue, "BaseStripe", [6.2, 0.12, 0.045], [0, 1.88, 2.43], r, 6e-3), batchMeshes(ue), M.push(ue), e(y, "Route", [0.26, 0.02, 17], [Y, 0.1, te - 8.5], r, 0), G < 7 && e(y, "Route", [17, 0.02, 0.26], [Y + 8.5, 0.1, te], a, 0);
  }
  let I = new Group();
  I.name = "Interior", I.position.set(38, 0, 270), t.add(I);
  for (let Z of [-1, 1]) for (let re of [-6, 0, 6]) {
    for (let G of [-1.7, 1.7]) for (let Y of [-0.7, 0.7]) e(I, "RackUpright", [0.07, 4.6, 0.07], [Z * 6 + G, 2.3, re + Y], i, 8e-3);
    for (let G of [0.3, 1.9, 3.5]) {
      e(I, "RackBeam", [3.6, 0.1, 1.6], [Z * 6, G, re], r, 8e-3);
      for (let Y of [-0.95, 0.95]) e(I, "StockCarton", [1.25, 0.85, 1.15], [Z * 6 + Y, G + 0.49, re], h, 0.02);
    }
  }
  for (let Z of [-6, 5]) {
    e(I, "ConveyorFrame", [1.5, 0.15, 5], [0, 0.95, Z], a, 0.015);
    for (let re = 0; re < 18; re++) {
      let G = new Mesh(new CylinderGeometry(0.06, 0.06, 1.35, 12), a);
      G.rotation.z = Math.PI / 2, G.position.set(0, 1.06, Z - 2.35 + re * 0.27), I.add(G);
    }
    for (let re of [-0.62, 0.62]) for (let G of [-1.8, 1.8]) e(I, "ConveyorLeg", [0.07, 0.9, 0.07], [re, 0.45, Z + G], i, 8e-3);
  }
  e(I, "SortingBench", [1.5, 0.14, 6], [0, 1.05, 0], a, 0.015);
  for (let Z of [-0.6, 0.6]) for (let re of [-2.4, 2.4]) e(I, "BenchLeg", [0.08, 1, 0.08], [Z, 0.5, re], i, 0.01);
  e(I, "DispatchRollerBed", [1.5, 0.14, 6], [0, 1.05, -11], a, 0.015);
  for (let Z of [-0.6, 0.6]) for (let re of [-13.5, -8.5]) e(I, "DispatchBedLeg", [0.08, 1, 0.08], [Z, 0.5, re], i, 0.01);
  batchMeshes(I);
  let L = new Group();
  L.name = "OperationParcel", t.add(L), e(L, "ParcelPallet", [1.2, 0.14, 1.1], [0, 1.19, 0], l, 0.01), e(L, "ParcelBody", [1.05, 0.65, 0.88], [0, 1.59, 0], h, 0.015);
  let B = new Group(), V = new Group();
  B.name = "parcelLidLeft", V.name = "parcelLidRight", B.position.set(-0.525, 1.92, 0), V.position.set(0.525, 1.92, 0), L.add(B, V), e(B, "LeftFlap", [0.525, 0.012, 0.88], [0.2625, 0, 0], h, 4e-3), e(V, "RightFlap", [0.525, 0.012, 0.88], [-0.2625, 0, 0], h, 4e-3);
  let X = [];
  for (let [Z, re] of [272, 294, 316].entries()) {
    let G = new Group();
    G.name = `Milestone_${Z}`, G.position.set(60, 0, re), t.add(G), e(G, "MilestoneBase", [5, 0.22, 5], [0, 0.11, 0], o, 0.05), e(G, "MilestonePillar", [0.18, 3.5, 0.18], [0, 1.9, 0], r, 0.025), e(G, "MilestonePlate", [3.3, 1.3, 0.12], [0, 3.1, 0], i, 0.035);
    let Y = G.children.at(-1);
    p.push({ mesh: Y, label: ["2015", "2019", "HOJE"][Z] }), X.push(G);
  }
  tube(t, "HistoryPath", [[38, 0.03, 256], [53, 0.03, 256], [60, 0.03, 267], [60, 0.03, 322]], 0.045, r, 70);
  let K = new Group();
  K.name = "UnloadRamp", t.add(K), e(K, "LiftDeck", [2.7, 0.14, 6.5], [0, 1.16, 0], a, 0.02);
  for (let Z of [-1.12, 1.12]) for (let re of [-2.8, 2.8]) e(K, "LiftSupport", [0.12, 1.1, 0.12], [Z, 0.55, re], i, 0.01);
  batchMeshes(K), y.updateMatrixWorld(true);
  for (let Z of M.slice(1)) for (let re of [...Z.children]) re.isMesh && y.attach(re);
  let H = new Group();
  H.name = "TeamStructure", H.position.set(0, 0, 600), t.add(H), e(H, "TeamPlinth", [22, 0.2, 15], [0, 0.1, 0], o, 0.08);
  for (let [Z, re] of [-4, 4].entries()) {
    e(H, "DirectorPillar", [4, 3.2, 2.1], [re, 1.8, 3], i, 0.09), e(H, "DirectorBand", [4.08, 0.12, 2.18], [re, 3.2, 3], r, 0.015);
    let G = e(H, "DirectorPlate", [3.7, 0.6, 0.055], [re, 2.1, 4.08], c, 0.012);
    p.push({ mesh: G, label: Z === 0 ? "ANDR\xC9 COSTA" : "PAULO PEREIRA FILHO" });
  }
  for (let [Z, re] of [-6, 0, 6].entries()) {
    e(H, "ManagementBlock", [4, 1.4, 2.1], [re, 0.9, -3], n, 0.07);
    let G = e(H, "ManagerPlate", [3.7, 0.48, 0.05], [re, 1.2, -1.92], i, 0.012);
    p.push({ mesh: G, label: ["OPERA\xC7\xC3O", "PROCESSOS", "FINANCEIRO"][Z] }), e(H, "TeamLink", [0.1, 0.04, 6], [re, 0.23, 0], r, 0);
  }
  e(H, "TeamCrossLink", [13, 0.04, 0.1], [0, 0.23, 1.5], r, 0);
  for (let { mesh: Z } of p) Z.userData.keep = true;
  batchMeshes(H);
  let ne = new Group();
  ne.name = "PlanningDesk", ne.position.set(40, 0, 600), t.add(ne), e(ne, "PlanningSurface", [4.8, 0.15, 2.8], [0, 1.06, 0], n, 0.06);
  for (let Z of [-2, 2]) for (let re of [-1, 1]) e(ne, "DeskLeg", [0.1, 1, 0.1], [Z, 0.5, re], i, 0.02);
  tube(ne, "DeskRoute", [[-1.7, 1.15, -0.5], [-0.8, 1.15, -0.5], [0.6, 1.15, 0.7], [1.7, 1.15, 0.7]], 0.023, r, 20);
  for (let [Z, re] of [[-1.7, -0.5], [1.7, 0.7]].entries()) e(ne, "RouteMarker", [0.08, 0.4, 0.08], [re[0], 1.33, re[1]], r, 0.02), e(ne, "RouteMarkerFoot", [0.27, 0.035, 0.27], [re[0], 1.16, re[1]], a, 0.035);
  batchMeshes(ne);
  let D = new Group();
  D.position.set(70, 0, 600), t.add(D), e(D, "BrandBase", [7, 0.18, 3], [0, 0.09, 0], o, 0.05), e(D, "BrandPlaque", [6, 3.4, 0.2], [0, 1.9, 0], n, 0.09), batchMeshes(D);
  let he = new Group();
  he.position.set(0, 0, 675), t.add(he), e(he, "BranchRoad", [22, 0.08, 5], [0, 0.02, 0], i, 0), e(he, "BranchRoad", [5, 0.08, 18], [0, 0.02, 4], i, 0);
  for (let Z of [-1.8, 1.8]) e(he, "BarrierStand", [0.13, 1, 0.13], [Z, 0.5, 0], a, 0.02);
  e(he, "Barrier", [4.3, 0.34, 0.16], [0, 0.92, 0], r, 0.025);
  for (let Z = -1.8; Z < 2; Z += 0.7) e(he, "BarrierStripe", [0.34, 0.35, 0.015], [Z, 0.92, 0.09], n, 0);
  let ke = e(he, "RoadSign", [2, 1, 0.08], [0, 2.1, 0], n, 0.04);
  p.push({ mesh: ke, label: "404" });
  for (let { mesh: Z } of p) Z.userData.keep = true;
  batchMeshes(he);
  let Ye = new Group();
  Ye.position.set(0, 0, 760), t.add(Ye), e(Ye, "HistoryPlinth", [26, 0.18, 11], [0, 0.09, 0], o, 0.08);
  for (let [Z, re] of ["2015", "2015", "2019", "2019", "2020", "2021", "2022"].entries()) {
    let G = -10.5 + Z * 3.5;
    e(Ye, "HistoryPedestal", [0.12, 2.5, 0.12], [G, 1.4, 0], r, 0.02);
    let Y = e(Ye, "HistoryDate", [2.7, 0.85, 0.09], [G, 2.7, 0], i, 0.04);
    p.push({ mesh: Y, label: re }), Z < 6 && e(Ye, "HistoryLink", [3.5, 0.035, 0.07], [G + 1.75, 0.23, 0], r, 0);
  }
  for (let { mesh: Z } of p) Z.userData.keep = true;
  return batchMeshes(Ye), batchMeshes(d), batchMeshes(x), batchMeshes(y), { world: t, signs: p, parcel: L, lidL: B, lidR: V, unloadRamp: K, nodes: M, base: g, service: _, receiving: m };
}
