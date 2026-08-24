'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LogoutButtonProps {
  className?: string;
  label?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  showIcon?: boolean;
}

export default function LogoutButton({
  className = '',
  label = 'Terminar sessão',
  variant = 'secondary',
  showIcon = true
}: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch {
      // Força o redirecionamento mesmo em falha de rede
    } finally {
      router.push('/login');
      router.refresh();
    }
  }

  const baseVariantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'btn-ghost'
  }[variant];

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={`${baseVariantClass} ${className}`}
      title={label}
    >
      {showIcon && <span className="text-base leading-none">🚪</span>}
      <span>{loading ? 'A sair...' : label}</span>
    </button>
  );
}
