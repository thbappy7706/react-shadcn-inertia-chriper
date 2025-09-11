"use client";
import React from 'react';
import { ArrowDownUp, EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Column<T> {
    key: keyof T | string;
    header: string;
    className?: string;
    render?: (row: T) => React.ReactNode;
    sortable?: boolean;
}

interface ServerMeta {
    current_page?: number;
    per_page?: number;
    total?: number;
    links?: { url: string | null; label: string; active: boolean }[];
}

interface DataTableProps<T> {
    columns: Column<T>[];
    rows: T[];
    meta?: ServerMeta;
    onSort?: (key: string) => void;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    onEdit?: (row: T) => void;
    onView?: (row: T) => void;
    onDelete?: (row: T) => void;
    renderToolbar?: React.ReactNode;
    onPageLinkClick?: (url: string) => void;
    perPage?: string | number;
    onPerPageChange?: (perPage: string) => void;
}

export default function DataTable<T extends { id: number | string }>({ columns, rows, meta, onSort, sortBy, sortDirection, onEdit, onView, onDelete, renderToolbar, onPageLinkClick, perPage, onPerPageChange, }: DataTableProps<T>) {
    return (
        <div className="w-full">
            {renderToolbar}
            <div className="rounded-md border dark:border-slate-700 overflow-hidden border-gray-200 w-full">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-slate-900">
                        <tr>
                            {columns.map((col) => (
                                <th key={String(col.key)} className={`px-4 py-3 text-left font-medium text-gray-600 dark:text-[#abc2d3] ${col.className || ''}`}>
                                    <button
                                        type="button"
                                        className={`inline-flex items-center gap-1 ${col.sortable ? '' : 'cursor-default'}`}
                                        onClick={() => col.sortable && onSort?.(String(col.key))}
                                    >
                                        {col.header}
                                        {col.sortable && (
                                            <ArrowDownUp
                                                size={14}
                                                className={`ml-1 ${sortBy === col.key ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}
                                            />
                                        )}
                                    </button>
                                </th>
                            ))}
                            {(onEdit || onView || onDelete) && <th className="px-4 py-3" />}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-500 dark:text-slate-400">
                                    No records found
                                </td>
                            </tr>
                        )}
                        {rows.map((row) => (
                            <tr key={String(row.id)} className="border-t dark:border-slate-800">
                                {columns.map((col) => (
                                    <td key={String(col.key)} className={`px-4 py-3 ${col.className || ''}`}>
                                        {col.render ? col.render(row) : (row as any)[col.key as string]}
                                    </td>
                                ))}
                                {(onEdit || onView || onDelete) && (
                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" aria-label="Row actions">
                                                    <EllipsisVertical size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {onView && (
                                                    <DropdownMenuItem onClick={() => onView(row)}>View</DropdownMenuItem>
                                                )}
                                                {onEdit && (
                                                    <DropdownMenuItem onClick={() => onEdit(row)}>Edit</DropdownMenuItem>
                                                )}
                                                {onDelete && (
                                                    <DropdownMenuItem onClick={() => onDelete(row)} className="text-red-600 focus:text-red-600">
                                                        Delete
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {meta?.links && meta.links.length > 0 && (
                <div className="flex items-center justify-between mt-4">



                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-slate-400">
                          <span>
                            Showing {rows.length} of {meta.total ?? rows.length}
                          </span>
                        <select
                            className="h-8 ml-2 px-2 text-sm border border-gray-300 rounded-md dark:bg-slate-900 dark:border-slate-900 dark:text-[#abc2d3]"
                            value={String(perPage ?? '')}
                            onChange={(e) => onPerPageChange?.(e.target.value)}
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="-1">All</option>
                        </select>
                    </div>


                    <div className="flex flex-wrap gap-2 justify-center">
                        {meta.links.map((link, idx) => (
                            <button
                                key={idx}
                                type="button"
                                disabled={!link.url}
                                onClick={() => link.url && onPageLinkClick?.(link.url)}
                                className={`px-3 py-1 rounded border ${link.active ? 'bg-gray-200 dark:bg-slate-800' : ''} ${link.url ? 'cursor-pointer' : 'opacity-50 cursor-default'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>

                </div>
            )}
        </div>
    );
}


