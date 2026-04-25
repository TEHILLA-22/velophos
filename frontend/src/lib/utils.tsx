
# lib/utils.ts
utils_ts = '''import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function lerp(start: number, end: number, t: number) {
  return start * (1 - t) + end * t;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
'''

with open(f"{base_dir}/lib/utils.ts", "w") as f:
    f.write(utils_ts)

# hooks/useScrollProgress.ts
useScrollProgress = '''"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());
  const rafId = useRef<number>();

  const updateScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentProgress = docHeight > 0 ? currentScrollY / docHeight : 0;
    
    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      const newVelocity = (currentScrollY - lastScrollY.current) / dt;
      setVelocity(newVelocity);
    }
    
    lastScrollY.current = currentScrollY;
    lastTime.current = now;
    
    setScrollY(currentScrollY);
    setProgress(Math.min(Math.max(currentProgress, 0), 1));
    
    rafId.current = requestAnimationFrame(updateScroll);
  }, []);

  useEffect(() => {
    rafId.current = requestAnimationFrame(updateScroll);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updateScroll]);

  return { progress, scrollY, velocity };
}
'''

with open(f"{base_dir}/hooks/useScrollProgress.ts", "w") as f:
    f.write(useScrollProgress)

# hooks/useMousePosition.ts
useMousePosition = '''"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export function useMousePosition() {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });
  
  const rafId = useRef<number>();
  const targetPos = useRef({ x: 0, y: 0 });

  const updatePosition = useCallback(() => {
    setPosition((prev) => ({
      x: prev.x + (targetPos.current.x - prev.x) * 0.1,
      y: prev.y + (targetPos.current.y - prev.y) * 0.1,
      normalizedX: (prev.x + (targetPos.current.x - prev.x) * 0.1) / window.innerWidth,
      normalizedY: (prev.y + (targetPos.current.y - prev.y) * 0.1) / window.innerHeight,
    }));
    rafId.current = requestAnimationFrame(updatePosition);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafId.current = requestAnimationFrame(updatePosition);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updatePosition]);

  return position;
}
'''

with open(f"{base_dir}/hooks/useMousePosition.ts", "w") as f:
    f.write(useMousePosition)

print("Utils and hooks created")
