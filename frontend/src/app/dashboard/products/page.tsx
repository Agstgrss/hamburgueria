import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api"
import { getToken } from "@/lib/auth"
import { Category, Product } from "@/lib/types";
import { PackageOpen, Trash2 } from 'lucide-react'
import { ProductForm } from '@/components/dashboard/product-form'
import { deleteProductAction } from '@/actions/products'
import {DeleteButtonProduct} from "@/components/dashboard/delete-button"


export default async function Products() {
    const token = await getToken();

    const categories = await apiClient<Category[]>("/category", {
        token: token!,
    });

    const products = await apiClient<Product[]>("/products", {
        token: token!,
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("pt-br",{
            style: "currency",
            currency: "BRL",
        }).format(price/100)
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                        Produtos
                    </h1>
                    <p className="text-sm sm:text-base mt-1">Gerencie seus produtos</p>
                </div>

                <ProductForm categories={categories} />
            </div>

            {products.length !== 0 && (
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
                                        <DeleteButtonProduct productId={product.id}/>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {products.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                    <PackageOpen className="w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Nenhum produto cadastrado</h3>
                    <p className="text-gray-400">Comece criando seu primeiro produto</p>
                </div>
            )}
        </div>
    )
}
