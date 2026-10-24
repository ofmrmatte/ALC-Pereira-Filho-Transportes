import { Vector3, Group } from "three";
const clamp = v => Math.max(0, Math.min(1,v));
const between = (v,a,b) => clamp((v-a)/(b-a));
const smooth = v => { v=clamp(v); return v*v*(3-2*v); };
const mix = (a,b,t) => a+(b-a)*t;
export function frameCamera(s37, e, t, { mobile: n = false, aspect: i = 1.5 } = {}) {
  let r = e, a = t.focus;
  t.chapter === 3 && (r = new Group(), r.position.set(38, 0, 276 - 20 * smooth(t.parcelProgress)), r.updateMatrixWorld(), a = smooth(between(t.progress, 0.14, 0.28)) * (1 - smooth(between(t.progress, 0.84, 1))));
  let o = new Vector3(...t.target), c = new Vector3(), l = new Vector3();
  if (s37.clearViewOffset(), s37.fov = n ? 44 : 38, s37.aspect = i, s37.updateProjectionMatrix(), s37.position.set(...t.camera), s37.lookAt(o), s37.updateMatrixWorld(), e.updateMatrixWorld(true), a > 0) {
    let h = [];
    for (let g of t.chapter === 3 ? [-0.8, 0.8] : [-1.5, 1.5]) for (let m of t.chapter === 3 ? [1.05, 2.6] : [0, 4.1]) for (let p of t.chapter === 3 ? [-0.6, 0.6] : [-9.2, 8.6]) h.push(new Vector3(g, m, p).applyMatrix4(r.matrixWorld));
    let u = () => {
      let g = 1 / 0, m = -1 / 0, p = 1 / 0, x = -1 / 0;
      for (let v of h) {
        let b = v.clone().project(s37);
        g = Math.min(g, b.x), m = Math.max(m, b.x), p = Math.min(p, b.y), x = Math.max(x, b.y);
      }
      return { w: (m - g) / 2, h: (x - p) / 2, cx: (m + g) / 2, cy: (x + p) / 2 };
    }, d = u();
    for (let g = 0; g < 5; g++) {
      let m = Math.max(1, d.w / (n ? 0.86 : 0.54), d.h / (n ? 0.36 : 0.6));
      if (m <= 1.00001) break;
      s37.position.sub(o).multiplyScalar(mix(1, m * 1.02, a)).add(o), s37.lookAt(o), s37.updateMatrixWorld(), d = u();
    }
    let f = ((n ? 0 : 0.43) - d.cx) * a, _ = ((n ? -0.39 : 0) - d.cy) * a;
    s37.projectionMatrix.elements[8] -= f, s37.projectionMatrix.elements[9] -= _;
  }
  return a < 1 && (s37.projectionMatrix.elements[8] -= t.composition * 2 * (1 - a), n && (s37.projectionMatrix.elements[9] += 0.39 * (1 - a))), s37.projectionMatrixInverse.copy(s37.projectionMatrix).invert(), s37.updateMatrixWorld(), s37;
}
