"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

/**
 * Type definition for a user row.  You can expand this interface to
 * include any additional fields you intend to display in the table.  The
 * keys here must correspond to database column names so that sorting works.
 */
export type UserRow = {
    id: number;
    name: string;
    email: string;
    created_at: string;
};

/**
 * Column definitions for the users table.  Each column defines its
 * `accessorKey` which must match a key on the UserRow type.  The header
 * function uses a Button from shadcn/ui with an ArrowUpDown icon to
 * indicate that the column is sortable.  The `toggleSorting` call
 * automatically updates the sort state inside the DataTable and triggers
 * the `onSort` callback defined on the parent page.
 */
export const columns: ColumnDef<UserRow>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                ID
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => row.getValue("id"),
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => row.getValue("name"),
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => row.getValue("email"),
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Joined
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const value = row.getValue("created_at") as string;
            return new Date(value).toLocaleDateString();
        },
    },
];
