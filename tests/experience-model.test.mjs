import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import { createHash } from "node:crypto";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";

const base = new URL("../assets/experience/",import.meta.url);

test("delivered GLB is exactly the original articulated model supplied by the user", async () => {
  const [compressed,source,provenance,runtime] = await Promise.all([
    readFile(new URL("models/alc-tractor-trailer.glb.gz",base)),
    readFile(new URL("source/alc-truck.glb",base)),
    readFile(new URL("source/provenance.json",base),"utf8"),
    stat(new URL("runtime.js",base))
  ]);
  const bytes=gunzipSync(compressed);
  assert.deepEqual(bytes,source);
  assert.equal(bytes.toString("ascii",0,4),"glTF");
  assert.equal(bytes.readUInt32LE(8),bytes.byteLength);
  assert.equal(createHash("sha256").update(bytes).digest("hex"),JSON.parse(provenance).modelSha256);
  assert.ok(compressed.length<1024*1024);
  assert.ok(runtime.size<1.5*1024*1024);
  const json=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString());
  const names=new Set(json.nodes.map(n=>n.name));
  for(const name of ["truckRoot","tractorRoot","trailerPivot","rearDoorLeft","rearDoorRight","lockBarLeft","lockBarRight","frontSteerLeft","frontSteerRight","cargoRoot","cargoPallet_0_-1"]) assert.ok(names.has(name),name);
  assert.equal([...names].filter(n=>n?.startsWith("wheel_")).length,12);
  assert.ok(json.meshes.length<=140);
  const triangles=json.meshes.flatMap(m=>m.primitives).reduce((total,p)=>total+json.accessors[p.indices].count/3,0);
  assert.ok(triangles<120000);
  assert.ok(json.extensionsUsed.includes("EXT_meshopt_compression"));
  const binaryStart=20+bytes.readUInt32LE(12)+8;
  const binary=bytes.subarray(binaryStart);
  await MeshoptDecoder.ready;
  let decoded=0;
  for(const view of json.bufferViews) {
    const ext=view.extensions?.EXT_meshopt_compression;
    if(!ext)continue;
    const target=new Uint8Array(ext.count*ext.byteStride);
    MeshoptDecoder.decodeGltfBuffer(target,ext.count,ext.byteStride,binary.subarray(ext.byteOffset||0,(ext.byteOffset||0)+ext.byteLength),ext.mode,ext.filter);
    decoded++;
  }
  assert.ok(decoded>0,"meshopt geometry must decode successfully");
});
