import { useState } from "react";
import DataTable from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useDeleteOrder } from "@/hooks/useOrders";
import OrderDetailModal from "./OrderDetailModal";

export default function OrderTable({ data, customers = [], products = [], isLoading }) {
  const [viewingOrder, setViewingOrder] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const deleteMutation = useDeleteOrder();

  const handleDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => setDeletingId(null),
      });
    }
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.customer_id === customerId || c.id === customerId);
    return customer ? (customer.full_name || customer.name) : "Unknown Customer";
  };

  const columns = [
    { header: "Order ID", accessorKey: "order_id" },
    { 
      header: "Customer", 
      accessorKey: "customer_id",
      cell: (row) => getCustomerName(row.customer_id)
    },
    { 
      header: "Items", 
      accessorKey: "items",
      cell: (row) => row.items?.length || 0
    },
    { 
      header: "Total", 
      accessorKey: "total_amount",
      cell: (row) => <span className="font-medium text-primary">${Number(row.total_amount || row.total || 0).toFixed(2)}</span>
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setViewingOrder(row)} className="h-8 w-8 hover:bg-white/10 hover:text-primary">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeletingId(row.order_id || row.id)} className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <>
      <DataTable 
        columns={columns} 
        data={data} 
        isLoading={isLoading} 
        emptyMessage="No orders found. Create an order to get started." 
      />

      <OrderDetailModal 
        open={!!viewingOrder} 
        onOpenChange={(open) => !open && setViewingOrder(null)}
        order={viewingOrder}
        products={products}
      />

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Cancel Order"
        description="Are you sure you want to cancel this order? This action cannot be undone."
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
