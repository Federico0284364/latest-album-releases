'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string
}

const NavLink = ({ href, className, children }: NavLinkProps) => {
  const path = usePathname();
  const isActive = path === href;

  return (
    <Link href={href} className={twMerge(isActive ? 'text-fg bg-white/20 p-1 rounded-lg backdrop-blur-3xl' : 'text-fg', className)}>
      {children}
    </Link>
  );
};

export default NavLink;
