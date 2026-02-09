"use client"

import { useState } from 'react'

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
import { createCategoryAction } from '@/actions/categories'
import { useRouter } from 'next/navigation'


export function CategoryForm(){
    const [open, setOpen] = useState(false);
    const router = useRouter();

    async function handleCreateCategory(formData: FormData): Promise<void> {
        const result = await createCategoryAction(formData)
        console.log(result)

        if(result.success){
            setOpen(false);
            router.refresh()
            return;
        }else {
            console.log(result.error);
        }
    }

    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-brand-primary hover:bg-brand-primary font-semibold">
                    <Plus className='h-5 w-5 mr-2'/>
                        Nova categoria
                </Button>
            </DialogTrigger>
            <DialogContent  className="p-6 bg-app-card text-white">
                <DialogHeader>
                    <DialogTitle>Criar nova categoria</DialogTitle>
                    <DialogDescription>Criando nova categorias...</DialogDescription>
                </DialogHeader>

                    <form className="space-y-4" action={handleCreateCategory}>
                        <div>
                            <Label htmlFor="category" className="mb-2"> Nome da categoria</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                placeholder='Digite o nome da categoria...'
                                className="border=app=boprder bfg-app-background text-white"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-brand-primary text-white hover:bg-brand-primary"
                        >
                            Criar categoria
                        </button>
                    </form>
            </DialogContent>
        </Dialog>
    )
}