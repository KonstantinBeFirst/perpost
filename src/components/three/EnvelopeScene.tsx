"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { makeAddress, makeLetter, makeLiner, makeRubber, makeStamp } from "./textures";

/* ---------- timing helpers ---------- */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (a: number, b: number, v: number) => clamp((v - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const backOut = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ---------- geometry ---------- */
const W = 3.0;
const H = 1.88;
const LW = 2.3;
const LH = LW * 1.414;

function pocketShape() {
  const s = new THREE.Shape();
  s.moveTo(-W / 2, -H / 2);
  s.lineTo(W / 2, -H / 2);
  s.lineTo(W / 2, H / 2 - 0.06);
  s.lineTo(0, -H * 0.06);
  s.lineTo(-W / 2, H / 2 - 0.06);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}
function flapShape() {
  const s = new THREE.Shape();
  s.moveTo(-W / 2, 0);
  s.lineTo(W / 2, 0);
  s.lineTo(0.09, -H * 0.6);
  s.quadraticCurveTo(0, -H * 0.64, -0.09, -H * 0.6);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

function grainTex(color: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 256, 256);
  const img = ctx.getImageData(0, 0, 256, 256);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 12;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 2);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function shadowTex() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
  g.addColorStop(0, "rgba(40,32,20,0.55)");
  g.addColorStop(0.55, "rgba(40,32,20,0.22)");
  g.addColorStop(1, "rgba(40,32,20,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function trailTex() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 8;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 256, 0);
  g.addColorStop(0, "rgba(255,255,255,0)");
  g.addColorStop(1, "rgba(255,255,255,1)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 8);
  return new THREE.CanvasTexture(c);
}

export type SceneInput = { scroll: React.MutableRefObject<number>; pointer: React.MutableRefObject<{ x: number; y: number }> };

function Director({ scroll, pointer }: SceneInput) {
  const { viewport } = useThree();
  const rig = useRef<THREE.Group>(null!);
  const env = useRef<THREE.Group>(null!);
  const flap = useRef<THREE.Group>(null!);
  const letter = useRef<THREE.Group>(null!);
  const stamp = useRef<THREE.Mesh>(null!);
  const rubber = useRef<THREE.Mesh>(null!);
  const trails = useRef<THREE.Group>(null!);
  const shadow = useRef<THREE.Mesh>(null!);
  const t0 = useRef<number | null>(null);
  const prevX = useRef(0);

  // textures are drawn with the site fonts; rebuild once they have loaded so nothing measures with a fallback
  const tex = useMemo(() => {
    const L = makeLetter();
    return {
      letter: L,
      address: makeAddress(),
      stamp: makeStamp(),
      rubber: makeRubber(),
      liner: makeLiner(),
      paper: grainTex("#efe4c9"),
      paper2: grainTex("#f4ebd5"),
      trail: trailTex(),
      shadow: shadowTex(),
    };
  }, []);
  const geo = useMemo(() => ({ pocket: pocketShape(), flap: flapShape() }), []);


  useFrame((state, dt) => {
    if (t0.current === null) t0.current = state.clock.elapsedTime;
    const T = state.clock.elapsedTime - t0.current;
    const s = scroll.current;
    const mobile = viewport.width < 7.5;

    /* intro */
    const fly = easeOut(seg(0.15, 1.35, T));
    const flapIntro = easeInOut(seg(1.3, 2.0, T));
    const riseIntro = easeOut(seg(1.85, 2.9, T));
    const typing = s > 0.015 ? 1 : seg(2.5, 6.2, T);
    const sig = s > 0.015 ? 1 : seg(6.2, 7.0, T);
    tex.letter.draw(typing, sig);

    /* scroll story */
    const toCenter = easeInOut(seg(0.0, 0.12, s));
    const fold = easeInOut(seg(0.03, 0.12, s));
    const down = easeInOut(seg(0.07, 0.17, s));
    const closeFlap = easeInOut(seg(0.2, 0.3, s));
    const turn = easeInOut(seg(0.32, 0.48, s));
    const stampIn = backOut(seg(0.5, 0.56, s));
    const rubberIn = seg(0.6, 0.65, s);
    const out = Math.pow(seg(0.8, 1, s), 2.2);

    // base placement: hero (right / below headline) -> story (right of captions / upper on phone)
    const heroX = mobile ? 0 : viewport.width * 0.22;
    const heroY = mobile ? -viewport.height * 0.47 : -0.9;
    const storyX = mobile ? 0 : viewport.width * 0.17;
    const storyY = mobile ? viewport.height * 0.12 : -0.1;
    const scale = mobile ? Math.min(0.92, viewport.width / 4.4) : 1.0;

    const bx = lerp(heroX, storyX, toCenter);
    const by = lerp(heroY, storyY, toCenter);
    const idle = Math.sin(T * 1.1) * 0.06 * (1 - out);
    env.current.position.set(lerp(-viewport.width * 0.9, bx, fly) + out * viewport.width * 1.1, by + idle + out * 2.6, 0);
    env.current.rotation.z = lerp(0.35, 0, fly) - out * 0.35 + Math.sin(T * 0.8) * 0.015;
    env.current.rotation.y = lerp(-0.3, 0.12, turn) + turn * Math.PI + Math.sin(T * 0.6) * 0.04;
    env.current.rotation.x = -0.14 + turn * 0.16 * Math.sin(turn * Math.PI);
    const storyScale = mobile ? scale * 1.05 : 1.18;
    env.current.scale.setScalar(lerp(scale, storyScale, toCenter) * lerp(1, 0.86, out));

    // flap: closed lies on the pocket; open stands up behind the letter
    const open = flapIntro * (1 - closeFlap);
    flap.current.rotation.x = -open * (Math.PI + 0.08);
    flap.current.position.z = lerp(0.06, -0.02, seg(0.75, 1, open));

    // letter: rises out of the envelope, folds and goes back in
    const rise = riseIntro * (1 - down);
    letter.current.position.y = lerp(-0.18, mobile ? 1.15 : 1.55, rise);
    letter.current.position.z = 0.03 + rise * 0.04;
    letter.current.rotation.x = -rise * 0.06;
    letter.current.scale.y = lerp(1, 0.31, fold);
    letter.current.visible = closeFlap < 0.98;

    // stamps on the address side
    stamp.current.scale.setScalar(Math.max(0.0001, stampIn));
    (stamp.current.material as THREE.MeshStandardMaterial).opacity = clamp(stampIn * 3);
    const rb = rubberIn > 0 ? lerp(1.9, 1, easeOut(rubberIn)) : 1.9;
    rubber.current.scale.setScalar(rb);
    (rubber.current.material as THREE.MeshBasicMaterial).opacity = rubberIn > 0 ? clamp(rubberIn * 2.5) * 0.92 : 0;

    // soft shadow on the backdrop, offset down-right like a top-left key light
    const sc = env.current.scale.x;
    shadow.current.position.set(env.current.position.x + 0.32 * sc, env.current.position.y - 0.5 * sc + rise * 0.55 * sc, -1.4);
    shadow.current.scale.set(W * sc * 1.25, (H + rise * 1.6) * sc * 1.35, 1);
    (shadow.current.material as THREE.MeshBasicMaterial).opacity = 0.85 * fly * (1 - out);

    // pointer tilt
    rig.current.rotation.y = lerp(rig.current.rotation.y, pointer.current.x * 0.22, 1 - Math.pow(0.001, dt));
    rig.current.rotation.x = lerp(rig.current.rotation.x, -pointer.current.y * 0.14, 1 - Math.pow(0.001, dt));

    // speed trails follow the envelope, brightness from horizontal speed
    const vx = (env.current.position.x - prevX.current) / Math.max(dt, 0.001);
    prevX.current = env.current.position.x;
    const speed = clamp(Math.abs(vx) / 9);
    trails.current.position.set(env.current.position.x - W * 0.5 * scale, env.current.position.y, -0.1);
    trails.current.children.forEach((m, i) => {
      const mat = (m as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = lerp(mat.opacity, speed * (i % 2 ? 0.35 : 0.75), 0.25);
      m.scale.x = 0.4 + speed * 2.2;
      m.position.x = -m.scale.x * 1.2;
    });
  });

  const paperMat = { roughness: 0.92, metalness: 0, } as const;

  return (
    <>
      <group ref={trails}>
        {[-0.62, -0.3, 0.05, 0.34, 0.6].map((y, i) => (
          <mesh key={y} position={[0, y, 0]}>
            <planeGeometry args={[2.4, i % 2 ? 0.035 : 0.06]} />
            <meshBasicMaterial map={tex.trail} color={i % 2 ? "#302E2E" : "#e9b949"} transparent opacity={0} depthWrite={false} />
          </mesh>
        ))}
      </group>

      <group ref={rig}>
        <mesh ref={shadow} position={[0, 0, -1.4]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={tex.shadow} transparent opacity={0} depthWrite={false} />
        </mesh>
        <group ref={env}>
          {/* inside of the back panel: yellow liner */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[W, H]} />
            <meshStandardMaterial map={tex.liner} {...paperMat} />
          </mesh>
          {/* outside of the back panel: address side */}
          <mesh position={[0, 0, -0.012]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[W, H]} />
            <meshStandardMaterial map={tex.address} {...paperMat} />
          </mesh>
          <mesh ref={stamp} position={[-1.1, 0.5, -0.02]} rotation={[0, Math.PI, 0.04]}>
            <planeGeometry args={[0.52, 0.64]} />
            <meshStandardMaterial map={tex.stamp} transparent {...paperMat} />
          </mesh>
          {/* rubber stamp lands in the empty corner under the Einschreiben label, clear of the address */}
          <mesh ref={rubber} position={[0.86, -0.62, -0.024]} rotation={[0, Math.PI, 0.09]}>
            <planeGeometry args={[0.82, 0.237]} />
            <meshBasicMaterial map={tex.rubber} transparent depthWrite={false} toneMapped={false} />
          </mesh>

          {/* letter */}
          <group ref={letter} position={[0, -0.18, 0.03]}>
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[LW, LH]} />
              <meshStandardMaterial map={tex.letter.tex} roughness={0.85} metalness={0} />
            </mesh>
          </group>

          {/* front pocket */}
          <mesh geometry={geo.pocket} position={[0, 0, 0.05]}>
            <meshStandardMaterial map={tex.paper2} {...paperMat} />
          </mesh>
          {/* crease shading on the pocket */}
          <mesh position={[0, -H * 0.18, 0.051]}>
            <planeGeometry args={[W, H * 0.64]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.035} depthWrite={false} />
          </mesh>

          {/* flap: outer paper + inner yellow liner */}
          <group ref={flap} position={[0, H / 2, 0.06]}>
            <mesh geometry={geo.flap}>
              <meshStandardMaterial map={tex.paper} side={THREE.FrontSide} {...paperMat} />
            </mesh>
            <mesh geometry={geo.flap}>
              <meshStandardMaterial map={tex.liner} side={THREE.BackSide} {...paperMat} />
            </mesh>
          </group>
        </group>
      </group>
    </>
  );
}

export default function EnvelopeScene(props: SceneInput) {
  // stop rendering while the hero is off screen
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={wrap} className="absolute inset-0">
    <Canvas
      frameloop={visible ? "always" : "never"}
      camera={{ position: [0, 0, 11], fov: 32 }}
      dpr={[1, 1.6]}
      flat
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={1.05} color="#fff8ee" />
      <directionalLight position={[-5, 6, 7]} intensity={1.7} color="#fff3dc" />
      <directionalLight position={[6, -2, 4]} intensity={0.6} color="#bcd0ff" />
      <pointLight position={[3.5, -1.5, 2.5]} intensity={6} distance={10} color="#ffd98a" />
      <Director {...props} />
    </Canvas>
    </div>
  );
}
