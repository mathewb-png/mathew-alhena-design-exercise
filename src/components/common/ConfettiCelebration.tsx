import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: "circle" | "rect" | "line";
  life: number;
  maxLife: number;
}

const COLORS = [
  "#892AB8",
  "#EA4C89",
  "#FFFF04",
  "#4AF2FD",
  "#FF6B6B",
  "#51CF66",
  "#339AF0",
  "#FF922B",
];

interface ConfettiCelebrationProps {
  active: boolean;
  onComplete?: () => void;
  duration?: number;
}

export function ConfettiCelebration({
  active,
  onComplete,
  duration = 4000,
}: ConfettiCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const createParticles = useCallback((canvas: HTMLCanvasElement) => {
    const particles: Particle[] = [];
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.35;
    const count = 150;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 4 + Math.random() * 10;
      const shapes: Particle["shape"][] = ["circle", "rect", "line"];

      particles.push({
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed * (0.8 + Math.random() * 0.4),
        vy: Math.sin(angle) * speed * (0.6 + Math.random() * 0.6) - 3,
        size: 3 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        opacity: 1,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        life: 0,
        maxLife: 60 + Math.random() * 60,
      });
    }

    return particles;
  }, []);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    particlesRef.current = createParticles(canvas);
    const gravity = 0.15;
    const drag = 0.98;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = 0;
      for (const p of particlesRef.current) {
        p.life++;
        if (p.life > p.maxLife) continue;

        alive++;
        p.vy += gravity;
        p.vx *= drag;
        p.vy *= drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        const fadeStart = p.maxLife * 0.6;
        p.opacity =
          p.life > fadeStart
            ? 1 - (p.life - fadeStart) / (p.maxLife - fadeStart)
            : 1;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else if (p.shape === "rect") {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-p.size / 2, 0);
          ctx.lineTo(p.size / 2, 0);
          ctx.stroke();
        }

        ctx.restore();
      }

      if (alive > 0) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onCompleteRef.current?.();
      }
    }

    frameRef.current = requestAnimationFrame(animate);

    const timeout = setTimeout(() => {
      onCompleteRef.current?.();
    }, duration);

    return () => {
      cancelAnimationFrame(frameRef.current);
      clearTimeout(timeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [active, createParticles, duration]);

  return (
    <AnimatePresence>
      {active && (
        <motion.canvas
          ref={canvasRef}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[200] pointer-events-none"
          aria-hidden="true"
        />
      )}
    </AnimatePresence>
  );
}
