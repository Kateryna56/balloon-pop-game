import React, { useState, useRef, useEffect } from 'react';

const App = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [balloons, setBallons] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Add new click event listener
    const clickHandler = (e) => {
      const mouseX = e.clientX - canvas.getBoundingClientRect().left;
      const mouseY = e.clientY - canvas.getBoundingClientRect().top;
      balloons.forEach((balloon, index) => {
        const distance = Math.sqrt((mouseX - balloon.x) ** 2 + (mouseY - balloon.y) ** 2);
        if (distance < balloon.radius) {
          setScore((prevScore) => prevScore + 1);
          balloons.splice(index, 1);
        }
      })
    };

    const createBalloon = () => {
      const balloon = {
        x: Math.random() * canvas.width,
        y: canvas.height,
        radius: 20,
        color: `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`,
        speed: Math.random() * 2 + 1,
      };
      balloons.push(balloon);
    };

    const drawBalloons = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      balloons.forEach((balloon, index) => {
        ctx.beginPath();
        ctx.arc(balloon.x, balloon.y, balloon.radius, 0, Math.PI * 2);
        ctx.fillStyle = balloon.color;
        ctx.fill();
        ctx.closePath();

        balloon.y -= balloon.speed;

        // Remove balloons that go out of the canvas
        if (balloon.y + balloon.radius < 0) {
          balloons.splice(index, 1);
        }
      });

      // Remove previous click event listener
      canvas.removeEventListener('click', clickHandler);
      canvas.addEventListener('click', clickHandler);
    };

    const gameLoop = setInterval(drawBalloons, 1000 / 60);
    const createLoop = setInterval(createBalloon, 500);

    return () => {
      clearInterval(gameLoop);
      clearInterval(createLoop);
      canvas.removeEventListener('click', clickHandler);
    };
  }, [score]);

  return (
    <div>
      <h1>Score: {score}</h1>
      <canvas ref={canvasRef} width={800} height={600} style={{ border: '1px solid #000' }} />
    </div>
  );
};

export default App;
