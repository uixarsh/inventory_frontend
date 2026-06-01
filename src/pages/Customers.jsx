import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Plus } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import CustomerTable from "@/components/customers/CustomerTable";
import CustomerFormModal from "@/components/customers/CustomerFormModal";

export default function Customers() {
  const { data: customers, isLoading } = useCustomers();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Customers" 
        actionLabel="Add Customer" 
        actionIcon={Plus}
        onAction={() => setIsAddModalOpen(true)} 
      />

      <CustomerTable data={customers} isLoading={isLoading} />

      <CustomerFormModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
      />
    </div>
  );
}
