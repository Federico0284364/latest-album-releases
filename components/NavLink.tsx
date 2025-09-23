'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string
}

const NavLink = ({ href, className, children }: Props) => {
  const path = usePathname();
  const isActive = path === href;

  return (
    <Link href={href} className={twMerge(isActive ? 'text-blue-400' : 'text-fg', className)}>
      {children}
    </Link>
  );
};

export default NavLink;
