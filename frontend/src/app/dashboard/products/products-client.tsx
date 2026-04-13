"use client"

import { useState } from 'react'
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Product, Category } from "@/lib/types";
import { Trash2, Edit } from 'lucide-react'
import { DeleteButtonProduct } from "@/components/dashboard/delete-button"
import { ProductEditModal } from "@/components/dashboard/product-edit-modal"
import { Button } from '@/components/ui/button'

interface ProductsClientProps {
    products: Product[];
    categories: Category[];
}

export function ProductsClient({ products, categories }: ProductsClientProps) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                    <Card
                        key={product.id}
                        className={`bg-app-card border-app-border transition-all hover:shadow-md text-white ${product.disabled ? 'opacity-60' : ''}`}
                    >
                        {product.banner && (
                            <div className="w-full h-40 overflow-hidden rounded-t-lg">
                                <img
                                    src={product.banner}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <CardHeader>
                            <CardTitle className="gap-2 flex items-start justify-between md:text-lg">
                                <div className="flex flex-row -gap-2 items-center">
                                    <span>{product.name}</span>
                                </div>
                        
                            </CardTitle>
                            <div className="text-sm text-gray-300 mt-1">
                                R$ {(product.price / 100).toFixed(2)}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            <p className="text-gray-300 text-sm">
                                {product.description}
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-app-border">
                                <span className={`text-xs font-semibold ${product.disabled ? 'text-red-400' : 'text-green-400'}`}>
                                    {product.disabled ? 'Desabilitado' : 'Ativo'}
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-app-border bg-transparent text-brand-primary hover:bg-brand-primary hover:text-white"
                                        onClick={() => setSelectedProduct(product)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <DeleteButtonProduct productId={product.id}/>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <ProductEditModal
                product={selectedProduct}
                categories={categories}
                onClose={() => setSelectedProduct(null)}
            />
        </>
    );
}
