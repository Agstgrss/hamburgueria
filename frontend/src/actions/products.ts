"use server"

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Product } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function createProductAction(formData: FormData) {
    try {
        const token = await getToken();

        if (!token) {
            return { success: false, error: "Erro ao criar produto" };
        }

        const result = await apiClient<Product>("/product", {
            method: "POST",
            body: formData,
            token: token,
        });

        revalidatePath("/dashboard/products");

        return { success: true, error: "", data: result };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }

        return { success: false, error: "Erro ao criar produto" };
    }
}

export async function deleteProductAction(productId: string) {
    try {
        if(!productId){
            return { success: false, error: "Falha ao deletar produto" }
        }

        const token = await getToken();

        if (!token) {
            return { success: false, error: "Erro ao deletar produto" };
        }

        await apiClient(`/product?product_id=${productId}`, {
            method: "DELETE",
            token: token,
        });

        revalidatePath("/dashboard/products");

        return { success: true, error: "" };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }

        return { success: false, error: "Erro ao deletar produto" };
    }
}
