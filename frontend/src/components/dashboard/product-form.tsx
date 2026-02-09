"use client"

import { useState } from 'react'
import { Category } from '@/lib/types'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { createProductAction } from '@/actions/products'
import { useRouter } from 'next/navigation'
import { Upload } from 'lucide-react'
import Image from "next/image";

interface ProductFormProps {
    categories: Category[];
}

export function ProductForm({ categories }: ProductFormProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [priceValue, setPriceValue] = useState("")
    const [imagePreview, setImagePreview] = useState<string|null>(null)
    const [imageFile, setImageFile] = useState<File|null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

        function convertBRLToCents(value: string): number {
            const cleanValue = value
                .replace(/[R$\s]/g, "")
                .replace(/\./g, "")
                .replace(",", ".")

            const reais = parseFloat(cleanValue) || 0;
            return Math.round(reais * 100)
        }

    async function handleCreateProduct(formData: FormData) {
        setLoading(true);

        if (!imageFile) {
            setErrorMessage("Você precisa selecionar uma imagem do produto.");
            setLoading(false);
            return;
        }

        const priceInCents = convertBRLToCents(priceValue);

        formData.set("price", priceInCents.toString());
        formData.set("file", imageFile);

        setErrorMessage(null);
        const result = await createProductAction(formData);

        if (result.success) {
            setOpen(false);
            setImagePreview(null);
            setImageFile(null);
            setPriceValue("");
            router.refresh();
        } else {
            alert(result.error);
        }

        setLoading(false);
    }


    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        setErrorMessage(null);

        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("A imagem deve ter no máximo 5MB");
            return;
        }

        setImageFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };

        reader.readAsDataURL(file);
    }


    function formatToBrl(value: string){
        const numbers = value.replace(/\D/g, "")

        if(!numbers) return "";

        const amount = parseInt(numbers) / 100;

        return amount.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

    }

    function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>){
        const formatted = formatToBrl(e.target.value)
        setPriceValue(formatted);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-brand-primary hover:bg-brand-primary font-semibold">
                    <Plus className='h-5 w-5 mr-2' />
                    Novo produto
                </Button>
            </DialogTrigger>
            <DialogContent className="p-6 bg-app-card text-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Criar novo produto</DialogTitle>
                    <DialogDescription>Criando novo produto...</DialogDescription>
                </DialogHeader>

                <form className="space-y-4" action={handleCreateProduct}>
                    <div>
                        <Label htmlFor="name" className="mb-2">Nome do produto</Label>
                        <Input
                            id="name"
                            name="name"
                            required
                            placeholder='Digite o nome do produto...'
                            className="border-app-border bg-app-background text-white"
                        />
                    </div>

                    <div>
                        <Label htmlFor="description" className="mb-2">Descrição</Label>
                        <textarea
                            id="description"
                            name="description"
                            required
                            placeholder='Digite a descrição do produto...'
                            className="w-full px-3 py-2 bg-app-background border border-app-border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="price" className="mb-2">Preço (em centavos)</Label>
                            <Input
                                id="price"
                                name="price"
                                required
                                placeholder='Ex: 25,00'
                                className="border-app-border bg-app-background text-white"
                                value={priceValue}
                                onChange={handlePriceChange}
                            />
                        </div>

                        <div>
                            <Label htmlFor="category_id" className="mb-2">Categoria</Label>
                            <select
                                id="category_id"
                                name="category_id"
                                required
                                className="w-full px-3 py-2 bg-app-background border border-app-border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            >
                                <option value="">Selecione uma categoria</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file" className="mb-2">
                            Imagem do produto
                        </Label>
                        {imagePreview ? (
                            <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                                <Image 
                                    src={imagePreview}
                                    alt="preview da imagem"
                                    fill
                                    className="object-cover"
                                />

                                <button
                                type="button"
                                // variant="destructive"
                                onClick={() => setImagePreview(null)}
                                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded"
                                >
                                Excluir
                                </button>
                            </div>
                        )   :(
                                <label
                                    htmlFor="file"
                                    className="border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary hover:bg-white/5 transition-colors"
                                    >
                                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-300">
                                        Clique para selecionar uma imagem
                                    </span>

                                    <Input
                                        id="file"
                                        name="file"
                                        type="file"
                                        accept="image/jpeg, image/jpg, image/png"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>

                        )}
                    </div>

                    {errorMessage && (
                        <div className="bg-red-500/10 border border-red-500 text-red-400 text-sm px-3 py-2 rounded-md">
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-primary text-white hover:bg-brand-primary disabled:opacity-50 disabled:cursor-not-allowed py-2 rounded-md font-semibold"
                    >
                        {loading ? "Criando..." : "Criar produto"}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
