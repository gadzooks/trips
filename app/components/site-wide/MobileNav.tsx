// app/components/site-wide/MobileNav.tsx
"use client";
import { Menu } from 'lucide-react';
import { Button } from './Button';

interface MobileNavProps {
  onToggle: () => void;
}

export function MobileNav({ onToggle }: MobileNavProps) {
  return (
    <div className="md:hidden fixed top-4 left-4 z-50">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        aria-label="Toggle menu"
      >
        <Menu className="h-6 w-6" />
      </Button>
    </div>
  );
}