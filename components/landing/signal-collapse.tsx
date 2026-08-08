"use client";

import { useEffect, useRef } from "react";

/**
 * Signature visual: a noisy signal waveform on the left continuously
 * resolves into a clean, stable file block on the right — the thesis
 * of the product made literal (raw stream in, clean file out).
 */
export function SignalCollapse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const midY = h / 2;
      const resolveX = w * 0.62; // point where signal "resolves" into file
      const lines = 3;

      for (let l = 0; l < lines; l++) {
        const amp = (h * 0.16) / (l + 1.4);
        const freq = 0.045 + l * 0.01;
        const speed = 0.045 + l * 0.015;
        const opacity = l === 0 ? 0.9 : 0.28 - l * 0.06;
        const color = l === 0 ? "0, 212, 164" : "122, 127, 135";

        ctx.beginPath();
        for (let x = 0; x <= resolveX; x += 3) {
          const damp = Math.max(0, 1 - x / resolveX); // noise settles as it nears resolveX
          const noise = Math.sin(x * freq * 2.3 + t * speed * 3) * amp * 0.35 * damp;
          const wave = Math.sin(x * freq + t * speed) * amp * (0.55 + 0.45 * damp);
          const y = midY + wave + noise;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${color}, ${opacity})`;
        ctx.lineWidth = l === 0 ? 1.75 : 1;
        ctx.stroke();
      }

      // resolved flat line continuing into the file block
      ctx.beginPath();
      ctx.moveTo(resolveX, midY);
      ctx.lineTo(w, midY);
      ctx.strokeStyle = "rgba(0, 212, 164, 0.55)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // pulse dot travelling along resolved line
      const pulseX = resolveX + ((w - resolveX) * ((t * 0.6) % 1));
      ctx.beginPath();
      ctx.arc(pulseX, midY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 212, 164, 0.9)";
      ctx.fill();

      t += 1;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative w-full h-[180px] sm:h-[220px]">
      <canvas ref={canvasRef} className="w-full h-full block" aria-hidden="true" />
    </div>
  );
}
