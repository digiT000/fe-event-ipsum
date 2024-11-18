import Link from "next/link";
import { useRouter } from "next/router";

interface NavLinkProps {
  children: React.ReactNode;
  href: string;
  activeClassName?: string;
  nonActiveClassName?: string;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({
  children,
  href,
  activeClassName = "text-sm bg-indigo-100 text-indigo-600 font-semibold rounded-md p-3",
  nonActiveClassName = "text-sm bg-white text-gray-900 font-semibold p-3",
  className,
}) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  const newClassName = `${isActive ? activeClassName : nonActiveClassName} ${className}`;

  return (
    <Link href={href ?? "/"} className={newClassName}>
      {children}
    </Link>
  );
};

export default NavLink;
