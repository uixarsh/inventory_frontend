import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function LineItemRow({ item, onRemove }) {
  const subtotal = item.price * item.quantity;

  return (
    <TableRow className="border-white/5 hover:bg-white/5">
      <TableCell className="font-medium">{item.product_name}</TableCell>
      <TableCell className="text-center">{item.quantity}</TableCell>
      <TableCell className="text-right">${Number(item.price).toFixed(2)}</TableCell>
      <TableCell className="text-right">${subtotal.toFixed(2)}</TableCell>
      <TableCell className="text-right">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onRemove(item.product_id)}
          className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
