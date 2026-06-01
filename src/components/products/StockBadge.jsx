import { Badge } from "@/components/ui/badge";

export default function StockBadge({ quantity }) {
  if (quantity === 0) {
    return <Badge variant="destructive" className="bg-destructive/20 text-destructive border-destructive/20">Out of Stock</Badge>;
  }
  if (quantity < 10) {
    return <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/20 hover:bg-amber-500/30">Low Stock ({quantity})</Badge>;
  }
  return <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/30">In Stock ({quantity})</Badge>;
}
