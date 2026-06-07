"use client";


import Link from "next/link";
import { usePathname } from "next/navigation";
import "./admin.css";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Products", href: "/admin/products" },
    { name: "Offers", href: "/admin/offers" },
    { name: "Flyers", href: "/admin/flyers" },
    { name: "Upload PDF", href: "/admin/flyers/upload" },
  ];

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2 className="admin-logo">Admin</h2>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                pathname === item.href
                  ? "admin-nav-item active"
                  : "admin-nav-item"
              }
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1 className="admin-title">Control Panel</h1>
        </header>

        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
