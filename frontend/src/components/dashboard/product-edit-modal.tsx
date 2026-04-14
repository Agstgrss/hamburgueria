"use client"

import { useState, useEffect } from 'react'
import { Product, Category } from '@/lib/types'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { updateProductAction } from '@/actions/products'
import { useRouter } from 'next/navigation'
import { Upload, X } from 'lucide-react'
import Image from "next/image"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface ProductEditModalProps {
    product: Product | null;
    categories: Category[];
    onClose: () => void;
}

export function ProductEditModal({ product, categories, onClose }: ProductEditModalProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [priceValue, setPriceValue] = useState(product ? `${product.price / 100}` : "")
    const [imagePreview, setImagePreview] = useState<string | null>(product?.banner || null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: product?.name || "",
        description: product?.description || "",
        category_id: product?.category_id || ""
    })

    useEffect(() => {
        if (product) {
            setOpen(true);
            setFormData({
                name: product.name,
                description: product.description,
                category_id: product.category_id
            });
            setPriceValue(`${product.price / 100}`);
            setImagePreview(product.banner);
        }
    }, [product]);

    function convertBRLToCents(value: string): number {
        const cleanValue = value
            .replace(/[R$\s]/g, "")
            .replace(/\./g, "")
            .replace(",", ".")

        const reais = parseFloat(cleanValue) || 0;
        return Math.round(reais * 100)
    }

    async function handleUpdateProduct(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        if (!formData.name || !formData.description || !formData.category_id) {
            setErrorMessage("Todos os campos são obrigatórios");
            setLoading(false);
            return;
        }

        const form = new FormData();
        form.append("name", formData.name);
        form.append("description", formData.description);
        form.append("category_id", formData.category_id);

        if (priceValue) {
            const priceInCents = convertBRLToCents(priceValue);
            form.append("price", priceInCents.toString());
        }

        if (imageFile) {
            form.append("file", imageFile);
        }

        setErrorMessage(null);
        if (!product?.id) {
            setErrorMessage("Erro ao editar produto");
            setLoading(false);
            return;
        }

        const result = await updateProductAction(form, product.id);

        if (result.success) {
            setOpen(false);
            setImagePreview(null);
            setImageFile(null);
            setPriceValue("");
            setFormData({ name: "", description: "", category_id: "" });
            router.refresh();
        } else {
            setErrorMessage(result.error);
        }

        setLoading(false);
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        setErrorMessage(null);

        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage("A imagem deve ter no máximo 5MB");
            return;
        }

        setImageFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };

        reader.readAsDataURL(file);
    }

    function formatToBrl(value: string) {
        const numbers = value.replace(/\D/g, "")

        if (!numbers) return "";

        const amount = parseInt(numbers) / 100;

        return amount.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

    }

    function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
        const formatted = formatToBrl(e.target.value)
        setPriceValue(formatted);
    }

    function handleClose() {
        setOpen(false);
        onClose();
        setFormData({ name: "", description: "", category_id: "" });
        setImagePreview(null);
        setImageFile(null);
        setPriceValue("");
        setErrorMessage(null);
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="p-6 bg-app-card text-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editar Produto</DialogTitle>
                    <DialogDescription>Atualizando informações do produto...</DialogDescription>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleUpdateProduct}>
                    <div>
                        <Label htmlFor="name" className="mb-2">Nome do produto</Label>
                        <Input
                            type="text"
                            id="name"
                            placeholder="Nome do produto"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="text-white bg-app-card border border-app-border"
                        />
                    </div>

                    <div>
                        <Label htmlFor="description" className="mb-2">Descrição</Label>
                        <textarea
                            id="description"
                            placeholder="Descrição do produto"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            className="text-white bg-app-card border border-app-border rounded px-3 py-2 w-full"
                            rows={4}
                        />
                    </div>

                    <div>
                        <Label htmlFor="category" className="mb-2">Categoria</Label>
                        <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                            <SelectTrigger className="text-white bg-app-card border border-app-border">
                                <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent className="bg-app-card border border-app-border text-white">
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id} className="bg-app-card">
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="price" className="mb-2">Preço</Label>
                        <Input
                            type="text"
                            id="price"
                            placeholder="R$ 0,00"
                            value={priceValue}
                            onChange={handlePriceChange}
                            required
                            className="text-white bg-app-card border border-app-border"
                        />
                    </div>

                    <div>
                        <Label htmlFor="image" className="mb-2">Imagem do produto</Label>
                        <label htmlFor="image" className="text-sm text-gray-400 cursor-pointer">
                            {imagePreview ? (
                                <div className="relative w-full h-40 rounded-lg overflow-hidden">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview(null);
                                            setImageFile(null);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 p-1 rounded-full"
                                    >
                                        <X className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-app-border rounded-lg p-6 text-center hover:border-brand-primary transition-colors">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-400">Clique ou arraste para enviar uma imagem</p>
                                </div>
                            )}
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {errorMessage && (
                        <div className="p-3 bg-red-500/20 border border-red-500 rounded text-red-300 text-sm">
                            {errorMessage}
                        </div>
                    )}

                    <div className="flex gap-3 justify-end">
                        <DialogClose asChild>
                            <Button variant="outline" className="border-app-border bg-transparent text-white hover:bg-app-card">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading} className="bg-brand-primary hover:bg-brand-primary/90 text-white">
                            {loading ? "Atualizando..." : "Atualizar Produto"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
