import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

export default function OrderDetailModal({ open, onOpenChange, order, products = [] }) {
  if (!order) return null;

  const getProductName = (productId) => {
    const product = products.find(p => p.product_id === productId || p.id === productId);
    return product ? product.name : productId;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] glass-card border-white/10">
        <DialogHeader>
          <DialogTitle>Order Details - {order.order_id || order.id}</DialogTitle>
          <DialogDescription className="sr-only">Detailed view of order items and totals</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="flex justify-between items-start text-sm">
            <div>
              <p className="text-muted-foreground">Customer</p>
              <p className="font-medium text-foreground">
                {order.customer?.full_name || order.customer_name || order.customer_id || "Unknown"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Created At</p>
              <p className="font-medium text-foreground">
                {order.created_at ? new Date(order.created_at).toLocaleDateString() : (order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Unknown")}
              </p>
            </div>
          </div>

          <Separator className="bg-white/5" />

          <div>
            <h4 className="font-semibold mb-3">Line Items</h4>
            <div className="rounded-xl border border-white/5 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead>Product Name</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(order.items || []).map((item, idx) => (
                    <TableRow key={idx} className="border-white/5 hover:bg-white/5">
                      <TableCell className="max-w-[200px] truncate" title={item.product_name || getProductName(item.product_id)}>
                        {item.product_name || getProductName(item.product_id)}
                      </TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">${Number(item.unit_price || item.price || 0).toFixed(2)}</TableCell>
                      <TableCell className="text-right">${(item.quantity * Number(item.unit_price || item.price || 0)).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  {(!order.items || order.items.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground border-white/5">
                        No line items found for this order.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <div className="text-right">
              <p className="text-muted-foreground text-sm">Total Amount</p>
              <p className="text-2xl font-bold text-primary">${Number(order.total_amount || order.total || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
