import test from "node:test";
import assert from "node:assert/strict";
import { DESKTOP_DURATIONS, MOBILE_DURATIONS, evaluateChapter, locateChapter, routePose, routeDistance } from "../assets/experience/state.js";

const near = (a,b,tolerance=1e-7) => assert.ok(Math.abs(a-b)<tolerance, `${a} != ${b}`);

test("supplied choreography is deterministic and clamps local progress", () => {
  for(let chapter=0;chapter<6;chapter++) for(const progress of [0,.18,.32,.56,.88,1]) {
    assert.deepEqual(evaluateChapter(chapter,progress),evaluateChapter(chapter,progress));
  }
  assert.deepEqual(evaluateChapter(0,-1),evaluateChapter(0,0));
  assert.deepEqual(evaluateChapter(5,2),evaluateChapter(5,1));
  assert.equal(DESKTOP_DURATIONS.reduce((a,b)=>a+b,0),20);
  assert.ok(MOBILE_DURATIONS.reduce((a,b)=>a+b,0)<20);
});

test("camera, tractor and trailer remain continuous at all six chapter boundaries", () => {
  for(let chapter=0;chapter<5;chapter++) {
    const end=evaluateChapter(chapter,1),start=evaluateChapter(chapter+1,0);
    for(const field of ["camera","target","truckPosition","doors"]) end[field].forEach((v,i)=>near(v,start[field][i]));
    for(const field of ["heading","trailerAngle","wheelAngle"]) near(end[field],start[field]);
  }
});

test("closing doors lock only after both doors are shut; departure follows locking", () => {
  assert.deepEqual(evaluateChapter(0,0).doors,[1,1]);
  assert.ok(evaluateChapter(0,.22).doors[0]<1);
  assert.equal(evaluateChapter(0,.22).doors[1],1);
  assert.deepEqual(evaluateChapter(0,.32).doors,[0,0]);
  assert.equal(evaluateChapter(0,.32).locksOpen,1);
  near(evaluateChapter(0,.34).locksOpen,0);
  assert.equal(evaluateChapter(0,.66).distance,0);
  assert.ok(evaluateChapter(0,.8).distance>0);
});

test("arrival stops, unlocks, opens doors in sequence and then unloads", () => {
  near(evaluateChapter(5,.32).distance,360);
  assert.deepEqual(evaluateChapter(5,.38).doors,[0,0]);
  near(evaluateChapter(5,.38).locksOpen,1);
  assert.ok(evaluateChapter(5,.42).doors[0]>0);
  assert.equal(evaluateChapter(5,.42).doors[1],0);
  near(evaluateChapter(5,.54).unload,0);
  near(evaluateChapter(5,.72).unload,1);
});

test("curved road heading, steering, articulation and wheel travel follow the supplied route", () => {
  assert.equal(routePose(70).position[0],0);
  near(routePose(210).position[0],14);
  assert.ok(routePose(140).heading>0);
  assert.ok(routePose(280).heading<0);
  assert.ok(routeDistance(240)>240);
  const state=evaluateChapter(1,.4);
  near(state.wheelAngle,routeDistance(state.distance)/.51);
  assert.ok(Math.abs(state.trailerAngle)>0);
  assert.ok(Math.abs(state.frontSteer)>0);
});

test("chapter selection is reversible with distinct mobile and desktop scroll durations", () => {
  for(const durations of [DESKTOP_DURATIONS,MOBILE_DURATIONS]) {
    let start=0;
    durations.forEach((duration,chapter)=>{
      const point=start+duration*.5;
      const pose=locateChapter(point,durations);
      assert.equal(pose.chapter,chapter);
      near(pose.progress,.5);
      start+=duration;
    });
    assert.equal(locateChapter(0,durations).chapter,0);
    assert.equal(locateChapter(1000,durations).chapter,5);
  }
});
