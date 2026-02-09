"use client"

import { ShoppingCart, Package, Tags, LogOut} from "lucide-react";
import Link from "next/link";
import { usePathname} from 'next/navigation';
import {cn} from "@/lib/utils" ;
import { Button} from '@/components/ui/button';
import { logoutAction } from '@/actions/auth';

interface SidebarProps {
  userName: string;
}

const menuItems = [
  {
    title: "Pedidos",
    href: "/dashboard",
    icon: ShoppingCart,
  },
  {
    title: "Produtos",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Categorias",
    href: "/dashboard/categories",
    icon: Tags,
  },
];

export function Sidebar({ userName }: SidebarProps) {

    const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col h-screen w-64 border-r border-app-border bg-app-sidebar">
      {/* HEADER */}
      <div className="border-b border-app-border p-6">
        <h2 className="text-xl font-bold text-white">
            <span className="block ">Augusto</span>
            <span className="block text-brand-primary">Hamburgueria</span>
        </h2>
        <p className="text-sm text-gray-300 mt-1">Olá, {userName}</p>
      </div>

      {/* MENU */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((menu) => {
          const Icon = menu.icon;
          const isActive = pathname === menu.href

          return (
            <Link 
                href={menu.href} 
                key={menu.title}
                className={cn(
                    "flex items-center gap-3 p-2 rounded-md text-gray-200 hover:bg-app-hover hover:text-white transition border-md transition-colors duration-300",
                    isActive ? "bg-brand-primary text-white": "hover:bg-gray-600"
                )}
            >
              <Icon className="w-5 h-5" />
              {menu.title}
            </Link>
          );
        })}
      </nav>

        <div className="border-t border-app-border p-4">
            <form action={logoutAction}>
                <Button 
                    type="submit"
                    variant="ghost"
                    className="w-full justfy-start gap-3 text-white hover:text-white hover:bg-trasparent"
                >
                    <LogOut className="w-5 h-5" />
                    Sair
                </Button>
            </form> 
        </div>
    </aside>
  );
}
