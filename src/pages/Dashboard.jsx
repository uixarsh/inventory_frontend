import { useProducts } from "@/hooks/useProducts";
import { useCustomers } from "@/hooks/useCustomers";
import { useOrders } from "@/hooks/useOrders";
import StatCard from "@/components/shared/StatCard";
import { Package, Users, ShoppingCart, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import DataTable from "@/components/shared/DataTable";
import StockBadge from "@/components/products/StockBadge";
import PageHeader from "@/components/shared/PageHeader";

export default function Dashboard() {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: customers = [], isLoading: customersLoading } = useCustomers();
  const { data: orders = [], isLoading: ordersLoading } = useOrders();

  const isLoading = productsLoading || customersLoading || ordersLoading;

  const totalProducts = products.length;
  const totalCustomers = customers.length;
  const totalOrders = orders.length;

  const lowStockProducts = products
    .filter(p => (p.quantity_in_stock ?? p.quantity) < 10)
    .sort((a, b) => (a.quantity_in_stock ?? a.quantity) - (b.quantity_in_stock ?? b.quantity));

  const lowStockColumns = [
    { header: "Name", accessorKey: "name" },
    { header: "SKU", accessorKey: "sku" },
    { 
      header: "Price", 
      accessorKey: "price",
      cell: (row) => `$${Number(row.price).toFixed(2)}`
    },
    { 
      header: "Stock", 
      accessorKey: "quantity_in_stock",
      cell: (row) => <StockBadge quantity={row.quantity_in_stock ?? row.quantity} />
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader title="Dashboard Overview" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/products" className="block transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <StatCard 
            title="Total Products" 
            value={isLoading ? "..." : totalProducts} 
            icon={Package} 
          />
        </Link>
        <Link to="/customers" className="block transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <StatCard 
            title="Total Customers" 
            value={isLoading ? "..." : totalCustomers} 
            icon={Users} 
          />
        </Link>
        <Link to="/orders" className="block transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <StatCard 
            title="Total Orders" 
            value={isLoading ? "..." : totalOrders} 
            icon={ShoppingCart} 
          />
        </Link>
        <Link to="/products" className="block transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <StatCard 
            title="Low Stock Items" 
            value={isLoading ? "..." : lowStockProducts.length} 
            icon={AlertTriangle} 
            className={lowStockProducts.length > 0 ? "border-destructive/50 shadow-[0_0_15px_rgba(220,38,38,0.1)]" : ""}
          />
        </Link>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold tracking-tight">Low Stock Alerts</h3>
        <DataTable 
          columns={lowStockColumns} 
          data={lowStockProducts} 
          isLoading={productsLoading} 
          emptyMessage="All products are well stocked!" 
        />
      </div>
    </div>
  );
}
