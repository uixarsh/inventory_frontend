import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Plus, Search } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import ProductTable from "@/components/products/ProductTable";
import ProductFormModal from "@/components/products/ProductFormModal";
import { Input } from "@/components/ui/input";

export default function Products() {
  const { data: products, isLoading } = useProducts();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products?.filter((p) => {
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Products" 
        actionLabel="Add Product" 
        actionIcon={Plus}
        onAction={() => setIsAddModalOpen(true)} 
      />

      <div className="flex items-center gap-4 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products by name or SKU..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 focus-visible:ring-primary"
          />
        </div>
      </div>

      <ProductTable data={filteredProducts} isLoading={isLoading} />

      <ProductFormModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
      />
    </div>
  );
}
