import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  type: 'circle' | 'triangle' | 'square';
}

interface MousePosition {
  x: number;
  y: number;
}

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const mouseRef = useRef<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.min(150, Math.floor((canvas.width * canvas.height) / 8000));
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          color: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'][Math.floor(Math.random() * 6)],
          opacity: Math.random() * 0.5 + 0.2,
          type: ['circle', 'triangle', 'square'][Math.floor(Math.random() * 3)] as 'circle' | 'triangle' | 'square'
        });
      }
    };

    initParticles();

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Draw particle
    const drawParticle = (particle: Particle) => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;

      switch (particle.type) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y - particle.size);
          ctx.lineTo(particle.x - particle.size, particle.y + particle.size);
          ctx.lineTo(particle.x + particle.size, particle.y + particle.size);
          ctx.closePath();
          ctx.fill();
          break;
        case 'square':
          ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size);
          break;
      }
      ctx.restore();
    };

    // Draw connections
    const drawConnections = () => {
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.save();
            ctx.globalAlpha = (100 - distance) / 100 * 0.1;
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };

    // Mouse interaction
    const handleMouseInteraction = () => {
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      
      particles.forEach(particle => {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          particle.vx += dx * force * 0.0001;
          particle.vy += dy * force * 0.0001;
          particle.opacity = Math.min(1, particle.opacity + force * 0.01);
        }
      });
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Fade effect
        particle.opacity *= 0.999;
        if (particle.opacity < 0.1) particle.opacity = 0.1;

        drawParticle(particle);
      });

      drawConnections();
      handleMouseInteraction();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
          `,
          animation: 'gradientShift 15s ease-in-out infinite',
          '@keyframes gradientShift': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.7 }
          }
        }
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          mixBlendMode: 'screen'
        }}
      />
      
      {/* Floating geometric shapes */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '80px',
          height: '80px',
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
          borderRadius: '50%',
          animation: 'float1 6s ease-in-out infinite',
          '@keyframes float1': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-20px) rotate(180deg)' }
          }
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          top: '70%',
          right: '15%',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(45deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          animation: 'float2 8s ease-in-out infinite',
          '@keyframes float2': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-30px) rotate(120deg)' }
          }
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          top: '30%',
          right: '20%',
          width: '40px',
          height: '40px',
          background: 'linear-gradient(45deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
          borderRadius: '8px',
          animation: 'float3 10s ease-in-out infinite',
          '@keyframes float3': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-25px) rotate(90deg)' }
          }
        }}
      />
    </Box>
  );
};

export default AnimatedBackground;
