import { useState } from "react";
import DataTable from "@/components/shared/DataTable";
import StockBadge from "./StockBadge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useDeleteProduct } from "@/hooks/useProducts";
import ProductFormModal from "./ProductFormModal";

export default function ProductTable({ data, isLoading }) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const deleteMutation = useDeleteProduct();

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => setDeletingId(null),
      });
    }
  };

  const columns = [
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
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row)} className="h-8 w-8 hover:bg-white/10 hover:text-primary">
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeletingId(row.product_id || row.id)} className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive">
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
        emptyMessage="No products found. Add your first product to get started." 
      />
      
      <ProductFormModal 
        open={isEditModalOpen} 
        onOpenChange={setIsEditModalOpen} 
        product={editingProduct} 
      />

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
