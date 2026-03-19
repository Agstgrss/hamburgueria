import { Orders } from "@/components/dashboard/orders";
import { getToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
    const token = await getToken();

    if (!token) {
        redirect("/login");
    }

    return <Orders token={token} />;
}