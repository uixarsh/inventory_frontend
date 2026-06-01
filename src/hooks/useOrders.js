import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOrders,
  createOrder,
  deleteOrder,
} from "../services/orderService";
import { toast } from "sonner";

export const useOrders = () =>
  useQuery({ queryKey: ["orders"], queryFn: getOrders });

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      // Invalidate products as stock might have changed
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Order created successfully");
    },
    onError: (err) => toast.error(err.message),
  });
};

export const useDeleteOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order deleted successfully");
    },
    onError: (err) => toast.error(err.message),
  });
};
