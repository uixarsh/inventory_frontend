import { useState } from "react";
import DataTable from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useDeleteCustomer } from "@/hooks/useCustomers";

export default function CustomerTable({ data, isLoading }) {
  const [deletingId, setDeletingId] = useState(null);
  const deleteMutation = useDeleteCustomer();

  const handleDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => setDeletingId(null),
      });
    }
  };

  const columns = [
    { header: "Full Name", accessorKey: "full_name" },
    { header: "Email", accessorKey: "email" },
    { header: "Phone", accessorKey: "phone_number" },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setDeletingId(row.customer_id || row.id)} className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive">
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
        emptyMessage="No customers found. Add your first customer." 
      />

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Delete Customer"
        description="Are you sure you want to delete this customer? This action cannot be undone."
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
