"use client"

import { Trash2 } from "lucide-react"
import { deleteProductAction } from "@/actions/products"

interface DeleteButtonProps {
  productId: string
}

export function DeleteButtonProduct({ productId }: DeleteButtonProps) {
  async function action() {
    await deleteProductAction(productId)
  }

  return (
    <form action={action}>
      <button
        type="submit"
        className="p-2 hover:bg-red-500/20 rounded-md transition-colors"
        title="Deletar produto"
      >
        <Trash2 className="w-4 h-4 text-red-400" />
      </button>
    </form>
  )
}
