import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PastePage({ params }: PageProps) {
    const { id } = await params;

    try {
        // 1. Increment views and fetch data in a single atomic transaction
        const paste = await prisma.paste.update({
            where: { id },
            data: {
                views: { increment: 1 }
            }
        });

        // 2. Expiration Logic
        const timeExpired = paste.expiresAt && new Date(paste.expiresAt) < new Date();
        const viewsExceeded = paste.maxViews && paste.views > paste.maxViews;

        if (timeExpired || viewsExceeded) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
                    <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <h1 className="text-2xl font-bold mb-4 text-red-500">
                            {viewsExceeded ? "View Limit Reached" : "Paste Expired"}
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                            This paste is no longer available because it has {viewsExceeded ? "reached its maximum view count" : "expired"}.
                        </p>
                        <Link href="/" className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                            Create a New Paste
                        </Link>
                    </div>
                </div>
            );
        }

        // 3. Render the Paste
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-8">
                <div className="max-w-4xl mx-auto">
                    <header className="flex justify-between items-center mb-8">
                        <Link href="/" className="text-2xl font-bold tracking-tight">
                            Pastebin
                        </Link>
                        <Link
                            href="/"
                            className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            New Paste
                        </Link>
                    </header>

                    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                        <div className="border-b border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-wrap justify-between items-center text-sm text-zinc-500 gap-4">
                            <div className="flex gap-4">
                                <span>ID: <span className="font-mono text-zinc-700 dark:text-zinc-300">{paste.id}</span></span>
                                <span>Created: {paste.createdAt.toLocaleDateString()}</span>
                                <span className="flex items-center gap-1">
                                    Views: <span className={viewsExceeded ? "text-red-500" : "text-zinc-700 dark:text-zinc-300"}>
                                        {paste.views}{paste.maxViews ? ` / ${paste.maxViews}` : ''}
                                    </span>
                                </span>
                            </div>
                            {paste.expiresAt && (
                                <span>Expires: {paste.expiresAt.toLocaleDateString()} {paste.expiresAt.toLocaleTimeString()}</span>
                            )}
                        </div>

                        <div className="p-0 overflow-x-auto">
                            <pre className="p-6 text-sm font-mono whitespace-pre-wrap break-all leading-relaxed">
                                <code>{paste.content}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        );

    } catch (error) {
        // If the ID doesn't exist, prisma.update throws an error
        console.error("Paste retrieval error:", error);
        notFound();
    }
}