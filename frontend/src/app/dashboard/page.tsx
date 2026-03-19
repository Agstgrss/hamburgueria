import { Orders } from "@/components/dashboard/orders";
import { getToken } from "@/lib/auth";

export default async function Dashboard() {
    const token = await getToken();

    if (!token) {
    throw new Error("Token não encontrado");
}

return <Orders token={token} />;
}
