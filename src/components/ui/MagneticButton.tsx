import { useRef, useState } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function MagneticButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  type = 'button',
  disabled = false,
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!btnRef.current || disabled) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Shift up to 8px max toward cursor
    const dx = (e.clientX - centerX) * 0.18;
    const dy = (e.clientY - centerY) * 0.18;
    const clampedX = Math.max(-8, Math.min(8, dx));
    const clampedY = Math.max(-8, Math.min(8, dy));
    setOffset({ x: clampedX, y: clampedY });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <button
      ref={btnRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onPointerMove={handleMouseMove}
      onPointerEnter={handleMouseEnter}
      onPointerLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: 'transform 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`group relative overflow-hidden rounded-lg font-mono text-sm tracking-wider uppercase transition-all duration-250 cursor-pointer select-none ${
        variant === 'primary'
          ? 'bg-surface text-text-primary border border-hairline hover:border-transparent hover:shadow-[0_0_24px_rgba(212,132,74,0.3)]'
          : 'bg-transparent text-text-secondary border border-hairline hover:text-text-primary hover:border-text-secondary/40'
      } px-6 py-3.5 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {/* Sweep fusion gradient fill on hover */}
      {variant === 'primary' && (
        <span
          className={`absolute inset-0 bg-fusion transition-all duration-300 ease-out ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        />
      )}

      {/* Button Content Label */}
      <span className="relative z-10 font-medium flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
