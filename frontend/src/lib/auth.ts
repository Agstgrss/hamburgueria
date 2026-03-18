"use server";

import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api'
import { User } from '@/lib/types'
import { redirect } from "next/navigation";

const COOKIE_NAME = "token_hamburgueria";

export async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME)?.value;
}

export async function setToken(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        sameSite: true,
        secure: process.env.NODE_ENV === "production",
    });
}

export async function removeToken() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

export async function getUser(): Promise<User | null> {
    try {
        const token = await getToken();

        if (!token) {
            return null;
        }

        const user = await apiClient<User>("/me", {
            token
        });

        return user ?? null;

    } catch (err) {
        console.log("Erro ao buscar usuário:", err);
        return null;
    }
}

export async function requiredAdmin(): Promise<User> {
    const user = await getUser();

    if (!user) {
        redirect("/login");
    }

    if (user.role !== "ADMIN") {
        redirect("/access-denied");
    }

    return user;
}