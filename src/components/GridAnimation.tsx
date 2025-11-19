'use client';

import { useEffect, useRef } from 'react';

interface ColoredSquare {
  col: number;
  row: number;
  color: string;
  age: number;
}

const GridAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Grid settings
    const gridSize = 40; // Square size in pixels
    const cols = Math.floor(canvas.width / gridSize);
    const rows = Math.floor(canvas.height / gridSize);

    // Color palette (matching the screenshot)
    const colors = [
      '#1e3a5f', '#c84b4b', '#8b6f47', '#4a5f3a', '#6b8bb8',
      '#d4a05f', '#9b5a8b', '#5f7a9b', '#b8a67a', '#7a5f4a',
      '#4a7a5f', '#c86b8b', '#f4d66b', '#8b4a6b', '#6ba8d4',
      '#d47a5f', '#9ba8c8', '#5f4a7a', '#c8b8a0', '#4a6b8b',
    ];

    // Initialize colored squares
    const coloredSquares: ColoredSquare[] = [];
    const fillPercentage = 0.05;
    const initialSquares = Math.floor(cols * rows * fillPercentage);

    for (let i = 0; i < initialSquares; i++) {
      coloredSquares.push({
        col: Math.floor(Math.random() * cols),
        row: Math.floor(Math.random() * rows),
        color: colors[Math.floor(Math.random() * colors.length)],
        age: Math.floor(Math.random() * 100)
      });
    }

    // Draw grid function
    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(19, 19, 19, 0.2)';
      ctx.lineWidth = 1;

      // Draw vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#f5f5f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Redraw grid
      drawGrid();

      // Update and draw colored squares
      coloredSquares.forEach((square) => {
        // Draw the square
        ctx.fillStyle = square.color;
        ctx.fillRect(square.col * gridSize, square.row * gridSize, gridSize, gridSize);

        // Age the square
        square.age++;

        // Glitchy behavior - random chance to move, change color, or disappear
        if (Math.random() < 0.02) { // 2% chance per frame
          const action = Math.random();
          
          if (action < 0.3) {
            // Move to adjacent square (snake-like but glitchy)
            const direction = Math.floor(Math.random() * 4);
            switch(direction) {
              case 0: square.col = Math.max(0, square.col - 1); break; // left
              case 1: square.col = Math.min(cols - 1, square.col + 1); break; // right
              case 2: square.row = Math.max(0, square.row - 1); break; // up
              case 3: square.row = Math.min(rows - 1, square.row + 1); break; // down
            }
          } else if (action < 0.6) {
            // Change color (pixel glitch)
            square.color = colors[Math.floor(Math.random() * colors.length)];
          } else if (action < 0.7) {
            // Teleport to random location
            square.col = Math.floor(Math.random() * cols);
            square.row = Math.floor(Math.random() * rows);
          } else {
            // Disappear and create new square elsewhere
            square.col = Math.floor(Math.random() * cols);
            square.row = Math.floor(Math.random() * rows);
            square.color = colors[Math.floor(Math.random() * colors.length)];
            square.age = 0;
          }
        }
      });

      // Randomly add new squares (glitch spawn)
      if (Math.random() < 0.05 && coloredSquares.length < cols * rows * 0.1) {
        coloredSquares.push({
          col: Math.floor(Math.random() * cols),
          row: Math.floor(Math.random() * rows),
          color: colors[Math.floor(Math.random() * colors.length)],
          age: 0
        });
      }

      // Randomly remove old squares
      if (Math.random() < 0.03 && coloredSquares.length > initialSquares * 0.5) {
        const randomIndex = Math.floor(Math.random() * coloredSquares.length);
        coloredSquares.splice(randomIndex, 1);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-background z-[999]">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default GridAnimation;