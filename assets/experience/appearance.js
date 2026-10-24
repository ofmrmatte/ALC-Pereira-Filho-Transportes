import {
  CanvasTexture, DataTexture, RGBAFormat, RepeatWrapping, SRGBColorSpace,
  Mesh, MeshStandardMaterial, PlaneGeometry, Float32BufferAttribute, Raycaster, Vector3
} from "three";

// Shared, deterministic microtexture: no remote images, no animation loop.
function grainTexture() {
  const size = 128;
  const pixels = new Uint8Array(size * size * 4);
  let seed = 1729;
  for (let i = 0; i < size * size; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const value = 95 + (seed >>> 25);
    pixels.set([value, value, value, 255], i * 4);
  }
  const texture = new DataTexture(pixels, size, size, RGBAFormat);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

function surfaceUVs(geometry, density = 1) {
  const position = geometry.attributes.position;
  const normal = geometry.attributes.normal;
  const uv = new Float32Array(position.count * 2);
  for (let i = 0; i < position.count; i++) {
    const nx = Math.abs(normal.getX(i));
    const ny = Math.abs(normal.getY(i));
    const nz = Math.abs(normal.getZ(i));
    uv[i * 2] = (nx > ny && nx > nz ? position.getZ(i) : position.getX(i)) * density;
    uv[i * 2 + 1] = (ny >= nx && ny >= nz ? position.getZ(i) : position.getY(i)) * density;
  }
  geometry.setAttribute("uv", new Float32BufferAttribute(uv, 2));
}

export function refineMaterials(world, truck, renderer) {
  const grain = grainTexture();
  grain.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  const refined = new Set();
  world.world.traverse(mesh => {
    if (!mesh.isMesh || Array.isArray(mesh.material)) return;
    mesh.receiveShadow = true;
    // The original world batches its meshes by material, without UVs.
    // Restore planar UVs after batching so concrete and asphalt stay continuous.
    surfaceUVs(mesh.geometry, 1.5);
    const material = mesh.material;
    if (refined.has(material)) return;
    refined.add(material);
    const color = material.color.getHex();
    if ([0xc8c7bf, 0xe6e4dc, 0xe0dfd7].includes(color)) {
      material.color.setHex(0xaeb1af);
      material.bumpMap = grain;
      material.bumpScale = 0.018;
      material.roughness = 0.92;
    } else if (color === 0x858b89) {
      material.color.setHex(0x363b3f);
      material.bumpMap = grain;
      material.bumpScale = 0.03;
      material.roughness = 0.94;
    } else if (color === 0xc90b19) {
      material.color.setHex(0xe30613);
    } else if (color === 0x41494c) {
      material.color.setHex(0x363b40);
      material.roughness = 0.54;
    }
    material.needsUpdate = true;
  });
  truck.traverse(mesh => {
    if (!mesh.isMesh) return;
    mesh.castShadow = mesh.receiveShadow = true;
    for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      if (refined.has(material)) continue;
      refined.add(material);
      if (material.name === "ALC_Red") {
        material.color.setHex(0xe30613);
        material.roughness = 0.26;
        material.metalness = 0.22;
        material.clearcoat = 0.7;
        material.clearcoatRoughness = 0.16;
      } else if (material.name === "TrailerIvory") {
        material.color.setHex(0xf4f4f1);
        material.roughness = 0.48;
        material.metalness = 0.24;
      } else if (material.name === "BrushedAluminium" || material.name === "CabAluminium") {
        material.roughness = 0.32;
        material.metalness = 0.86;
      } else if (material.name === "CabGlass") {
        material.color.setHex(0x25333c);
        material.roughness = 0.12;
        material.envMapIntensity = 1.4;
      }
      material.needsUpdate = true;
    }
  });
  return grain;
}

function canvasTexture(width, height, draw, renderer) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext("2d"));
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return texture;
}

function decal(parent, name, width, height, texture, position, rotationY = 0) {
  const material = new MeshStandardMaterial({
    map: texture, transparent: true, roughness: 0.65, metalness: 0.04,
    polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
    depthWrite: false
  });
  const mesh = new Mesh(new PlaneGeometry(width, height), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.y = rotationY;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export async function brandFleet(world, truck, rig, renderer) {
  const logo = new Image();
  logo.src = "/assets/brand/logo.webp";
  await logo.decode();
  await document.fonts.ready;
  const livery = canvasTexture(2048, 512, ctx => {
    ctx.fillStyle = "#f4f4f1";
    ctx.fillRect(0, 0, 2048, 512);
    ctx.drawImage(logo, 45, 52, 380, 388);
    ctx.fillStyle = "#18191b";
    ctx.font = "800 104px Manrope,Arial,sans-serif";
    ctx.fillText("ALC & PEREIRA FILHO", 500, 228, 1460);
    ctx.fillStyle = "#e30613";
    ctx.fillRect(506, 270, 1350, 6);
    ctx.font = "600 51px Manrope,Arial,sans-serif";
    ctx.fillText("TRANSPORTES  ·  LOGÍSTICA", 506, 355, 1400);
  }, renderer);
  const mark = canvasTexture(512, 512, ctx => ctx.drawImage(logo, 0, 0, 502, 512), renderer);
  const redStripe = canvasTexture(512, 64, ctx => {
    ctx.fillStyle = "#e30613";
    ctx.fillRect(0, 0, 512, 64);
    ctx.fillStyle = "#18191b";
    ctx.fillRect(0, 48, 512, 16);
  }, renderer);
  for (const side of [-1, 1]) {
    decal(rig.trailer, `alc-livery-${side}`, 7.8, 1.95, livery, [side * 1.27, 2.7, -4.7], side * Math.PI / 2);
    decal(rig.trailer, `alc-stripe-${side}`, 12.2, 0.16, redStripe, [side * 1.272, 1.6, -4.7], side * Math.PI / 2);
    truck.updateMatrixWorld(true);
    const hit = new Raycaster(
      new Vector3(side * 2, 1.85, 7.15).applyMatrix4(rig.tractor.matrixWorld),
      new Vector3(-side, 0, 0).transformDirection(rig.tractor.matrixWorld)
    ).intersectObject(rig.tractor, true)[0];
    if (hit) {
      const point = rig.tractor.worldToLocal(hit.point.clone());
      point.x += side * 0.012;
      decal(rig.tractor, `alc-cab-logo-${side}`, 0.64, 0.65, mark, point.toArray(), side * Math.PI / 2);
    }
  }
  // Each rear decal belongs to its door pivot and follows the original hinge motion.
  for (const [door, direction] of [[rig.left, 1], [rig.right, -1]]) {
    decal(door, `alc-rear-${direction}`, 0.65, 0.66, mark, [direction * 0.59, 3.1, -0.105], Math.PI);
  }
  decal(world.world, "alc-office-logo", 2.5, 2.5, mark, [70, 1.9, 600.12]);
  for (const [parent, width, height, depth] of [[world.service, 45, 8, 24], [world.base, 22, 7, 20], [world.receiving, 26, 7, 22]]) {
    decal(parent, "alc-facade-livery", 6.3, 1.58, livery, [-width * 0.28, height - 1.9, depth / 2 + 0.13]);
  }
  return [livery, mark, redStripe];
}
