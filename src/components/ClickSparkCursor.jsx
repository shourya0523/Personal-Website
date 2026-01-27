import { useRef, useEffect, useCallback } from 'react';

const ClickSparkCursor = ({
  sparkColor = '#fff',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1.0,
}) => {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const animationFrameRef = useRef(null);
  const isAnimatingRef = useRef(false);

  const easeFunc = useCallback(t => {
    switch (easing) {
      case 'linear':
        return t;
      case 'ease-in':
        return t * t;
      case 'ease-in-out':
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      default:
        return t * (2 - t);
    }
  }, [easing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.scale(dpr, dpr);

    const draw = (timestamp) => {
      if (sparksRef.current.length === 0) {
        isAnimatingRef.current = false;
        return;
      }

      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      sparksRef.current = sparksRef.current.filter(spark => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) {
          return false;
        }

        const progress = elapsed / duration;
        const eased = easeFunc(progress);

        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      if (sparksRef.current.length > 0) {
        animationFrameRef.current = requestAnimationFrame(draw);
      } else {
        isAnimatingRef.current = false;
      }
    };

    const handleClick = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      const now = performance.now();
      const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
        x,
        y,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now
      }));

      sparksRef.current.push(...newSparks);

      // Start animation loop if not already running
      if (!isAnimatingRef.current) {
        isAnimatingRef.current = true;
        animationFrameRef.current = requestAnimationFrame(draw);
      }
    };

    document.addEventListener('click', handleClick, { passive: true });

    return () => {
      document.removeEventListener('click', handleClick);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [sparkCount, sparkColor, sparkSize, sparkRadius, duration, easeFunc, extraScale]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        userSelect: 'none',
        willChange: 'contents', // GPU acceleration hint
      }}
    />
  );
};

export default ClickSparkCursor;
