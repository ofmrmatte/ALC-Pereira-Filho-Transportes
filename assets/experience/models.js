import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const materials = Object.freeze({
  paint: new THREE.MeshStandardMaterial({ color: 0xe30613, roughness: 0.3, metalness: 0.12 }),
  body: new THREE.MeshStandardMaterial({ color: 0xf1f0eb, roughness: 0.68, metalness: 0.04 }),
  inside: new THREE.MeshStandardMaterial({ color: 0xb9b8b2, roughness: 0.78 }),
  rubber: new THREE.MeshStandardMaterial({ color: 0x202124, roughness: 0.94 }),
  rubberSide: new THREE.MeshStandardMaterial({ color: 0x323438, roughness: 0.86 }),
  glass: new THREE.MeshStandardMaterial({ color: 0x34424b, roughness: 0.21, metalness: 0.08 }),
  steel: new THREE.MeshStandardMaterial({ color: 0x7c8184, roughness: 0.34, metalness: 0.78 }),
  darkSteel: new THREE.MeshStandardMaterial({ color: 0x34383a, roughness: 0.56, metalness: 0.54 }),
  kraft: new THREE.MeshStandardMaterial({ color: 0xb78b57, roughness: 0.91 }),
  tape: new THREE.MeshStandardMaterial({ color: 0xe30613, roughness: 0.62 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x94724f, roughness: 0.88 }),
  light: new THREE.MeshStandardMaterial({ color: 0xf5e4af, roughness: 0.24, emissive: 0x493b1b })
});

function part(parent, name, geometry, material, position, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function roundedPart(parent, name, size, material, position, radius = 0.04) {
  const geometry = new RoundedBoxGeometry(...size, 2, radius);
  return part(parent, name, geometry, material, position);
}

function addPallet(parent, name, x, z) {
  const pallet = new THREE.Group();
  pallet.name = name;
  pallet.position.set(x, 0, z);
  parent.add(pallet);
  for (let index = 0; index < 5; index++) {
    roundedPart(pallet, `${name}_deck_${index + 1}`, [0.94, 0.055, 0.17], materials.wood, [0, 0.16, -0.75 + index * 0.375], 0.018);
  }
  for (let index = 0; index < 3; index++) {
    roundedPart(pallet, `${name}_runner_${index + 1}`, [0.13, 0.13, 1.72], materials.wood, [-0.34 + index * 0.34, 0.065, 0], 0.025);
  }
  return pallet;
}

function addCargo(parent, pallet, palletIndex) {
  const z = pallet.position.z;
  const x = pallet.position.x;
  for (let row = 0; row < 2; row++) {
    for (let column = 0; column < 2; column++) {
      const index = palletIndex * 4 + row * 2 + column + 1;
      const width = column === 0 ? 0.42 : 0.39;
      const depth = row === 0 ? 0.76 : 0.72;
      const height = 0.52 + ((index % 3) * 0.055);
      const cargoX = x + (column ? 0.235 : -0.235);
      const cargoZ = z + (row ? 0.42 : -0.42);
      roundedPart(parent, `cargo_carton_${String(index).padStart(2, "0")}`, [width, height, depth], materials.kraft, [cargoX, 0.19 + height / 2, cargoZ], 0.025);
      roundedPart(parent, `cargo_tape_${String(index).padStart(2, "0")}`, [0.085, height + 0.012, depth + 0.02], materials.tape, [cargoX, 0.19 + height / 2, cargoZ], 0.009);
    }
  }
}

function addWheel(parent, name, x, z, steering = false) {
  const pivot = new THREE.Group();
  pivot.name = steering ? "frontSteer" + (x < 0 ? "Left" : "Right") : `${name}_steeringPivot`;
  pivot.position.set(x, 0.5, z);
  parent.add(pivot);

  const wheel = new THREE.Group();
  wheel.name = `wheel_${name}`;
  pivot.add(wheel);
  for (const offset of [-0.075, 0.075]) {
    const tire = new THREE.Group();
    tire.name = `${name}_tire_${offset < 0 ? "inner" : "outer"}`;
    tire.position.x = offset;
    wheel.add(tire);
    const geometry = new THREE.TorusGeometry(0.39, 0.11, 12, 28);
    part(tire, `${tire.name}_rubber`, geometry, materials.rubber, [0, 0, 0], [0, Math.PI / 2, 0]);
    const rim = new THREE.CylinderGeometry(0.285, 0.285, 0.12, 20);
    part(tire, `${tire.name}_rim`, rim, materials.steel, [0, 0, 0], [0, 0, Math.PI / 2]);
    const hub = new THREE.CylinderGeometry(0.115, 0.115, 0.15, 16);
    part(tire, `${tire.name}_hub`, hub, materials.darkSteel, [0, 0, 0], [0, 0, Math.PI / 2]);
    for (let bolt = 0; bolt < 8; bolt++) {
      const angle = bolt * Math.PI / 4;
      const sphere = new THREE.SphereGeometry(0.019, 8, 6);
      part(tire, `${tire.name}_bolt_${bolt + 1}`, sphere, materials.inside, [offset < 0 ? -0.067 : 0.067, Math.sin(angle) * 0.22, Math.cos(angle) * 0.22]);
    }
  }
  return { pivot, wheel };
}

function addCab(parent) {
  const tractor = new THREE.Group();
  tractor.name = "tractorRoot";
  parent.add(tractor);

  roundedPart(tractor, "cab_lower_shell", [2.34, 1.55, 3.45], materials.paint, [0, 1.52, 5.9], 0.19);
  roundedPart(tractor, "cab_roof_shell", [2.15, 1.12, 2.65], materials.paint, [0, 2.77, 6.08], 0.22);
  roundedPart(tractor, "cab_front_glass", [1.88, 0.73, 0.045], materials.glass, [0, 2.92, 7.42], 0.03)
    .rotation.x = -0.09;
  roundedPart(tractor, "cab_front_bumper", [2.48, 0.23, 0.26], materials.steel, [0, 0.7, 7.62], 0.06);
  roundedPart(tractor, "cab_front_grille", [0.9, 0.46, 0.08], materials.darkSteel, [0, 1.45, 7.69], 0.04);
  for (let bar = 0; bar < 5; bar++) {
    roundedPart(tractor, `grille_louver_${bar + 1}`, [0.76, 0.025, 0.018], materials.steel, [0, 1.27 + bar * 0.085, 7.74], 0.006);
  }
  for (const side of [-1, 1]) {
    roundedPart(tractor, `cab_side_glass_${side < 0 ? "left" : "right"}`, [0.045, 0.66, 1.0], materials.glass, [side * 1.18, 2.89, 6.18], 0.04);
    roundedPart(tractor, `cab_side_door_${side < 0 ? "left" : "right"}`, [0.035, 0.8, 1.04], materials.body, [side * 1.18, 1.73, 5.95], 0.025);
    roundedPart(tractor, `cab_handle_${side < 0 ? "left" : "right"}`, [0.035, 0.045, 0.2], materials.steel, [side * 1.21, 1.92, 6.1], 0.02);
    roundedPart(tractor, `mirror_arm_${side < 0 ? "left" : "right"}`, [0.07, 0.08, 0.78], materials.darkSteel, [side * 1.38, 2.85, 7.05], 0.025);
    roundedPart(tractor, `mirror_glass_${side < 0 ? "left" : "right"}`, [0.11, 0.42, 0.28], materials.steel, [side * 1.48, 3.04, 7.15], 0.05);
    roundedPart(tractor, `headlamp_${side < 0 ? "left" : "right"}`, [0.42, 0.26, 0.09], materials.light, [side * 0.78, 1.02, 7.72], 0.06);
    roundedPart(tractor, `step_${side < 0 ? "left" : "right"}`, [0.46, 0.12, 0.72], materials.steel, [side * 1.18, 0.46, 5.07], 0.04);
    roundedPart(tractor, `fuel_tank_${side < 0 ? "left" : "right"}`, [0.46, 0.6, 1.18], materials.darkSteel, [side * 1.08, 0.86, 3.99], 0.11);
  }
  roundedPart(tractor, "cab_windshield_top_trim", [1.92, 0.08, 0.07], materials.darkSteel, [0, 3.32, 7.46], 0.025);
  roundedPart(tractor, "cab_roof_marker", [0.56, 0.09, 0.12], materials.light, [0, 3.38, 6.72], 0.03);

  addWheel(tractor, "tractor_front_axle_left", -1.19, 6.2, true);
  addWheel(tractor, "tractor_front_axle_right", 1.19, 6.2, true);
  for (const z of [3.45, 2.15]) {
    addWheel(tractor, `tractor_rear_axle_${z.toFixed(2)}_left`, -1.2, z);
    addWheel(tractor, `tractor_rear_axle_${z.toFixed(2)}_right`, 1.2, z);
  }
}

function addTrailer(parent) {
  const trailer = new THREE.Group();
  trailer.name = "trailerPivot";
  parent.add(trailer);

  roundedPart(trailer, "trailer_floor", [2.55, 0.18, 12.25], materials.darkSteel, [0, 1.28, -2.15], 0.045);
  roundedPart(trailer, "trailer_roof", [2.58, 0.16, 12.25], materials.body, [0, 4.03, -2.15], 0.05);
  for (const side of [-1, 1]) {
    roundedPart(trailer, `trailer_side_panel_${side < 0 ? "left" : "right"}`, [0.1, 2.6, 12.12], materials.body, [side * 1.24, 2.67, -2.15], 0.035);
    roundedPart(trailer, `trailer_inner_wall_${side < 0 ? "left" : "right"}`, [0.035, 2.45, 11.9], materials.inside, [side * 1.17, 2.67, -2.15], 0.012);
    for (let seam = 0; seam < 15; seam++) {
      roundedPart(trailer, `side_rib_${side}_${seam + 1}`, [0.025, 2.42, 0.024], materials.steel, [side * 1.298, 2.67, -7.75 + seam * 0.8], 0.008);
    }
    roundedPart(trailer, `side_sill_${side}`, [0.14, 0.13, 12.2], materials.steel, [side * 1.27, 1.36, -2.15], 0.03);
    roundedPart(trailer, `side_upper_rail_${side}`, [0.11, 0.11, 12.2], materials.steel, [side * 1.27, 3.98, -2.15], 0.025);
  }
  roundedPart(trailer, "trailer_front_bulkhead", [2.45, 2.58, 0.12], materials.body, [0, 2.67, 3.91], 0.035);
  roundedPart(trailer, "trailer_rear_header", [2.56, 0.18, 0.14], materials.steel, [0, 4.06, -8.28], 0.03);
  roundedPart(trailer, "trailer_threshold", [2.5, 0.18, 0.2], materials.steel, [0, 1.38, -8.3], 0.025);
  for (const x of [-1.18, 1.18]) {
    roundedPart(trailer, `rear_frame_${x < 0 ? "left" : "right"}`, [0.12, 2.57, 0.14], materials.steel, [x, 2.67, -8.28], 0.025);
  }

  for (const x of [-0.63, 0.63]) {
    for (const z of [-6.9, -4.35, -1.8]) {
      const pallet = addPallet(trailer, `cargo_pallet_${Math.abs(x).toFixed(2)}_${Math.abs(z).toFixed(2)}`, x, z);
      addCargo(trailer, pallet, Math.round((z + 6.9) / 2.55) * 2 + (x > 0 ? 1 : 0));
    }
  }

  const leftDoor = new THREE.Group();
  leftDoor.name = "rearDoorLeft";
  leftDoor.position.set(-1.22, 2.67, -8.32);
  trailer.add(leftDoor);
  const rightDoor = new THREE.Group();
  rightDoor.name = "rearDoorRight";
  rightDoor.position.set(1.22, 2.67, -8.32);
  trailer.add(rightDoor);
  for (const [door, direction, label] of [[leftDoor, 1, "left"], [rightDoor, -1, "right"]]) {
    roundedPart(door, `rear_door_${label}_skin`, [1.22, 2.55, 0.1], materials.body, [direction * 0.61, 0, -0.04], 0.035);
    roundedPart(door, `rear_door_${label}_inner`, [1.12, 2.42, 0.035], materials.inside, [direction * 0.61, 0, 0.025], 0.015);
    roundedPart(door, `rear_door_${label}_edge`, [0.055, 2.48, 0.12], materials.steel, [direction * 1.18, 0, 0], 0.015);
    const lockBar = new THREE.Group();
    lockBar.name = label === "left" ? "lockBarLeft" : "lockBarRight";
    lockBar.position.set(direction * 0.61, 0, -0.1);
    door.add(lockBar);
    roundedPart(lockBar, `lock_bar_${label}`, [0.07, 2.13, 0.07], materials.darkSteel, [0, 0, 0], 0.03);
    for (const y of [-0.91, 0.91]) {
      roundedPart(lockBar, `lock_handle_${label}_${y}`, [0.13, 0.08, 0.12], materials.steel, [0, y, 0], 0.025);
    }
    for (const y of [-0.9, -0.3, 0.3, 0.9]) {
      roundedPart(door, `rear_rib_${label}_${y}`, [1.12, 0.025, 0.035], materials.steel, [direction * 0.61, y, -0.1], 0.01);
    }
    for (const y of [-1, 0, 1]) {
      const hinge = new THREE.Group();
      hinge.name = `rear_hinge_${label}_${y}`;
      hinge.position.set(direction * 1.16, y, 0);
      roundedPart(hinge, `hinge_knuckle_${label}_${y}`, [0.14, 0.2, 0.14], materials.steel, [0, 0, 0], 0.035);
      door.add(hinge);
    }
  }

  roundedPart(trailer, "chassis_main_rail_left", [0.18, 0.24, 12.45], materials.darkSteel, [-0.83, 1.08, -2.15], 0.045);
  roundedPart(trailer, "chassis_main_rail_right", [0.18, 0.24, 12.45], materials.darkSteel, [0.83, 1.08, -2.15], 0.045);
  for (let cross = 0; cross < 13; cross++) {
    roundedPart(trailer, `chassis_crossmember_${cross + 1}`, [2.12, 0.12, 0.11], materials.steel, [0, 1.08, -8 + cross * 0.98], 0.025);
  }
  roundedPart(trailer, "kingpin", [0.5, 0.22, 0.55], materials.steel, [0, 1.08, 4.38], 0.05);
  for (const z of [-6.0, -5.0, -4.0]) {
    addWheel(trailer, `trailer_axle_${Math.abs(z).toFixed(2)}_left`, -1.25, z);
    addWheel(trailer, `trailer_axle_${Math.abs(z).toFixed(2)}_right`, 1.25, z);
  }
}

export function createTruckModel() {
  const root = new THREE.Group();
  root.name = "truckRoot";
  addTrailer(root);
  addCab(root);
  return root;
}
