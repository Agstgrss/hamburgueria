import { requiredAdmin } from '@/lib/auth'
import { Sidebar } from '@/components/dashboard/sidebar';
import { MobileSidebar } from '@/components/dashboard/mobile-sidebar'

export default async function dashboardLayout({
    children
}: {
    children: React.ReactNode
}){
    const user = await requiredAdmin();

    return(
    <div className ="flex h-screen overflow-hidden text-white">
        {/* Sidebar Desktop*/}
        <Sidebar userName={user.name}/>

        <div className="flex flex-1 flex-col overflow-hidden">
            {/* HEADER MOBILE */}
            <MobileSidebar />
        
            <main className="flex-1 overflow-y-auto bg-app-background">
                <div className="containter max-w-full px-4 px-6">
                    {children}
                </div>
            </main>
        </div>

    </div>
    )
}