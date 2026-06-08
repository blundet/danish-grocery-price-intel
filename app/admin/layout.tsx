import "../_styles/admin.css";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin</h2>
        <nav>
          <ul>
            <li><a href="/admin">Dashboard</a></li>
            <li><a href="/admin/flyers/upload">Upload Flyers</a></li>
            <li><a href="/admin/products">Products</a></li>
            <li><a href="/admin/flyers">Offers</a></li>
          </ul>
        </nav>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
