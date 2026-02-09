'use client';

import { AlertCircle, Home, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logoutAction } from '@/actions/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';

export default function AccessDenied() {
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const user = await getUser();
            
            if (!user) {
                router.push('/login');
            }
        };

        checkUser();
    }, [router]);
    return (
        <div className="min-h-screen bg-app-background flex items-center justify-center px-4 text-white">
            <Card className="w-full max-w-md shadow-lg bg-app-card border border-app-border">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-500/10 p-3 rounded-full border border-red-500/20">
                            <AlertCircle className="h-8 w-8 text-red-400" />
                        </div>
                    </div>

                    <CardTitle className="text-2xl text-white">
                        Acesso Negado
                    </CardTitle>

                    <CardDescription className="text-gray-300 text-base">
                        Você não tem permissão para acessar esta área
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="bg-app-background border border-app-border rounded-lg p-4">
                        <p className="text-sm text-gray-300">
                            Apenas administradores podem acessar o painel de controle. Se você acredita que isso é um erro, entre em contato com o responsável do sistema.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs text-gray-400 font-semibold">
                            Próximos passos:
                        </p>
                        <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                            <li>Verifique sua conta</li>
                            <li>Contate o administrador</li>
                            <li>Retorne à página inicial</li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-2 pt-4">
                        <Link href="/" className="w-full">
                            <Button className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white">
                                <Home className="h-4 w-4 mr-2" />
                                Voltar para Home
                            </Button>
                        </Link>

                        <form action={logoutAction} className="w-full">
                            <Button
                                type="submit"
                                className="w-full border border-red-500/20 text-red-400 bg-transparent hover:bg-red-500/10 hover:border-red-500/40 transition-colors"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
