"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Client = () => {
    const trpc = useTRPC();
    const { data: users } = useSuspenseQuery(trpc.users.getUsers.queryOptions());

    return (
        <div>
            <h2>Client component</h2>
            {Array.isArray(users) && users.length > 0 ? (
                <div>
                    <p>Found {users.length} user(s):</p>
                    <ul>
                        {users.map((u: any) => (
                            <li key={u.id}>{u.email ?? u.name ?? u.id}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>
                    <p>No users found (received empty array).</p>
                    <p>
                        To see users here you can add records to the database (Prisma
                        Studio) or sign up via <a href="/signup">/signup</a>.
                    </p>
                </div>
            )}
        </div>
    );
};