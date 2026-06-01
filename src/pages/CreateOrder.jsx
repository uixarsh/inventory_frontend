import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCustomers } from "@/hooks/useCustomers";
import { useProducts } from "@/hooks/useProducts";
import { useCreateOrder } from "@/hooks/useOrders";
import LineItemRow from "@/components/orders/LineItemRow";
import { toast } from "sonner";

export default function CreateOrder() {
  const navigate = useNavigate();
  const { data: customers = [] } = useCustomers();
  const { data: products = [] } = useProducts();
  const createMutation = useCreateOrder();

  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [lineItems, setLineItems] = useState([]);

  const selectedCustomer = customers.find(c => (c.customer_id || c.id) === selectedCustomerId);
  const selectedProduct = products.find(p => (p.product_id || p.id) === selectedProductId);

  const handleAddItem = () => {
    if (!selectedProduct) return;
    const qty = parseInt(quantity, 10);
    
    if (isNaN(qty) || qty <= 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }
    
    if (qty > (selectedProduct.quantity_in_stock ?? selectedProduct.quantity)) {
      toast.error(`Only ${selectedProduct.quantity_in_stock ?? selectedProduct.quantity} items available in stock.`);
      return;
    }

    const existingItemIndex = lineItems.findIndex(i => i.product_id === (selectedProduct.product_id || selectedProduct.id));
    
    if (existingItemIndex >= 0) {
      const existingItem = lineItems[existingItemIndex];
      if (existingItem.quantity + qty > (selectedProduct.quantity_in_stock ?? selectedProduct.quantity)) {
        toast.error(`Cannot exceed total available stock (${selectedProduct.quantity_in_stock ?? selectedProduct.quantity}).`);
        return;
      }
      const newItems = [...lineItems];
      newItems[existingItemIndex].quantity += qty;
      setLineItems(newItems);
    } else {
      setLineItems([
        ...lineItems,
        {
          product_id: selectedProduct.product_id || selectedProduct.id,
          product_name: selectedProduct.name,
          price: selectedProduct.price,
          quantity: qty,
        }
      ]);
    }

    setSelectedProductId("");
    setQuantity("1");
  };

  const handleRemoveItem = (productId) => {
    setLineItems(lineItems.filter(item => item.product_id !== productId));
  };

  const total = lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    if (!selectedCustomerId || lineItems.length === 0) return;
    
    createMutation.mutate(
      {
        customer_id: selectedCustomerId,
        customer_name: selectedCustomer.full_name || selectedCustomer.name,
        items: lineItems.map(i => ({ product_id: i.product_id, quantity: i.quantity, price: i.price, product_name: i.product_name }))
      },
      {
        onSuccess: () => navigate("/orders")
      }
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate("/orders")} className="hover:bg-white/5">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create New Order</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card border-white/5">
            <CardHeader>
              <CardTitle>Step 1: Select Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                <SelectTrigger className="w-full md:max-w-md bg-white/5 border-white/10">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10">
                  {customers.map(c => (
                    <SelectItem key={c.customer_id || c.id} value={c.customer_id || c.id}>{c.full_name || c.name} ({c.email})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/5">
            <CardHeader>
              <CardTitle>Step 2: Add Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full space-y-2">
                  <label className="text-sm font-medium">Product</label>
                  <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                    <SelectTrigger className="w-full bg-white/5 border-white/10">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/10">
                      {products.map(p => (
                        <SelectItem key={p.product_id || p.id} value={p.product_id || p.id} disabled={(p.quantity_in_stock ?? p.quantity) === 0}>
                          {p.name} - ${Number(p.price).toFixed(2)} ({p.quantity_in_stock ?? p.quantity} in stock)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-32 space-y-2">
                  <label className="text-sm font-medium">Qty</label>
                  <Input 
                    type="number" 
                    min="1" 
                    value={quantity} 
                    onChange={e => setQuantity(e.target.value)}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <Button 
                  onClick={handleAddItem} 
                  disabled={!selectedProductId}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80 w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-semibold mb-3">Line Items</h3>
                <div className="rounded-xl border border-white/5 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/5 hover:bg-transparent">
                        <TableHead>Product Name</TableHead>
                        <TableHead className="text-center w-24">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lineItems.length === 0 ? (
                        <TableRow className="border-white/5 hover:bg-transparent">
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No items added yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        lineItems.map(item => (
                          <LineItemRow key={item.product_id} item={item} onRemove={handleRemoveItem} />
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="glass-card border-white/5 sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Customer</p>
                  <p className="font-medium text-foreground">{selectedCustomer ? (selectedCustomer.full_name || selectedCustomer.name) : "Not selected"}</p>
                </div>
                
                <Separator className="bg-white/5" />
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Items ({lineItems.length})</p>
                  {lineItems.map(item => (
                    <div key={item.product_id} className="flex justify-between text-sm">
                      <span className="truncate pr-2">{item.product_name} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator className="bg-white/5" />

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                </div>

                <Button 
                  className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90" 
                  size="lg"
                  disabled={!selectedCustomerId || lineItems.length === 0 || createMutation.isPending}
                  onClick={handlePlaceOrder}
                >
                  {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Place Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
