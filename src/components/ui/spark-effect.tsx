import { useEffect, useRef } from 'react';

interface SparkEffectProps {
  selector?: string;
  amount?: number;
  speed?: number;
  lifetime?: number;
  direction?: { x: number; y: number };
  size?: [number, number];
  maxopacity?: number;
  color?: string;
  randColor?: boolean;
  acceleration?: [number, number];
  zIndex?: number;
}

export function SparkEffect({
  selector = '#sparks',
  amount = 300, 
  speed = 0.08,
  lifetime = 200,
  direction = { x: 0, y: 1 }, 
  size = [3, 4],
  maxopacity = 1,
  color = '255, 200, 50', 
  randColor = false,
  acceleration = [5, 40],
  zIndex = 50 // High zIndex to ensure it's visible over the background
}: SparkEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const OPT = {
      selector,
      amount,
      speed: window.innerWidth < 520 ? 0.05 : speed,
      lifetime,
      direction,
      size,
      maxopacity,
      color: window.innerWidth < 520 ? color : color,
      randColor,
      acceleration
    };

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let sparks: any[] = [];
    let animationFrameId: number;
    let intervalId: number;

    function setCanvasWidth() {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    }

    function rand(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function Spark(this: any, x: number, y: number) {
      this.x = x;
      this.y = y;
      this.age = 0;
      this.acceleration = rand(OPT.acceleration[0], OPT.acceleration[1]);
      this.color = OPT.randColor
        ? `${rand(255, 255)},${rand(150, 220)},${rand(0, 50)}` 
        : OPT.color;
      this.opacity = OPT.maxopacity - this.age / (OPT.lifetime * rand(1, 10));

      this.go = function () {
        this.x += OPT.speed * OPT.direction.x * this.acceleration / 1.5;
        this.y += OPT.speed * OPT.direction.y * this.acceleration / 1.5;
        // Gravity
        this.y += (this.age * 0.02);
        this.opacity = OPT.maxopacity - ++this.age / OPT.lifetime;
      };
    }

    function addSpark() {
      let x = rand(-200, window.innerWidth + 200);
      let y = rand(-100, 0); // Always spawn above the screen so they fall down naturally
      sparks.push(new (Spark as any)(x, y));
    }

    function drawSpark(spark: any) {
      let x = spark.x,
        y = spark.y;
      spark.go();
      if (!ctx) return;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${spark.color}, ${spark.opacity})`;
      ctx.rect(x, y, OPT.size[0], OPT.size[1]);
      ctx.fill();
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.fillStyle = 'rgba(255,255,255,0)'; // fully transparent "wipe"
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparks.forEach((spark, i, array) => {
        if (spark.opacity <= 0) {
          array.splice(i, 1);
        } else {
          drawSpark(spark);
        }
      });
      animationFrameId = window.requestAnimationFrame(draw);
    }

    function init() {
      setCanvasWidth();
      intervalId = window.setInterval(() => {
        if (sparks.length < OPT.amount) {
          addSpark();
        }
      }, 1000 / OPT.amount);
      animationFrameId = window.requestAnimationFrame(draw);
    }

    window.addEventListener('resize', setCanvasWidth);
    init();

    return () => {
      window.removeEventListener('resize', setCanvasWidth);
      window.cancelAnimationFrame(animationFrameId);
      window.clearInterval(intervalId);
    };
  }, [selector, amount, speed, lifetime, direction, size, maxopacity, color, randColor, acceleration]);

  return (
    <canvas
      ref={canvasRef}
      id={selector.replace('#', '')}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        background: 'transparent',
        pointerEvents: 'none',
        zIndex: zIndex
      }}
    />
  );
}
