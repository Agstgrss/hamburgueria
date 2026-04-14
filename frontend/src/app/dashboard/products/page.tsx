import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api"
import { getToken } from "@/lib/auth"
import { Category, Product } from "@/lib/types";
import { PackageOpen, Trash2, Edit } from 'lucide-react'
import { ProductForm } from '@/components/dashboard/product-form'
import { deleteProductAction } from '@/actions/products'
import {DeleteButtonProduct} from "@/components/dashboard/delete-button"
import { ProductsClient } from "./products-client"


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
                <ProductsClient products={products} categories={categories} />
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
