import PageHeader from "@/components/shared/PageHeader";
import { Plus } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { useCustomers } from "@/hooks/useCustomers";
import { useProducts } from "@/hooks/useProducts";
import OrderTable from "@/components/orders/OrderTable";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: customers, isLoading: customersLoading } = useCustomers();
  const { data: products, isLoading: productsLoading } = useProducts();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Orders" 
        actionLabel="Create Order" 
        actionIcon={Plus}
        onAction={() => navigate("/orders/new")} 
      />

      <OrderTable 
        data={orders} 
        customers={customers} 
        products={products} 
        isLoading={ordersLoading || customersLoading || productsLoading} 
      />
    </div>
  );
}
