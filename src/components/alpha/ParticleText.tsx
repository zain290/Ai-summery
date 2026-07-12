import React, { useEffect, useRef } from 'react';

interface ParticleTextProps {
  text: string;
  fontSize?: number;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  disableInteraction?: boolean;
}

class Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  density: number;

  constructor(x: number, y: number) {
    this.x = x + Math.random() * 100 - 50;
    this.y = y + Math.random() * 100 - 50;
    this.baseX = x;
    this.baseY = y;
    this.size = Math.random() * 2 + 1;
    this.density = Math.random() * 30 + 1;
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update(mouseX: number, mouseY: number, radius: number) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const forceDirectionX = dx / distance;
    const forceDirectionY = dy / distance;
    const maxDistance = radius;
    const force = (maxDistance - distance) / maxDistance;
    const directionX = forceDirectionX * force * this.density;
    const directionY = forceDirectionY * force * this.density;

    if (distance < radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        const dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y !== this.baseY) {
        const dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }
  }
}

const ParticleText: React.FC<ParticleTextProps> = ({
  text,
  fontSize = 120,
  width,
  height,
  color = 'currentColor',
  className = '',
  disableInteraction = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -1000, y: -1000, radius: 30 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const init = () => {
      const parentWidth = canvas.parentElement?.clientWidth;
      const canvasWidth = width ?? parentWidth ?? window.innerWidth;
      const canvasHeight = height ?? fontSize * 1.5;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const scanScale = 0.25;
      const scanCanvas = document.createElement('canvas');
      const scanCtx = scanCanvas.getContext('2d', { willReadFrequently: true });
      if (!scanCtx) return;

      scanCanvas.width = canvasWidth * scanScale;
      scanCanvas.height = canvasHeight * scanScale;

      scanCtx.fillStyle = 'white';
      scanCtx.font = `bold ${fontSize * scanScale}px "Neue Montreal", sans-serif`;
      scanCtx.textAlign = 'center';
      scanCtx.textBaseline = 'middle';
      scanCtx.fillText(text, scanCanvas.width / 2, scanCanvas.height / 2);

      const imageData = scanCtx.getImageData(0, 0, scanCanvas.width, scanCanvas.height);
      particles.current = [];

      for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
          if (imageData.data[(y * imageData.width + x) * 4 + 3] > 128) {
            particles.current.push(new Particle(x / scanScale, y / scanScale));
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach(p => {
        p.update(mouse.current.x, mouse.current.y, mouse.current.radius);
        p.draw(ctx, color);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (disableInteraction) return;
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };

    init();

    const observer = new IntersectionObserver((entries) => {
      const isIntersecting = entries[0]?.isIntersecting;
      if (isIntersecting) {
        if (!animationFrameId) { animate(); }
      } else {
        if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = 0; }
      }
    }, { threshold: 0 });

    observer.observe(canvas);

    if (!disableInteraction) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    const handleResize = () => {
      if (width || height) return;
      init();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [text, fontSize, color, width, height, disableInteraction]);

  return (
    <div className={`relative ${className}`} style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : 'auto' }}>
      <canvas ref={canvasRef} className="block w-full h-auto cursor-default" style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default ParticleText;