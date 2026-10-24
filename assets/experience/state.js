// Choreography recovered from the user-supplied ALC_Previa_3D_Revisada.html.
var clamp = (s37) => Math.max(0, Math.min(1, s37)), between = (s37, e, t) => clamp((s37 - e) / (t - e)), smooth = (s37) => (s37 = clamp(s37), s37 * s37 * (3 - 2 * s37)), mix = (s37, e, t) => s37 + (e - s37) * t, vector = (s37, e, t) => s37.map((n, i) => mix(n, e[i], t)), DESKTOP_DURATIONS = [4.5, 3.25, 3.75, 4, 3, 1.5], MOBILE_DURATIONS = [3.5, 2.5, 2.75, 3, 2.5, 1.25];
function sampleVector(s37, e) {
  for (let t = 1; t < s37.length; t++) if (e <= s37[t][0]) return vector(s37[t - 1][1], s37[t][1], smooth(between(e, s37[t - 1][0], s37[t][0])));
  return s37.at(-1)[1].slice();
}
function routePose(s37) {
  let e = clamp((s37 - 70) / 280), t = 14 * Math.sin(e * Math.PI) ** 2, n = s37 > 70 && s37 < 350 ? 14 * Math.PI / 280 * Math.sin(e * Math.PI * 2) : 0;
  return { position: [t, 0, s37], heading: Math.atan(n) };
}
function routeDistance(s37) {
  let e = 0, t = routePose(0).position;
  for (let n = 1; n <= Math.ceil(s37); n++) {
    let i = routePose(Math.min(n, s37)).position;
    e += Math.hypot(i[0] - t[0], i[2] - t[2]), t = i;
  }
  return e;
}
var departureState = (s37) => {
  let e = 70 * smooth(between(s37, 0.66, 1)), t = sampleVector([[0, [0, 3, -18]], [0.18, [0, 3.3, -21]], [0.32, [0, 3.3, -21]], [0.44, [10, 4.1, -15]], [0.56, [17, 4.4, 0]], [0.66, [11, 4.5, 16]], [0.94, [12, 5.5, 21]], [1, [12, 5.5, 21]]], s37), n = sampleVector([[0, [0, 2.3, -6.5]], [0.32, [0, 2.3, -5]], [0.56, [0, 2.2, 0]], [0.66, [0, 2, 3]], [1, [0, 2, 3]]], s37);
  return t[2] += e, n[2] += e, { camera: t, target: n, distance: e, doors: [1 - smooth(between(s37, 0.18, 0.25)), 1 - smooth(between(s37, 0.25, 0.32))], composition: mix(0.22, 0.13, smooth(between(s37, 0.32, 0.66))), focus: 1 };
}, roadState = (s37) => {
  let e = mix(70, 240, s37), t = routePose(e).position, n = sampleVector([[0, [12, 5.5, 21]], [0.32, [18, 7, 15]], [0.52, [21, 10, 5]], [0.72, [30, 12, 4]], [0.88, [32, 17, 14]], [1, [40, 52, 65]]], s37);
  return { camera: vector(t, t, 0).map((i, r) => i + n[r]), target: [t[0], 2, t[2] + 3], distance: e, doors: [0, 0], composition: mix(0.13, 0.05, between(s37, 0.72, 1)), focus: 1 };
}, networkState = (s37) => {
  let e = roadState(1);
  return { camera: sampleVector([[0, e.camera], [0.16, [80, 85, 335]], [0.32, [90, 95, 332]], [0.64, [95, 94, 310]], [0.78, [91, 80, 300]], [0.92, [61, 19, 309]], [1, [52, 8, 302]]], s37), target: sampleVector([[0, e.target], [0.16, [15, 0, 260]], [0.64, [20, 0, 260]], [0.78, [20, 0, 260]], [0.92, [38, 2, 270]], [1, [38, 2, 270]]], s37), distance: 240, doors: [0, 0], composition: mix(0.05, 0.16, smooth(between(s37, 0.78, 1))), focus: mix(1, 0, between(s37, 0, 0.16)), networkHighlight: s37 < 0.32 ? 0 : s37 < 0.48 ? 1 : 2 };
}, operationState = (s37) => ({ camera: sampleVector([[0, [52, 8, 302]], [0.14, [38, 3, 286]], [0.28, [38, 2.8, 279]], [0.42, [42, 3, 274]], [0.56, [41, 3, 270]], [0.7, [41, 3, 267]], [0.84, [38, 3, 261]], [0.94, [47, 5, 246]], [1, [47, 5, 246]]], s37), target: sampleVector([[0, [38, 2, 270]], [0.14, [38, 2, 276]], [0.28, [38, 1.5, 275]], [0.42, [38, 1.5, 270]], [0.7, [38, 1.5, 265]], [0.84, [38, 1.5, 256]], [1, [38, 1, 256]]], s37), distance: 240, doors: [0, 0], composition: sampleVector([[0, [0.16]], [0.14, [0.2]], [0.84, [0.2]], [1, [0.18]]], s37)[0], focus: 0, parcelProgress: between(s37, 0.14, 0.94), parcelOpen: smooth(between(s37, 0.42, 0.49)) * (1 - smooth(between(s37, 0.56, 0.63))) }), historyState = (s37) => ({ camera: sampleVector([[0, [47, 5, 246]], [0.12, [76, 6, 280]], [0.32, [76, 6, 286]], [0.54, [76, 6, 308]], [0.76, [75, 7, 330]], [0.88, [45, 8, 346]], [1, [24, 6, 350]]], s37), target: sampleVector([[0, [38, 1, 256]], [0.12, [60, 1, 272]], [0.32, [60, 1, 272]], [0.54, [60, 1, 294]], [0.76, [60, 1, 316]], [0.88, [16, 2, 330]], [1, [routePose(330).position[0], 2, 330]]], s37), distance: mix(240, 330, smooth(s37)), doors: [0, 0], composition: 0.18, focus: smooth(between(s37, 0.88, 1)) }), arrivalState = (s37) => {
  let e = mix(330, 360, smooth(between(s37, 0, 0.32))), t = routePose(e).position, n = sampleVector([[0, [24 - routePose(330).position[0], 6, 20]], [0.38, [14, 5.5, 18]], [0.54, [13, 5.5, -17]], [0.72, [13, 5.5, -17]], [1, [13, 5.5, -17]]], s37);
  return { camera: t.map((i, r) => i + n[r]), target: [t[0], 2, mix(330, 352, smooth(between(s37, 0, 0.54)))], distance: e, doors: [smooth(between(s37, 0.38, 0.46)), smooth(between(s37, 0.46, 0.54))], composition: 0.2, focus: 1, unload: smooth(between(s37, 0.54, 0.72)) };
}, CHAPTER_STATES = [departureState, roadState, networkState, operationState, historyState, arrivalState];
function evaluateChapter(s37, e) {
  let t = clamp(e), n = CHAPTER_STATES[Math.max(0, Math.min(5, s37))](t), i = routePose(n.distance);
  if (s37 === 3) {
    let r = smooth(between(t, 0.14, 0.28)) * (1 - smooth(between(t, 0.84, 1))), a = 276 - 20 * smooth(n.parcelProgress);
    n.target = vector(n.target, [38, 1.6, a], r);
  }
  return { chapter: s37, progress: t, parcelProgress: s37 >= 4 ? 1 : 0, parcelOpen: 0, unload: 0, networkHighlight: -1, ...n, truckPosition: i.position, heading: i.heading, frontSteer: Math.atan(3.7 * (routePose(n.distance + 0.5).heading - routePose(Math.max(0, n.distance - 0.5)).heading)) * smooth(between(n.distance, 70, 74)), locksOpen: s37 === 0 ? 1 - smooth(between(t, 0.32, 0.34)) : s37 === 5 ? smooth(between(t, 0.34, 0.38)) : 0, trailerAngle: routePose(Math.max(0, n.distance - 8)).heading - i.heading, wheelAngle: routeDistance(n.distance) / 0.51 };
}
function locateChapter(s37, e = DESKTOP_DURATIONS) {
  let t = 0;
  for (let n = 0; n < e.length; n++) {
    if (s37 < t + e[n] || n === e.length - 1) return { chapter: n, progress: clamp((s37 - t) / e[n]) };
    t += e[n];
  }
  return { chapter: 0, progress: 0 };
}
function evaluatePageState(s37, e = -1) {
  let t = (n, i) => ({ ...evaluateChapter(...n), ...i });
  return s37 === "solucoes" ? evaluateChapter(...[[0, 0.56], [5, 0.7], [5, 0.75], [3, 0.5], [1, 0.45], [2, 0.55]][Math.max(0, e)]) : s37 === "operacao" ? evaluateChapter(2, 0.6) : s37 === "empresa" ? t([4, 0.54], { camera: [23, 13, 787], target: [0, 1.2, 760], focus: 0, composition: 0.13 }) : s37 === "equipe" ? t([2, 0.7], { camera: [18, 12, 623], target: [0, 1.2, 600], focus: 0, composition: 0.13 }) : s37 === "privacidade" ? t([0, 0.6], { camera: [78, 5.5, 612], target: [70, 1.7, 600], focus: 0, composition: 0.06 }) : s37 === "404" ? t([0, 0.6], { camera: [12, 8, 692], target: [0, 0.8, 675], focus: 0, composition: 0.08 }) : s37 === "cotacao" ? t([0, 0.6], { camera: [45, 4.4, 605.5], target: [40, 1, 600], truckPosition: [40, 1.14, 600], heading: 0, focus: 0, composition: 0.12 }) : s37 === "trabalhe-conosco" ? evaluateChapter(3, 0.28) : evaluateChapter(0, 0.64);
}

export { DESKTOP_DURATIONS, MOBILE_DURATIONS, evaluateChapter, locateChapter, evaluatePageState, routePose, routeDistance };
