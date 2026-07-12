import React, { useRef, type ReactNode } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface MagnetProps {
  children: ReactNode;
  strength?: number;
}

const Magnet: React.FC<MagnetProps> = ({ children, strength = 0.5 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    mouseX.set((e.clientX - centerX) * strength);
    mouseY.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
    >
      {children}
    </motion.div>
  );
};

export default Magnet;
