"use client"

import { apiClient } from "@/lib/api";
import { useEffect, useState } from "react";
import { Order } from "@/lib/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { finishOrderAction } from "@/actions/orders";
import { useRouter } from "next/navigation";

interface OrderModalProps {
    orderId: string | null;
    onClose: () => Promise<void>;
    token: string;
}

export function OrderModal({ onClose, orderId, token }: OrderModalProps) {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fetchOrders = async () => {
        if (!orderId) {
            setOrder(null);
            return;
        }

        try {
            setLoading(true);

            const response = await apiClient<Order>(
                `/order/detail?order_id=${orderId}`,
                {
                    method: "GET",
                    token: token,
                }
            );

            setOrder(response);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [orderId]);

    const handleCloseDialog = async () => {
        setOrder(null);
        await onClose();
    };

    const calculateTotal = () => {
        if (!order?.items) return 0;
        return order.items.reduce((total, item) => {
            return total + item.product.price * item.amount;
        }, 0);
    };

    const calculateTotalItems = () => {
        if (!order?.items) return 0;
        return order.items.reduce((total, item) => total + item.amount, 0);
    };

    const handleFinishOrder = async () => {
        if (!orderId) return;

        const result = await finishOrderAction(orderId);

        if (!result.success) {
            console.log(result.error);
        }

        if (result.success) {
            router.refresh();
            onClose();
        }
    };

    return (
        <Dialog open={order !== null} onOpenChange={handleCloseDialog}>
            <DialogContent className="max-w-2xl bg-app-background border border-app-border text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        Detalhes do Pedido
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-gray-300">Carregando...</p>
                    </div>
                ) : order ? (
                    <div className="space-y-6">

                        {/* Informações da Ordem */}
                        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-app-border">
                            <div>
                                <p className="text-sm text-gray-400">Mesa</p>
                                <p className="text-lg font-semibold text-white">
                                    Mesa {order.table}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Cliente</p>
                                <p className="text-lg font-semibold text-white">
                                    {order.name || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Status</p>
                                <p className="text-lg font-semibold text-white">
                                    Produção
                                </p>
                            </div>
                        </div>

                        {/* Itens */}
                        <div>
                            <h3 className="font-semibold mb-4 text-white">
                                Itens do Pedido
                            </h3>

                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {order.items && order.items.length > 0 ? (
                                    order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between items-center p-3 bg-app-card border border-app-border rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium text-white">
                                                    {item.product.name}
                                                </p>
                                                <p className="text-sm text-gray-300">
                                                    Quantidade: {item.amount}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-white">
                                                    R$ {(item.product.price * item.amount).toFixed(2)}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    R$ {item.product.price.toFixed(2)} un.
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400">Nenhum item</p>
                                )}
                            </div>
                        </div>

                        {/* Resumo */}
                        <div className="pt-4 border-t border-app-border space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Total de Itens:</span>
                                <span className="font-semibold text-white">
                                    {calculateTotalItems()} un.
                                </span>
                            </div>
                            <div className="flex justify-between text-lg font-bold">
                                <span className="text-white">Total:</span>
                                <span className="text-white">
                                    R$ {calculateTotal().toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : null}

                <DialogFooter className="flex gap-3 sm:gap-3">
                    <Button
                        variant="outline"
                        onClick={handleCloseDialog}
                        className="flex-1 border-app-border bg-transparent text-white hover:bg-app-card"
                    >
                        Fechar
                    </Button>
                    <Button
                        className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold"
                        disabled={loading}
                        onClick={handleFinishOrder}
                    >
                        Finalizar Pedido
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
