import React, { useEffect, useMemo, useRef, useState } from "react";
import {ArrowDownUp, ChevronLeft, ChevronRight, EllipsisVertical, Edit, Trash2, Eye, ChevronDown} from "lucide-react";

// Types
interface UserData {
    id: number;
    name: string;
    email: string;
    role: "Admin" | "Editor" | "User";
    status: "Active" | "Inactive";
}

type SortDirection = "asc" | "desc";
interface SortConfig {
    key: keyof UserData | null;
    direction: SortDirection;
}

const Table: React.FC = () => {
    const initialData: UserData[] = Array.from({ length: 35 }, (_, index) => ({
        id: index + 1,
        name: `User ${index + 1}`,
        email: `user${index + 1}@example.com`,
        role: index % 3 === 0 ? "Admin" : index % 2 === 0 ? "Editor" : "User",
        status: index % 2 === 0 ? "Active" : "Inactive",
    }));

    const [data] = useState<UserData[]>(initialData);
    const [search, setSearch] = useState<string>("");
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: null,
        direction: "asc",
    });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null);

    const selectRef = useRef<HTMLDivElement>(null);

    const toggleActionMenu = (id: number): void => {
        setOpenActionMenuId(openActionMenuId === id ? null : id);
    };

    // Search
    const filteredData = useMemo(() => {
        return data.filter((item) =>
            Object.values(item).some((value) =>
                value.toString().toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [data, search]);

    // Sort
    const handleSort = (key: keyof UserData): void => {
        let direction: SortDirection = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;

        return [...filteredData].sort((a, b) => {
            const key = sortConfig.key as keyof UserData;
            if (a[key] < b[key]) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    }, [filteredData, sortConfig]);

    // Pagination
    const totalPages = Math.ceil(sortedData.length / pageSize);

    const paginatedData = sortedData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handlePageChange = (page: number): void => {
        setCurrentPage(Math.min(Math.max(1, page), totalPages));
    };

    const handleOptionClick = (value: number): void => {
        setPageSize(value);
        setCurrentPage(1);
        setIsOpen(false);
    };

    const handleToggle = (): void => setIsOpen((prev) => !prev);

    // Close action menu on outside click
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent): void => {
            if (
                selectRef.current &&
                !selectRef.current.contains(event.target as Node)
            ) {
                setOpenActionMenuId(null);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    return (
        <div className="customTable overflow-y-auto p-8 mb-4 flex items-center flex-col gap-5 justify-center">
            <div className="w-full mx-auto p-4">
                {/* Search */}
                <div className="mb-4 flex items-center justify-between">
                    <input
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm dark:bg-slate-900 dark:border-slate-700 dark:text-[#abc2d3] dark:placeholder:text-slate-500 py-2.5 px-4 border border-gray-200 rounded-md outline-none focus:border-blue-300"
                    />
                </div>

                {/* Table */}
                <div className="rounded-md border dark:border-slate-700 overflow-hidden border-gray-200 w-full">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-slate-900">
                        <tr>
                            {Object.keys(initialData[0]).map(
                                (key) =>
                                    key !== "id" && (
                                        <th
                                            key={key}
                                            className="p-3 text-left font-medium dark:text-[#abc2d3] text-gray-700 cursor-pointer"
                                        >
                                            <div className="flex items-center gap-[5px]">
                                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                                <ArrowDownUp
                                                    onClick={() => handleSort(key as keyof UserData)}
                                                    className="hover:bg-gray-200 dark:hover:bg-slate-800 p-[5px] rounded-md text-[1.6rem]"
                                                />
                                            </div>
                                        </th>
                                    )
                            )}
                            <th className="p-3 text-left dark:text-[#abc2d3] font-medium text-gray-700">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedData.map((item, index) => (
                            <tr
                                key={item.id}
                                className="border-t border-gray-200 dark:border-slate-700 dark:hover:bg-slate-900 hover:bg-gray-50"
                            >
                                {Object.entries(item).map(
                                    ([key, value]) =>
                                        key !== "id" && (
                                            <td key={key} className="p-3 dark:text-[#abc2d3]">
                                                {value}
                                            </td>
                                        )
                                )}
                                <td className="p-3 relative">
                                    <EllipsisVertical
                                        onClick={() => toggleActionMenu(item.id)}
                                        className="action-btn dark:text-[#abc2d3] text-gray-600 cursor-pointer"
                                    />

                                    <div
                                        className={`${
                                            openActionMenuId === item.id
                                                ? "opacity-100 scale-[1] z-30"
                                                : "opacity-0 scale-[0.8] z-[-1]"
                                        }
                      ${index > 2 ? "bottom-[90%]" : "top-[90%]"}
                      absolute right-[80%] p-1.5 rounded-md bg-white shadow-md min-w-[160px] dark:bg-slate-800 transition-all duration-100`}
                                    >
                                        <p className="flex items-center gap-[8px] dark:text-[#abc2d3] dark:hover:bg-slate-900/50 text-[0.9rem] py-1.5 px-2 w-full rounded-md text-gray-700 cursor-pointer hover:bg-gray-50 transition-all duration-200">
                                            <Edit />
                                            Edit
                                        </p>
                                        <p className="flex items-center gap-[8px] dark:text-[#abc2d3] dark:hover:bg-slate-900/50 text-[0.9rem] py-1.5 px-2 w-full rounded-md text-gray-700 cursor-pointer hover:bg-gray-50 transition-all duration-200">
                                            <Trash2 />
                                            Delete
                                        </p>
                                        <p className="flex items-center gap-[8px] dark:text-[#abc2d3] dark:hover:bg-slate-900/50 text-[0.9rem] py-1.5 px-2 w-full rounded-md text-gray-700 cursor-pointer hover:bg-gray-50 transition-all duration-200">
                                            <Eye />
                                            View Details
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {!paginatedData.length && (
                        <p className="text-[0.9rem] text-gray-500 py-6 text-center w-full">
                            No data found!
                        </p>
                    )}
                </div>

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-[5px]">
                        <div className="text-sm dark:text-[#abc2d3] text-gray-500">
                            Showing {(currentPage - 1) * pageSize + 1} to{" "}
                            {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
                            {sortedData.length} results
                        </div>

                        {/* Page Size Select */}
                        <div ref={selectRef} className="relative w-44">
                            <button
                                onClick={handleToggle}
                                className="w-max px-2 py-0.5 text-left bg-white border dark:bg-slate-900 dark:border-slate-700 dark:text-[#abc2d3] dark:hover:border-slate-700 border-gray-300 rounded shadow-sm flex items-center justify-between gap-[10px] hover:border-gray-400 focus:outline-none"
                            >
                                {pageSize}
                                <ChevronDown
                                    className={`${
                                        isOpen ? "rotate-[180deg]" : "rotate-0"
                                    } transition-all duration-200`}
                                />
                            </button>
                            {isOpen && (
                                <div className="absolute dark:bg-slate-800 dark:border-slate-700 dark:text-[#abc2d3] overflow-hidden w-max mt-1 bg-white border border-gray-300 rounded shadow-lg">
                                    {[5, 10, 20, 50].map((size) => (
                                        <div
                                            key={size}
                                            className="px-4 py-2 cursor-pointer dark:hover:bg-slate-900/50 hover:bg-gray-100"
                                            onClick={() => handleOptionClick(size)}
                                        >
                                            {size}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="border border-gray-200 dark:text-[#abc2d3] dark:border-slate-700 dark:hover:bg-slate-900 hover:bg-gray-50 cursor-pointer px-[10px] text-[0.9rem] py-[5px] rounded-md disabled:opacity-50"
                        >
                            <ChevronLeft />
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum: number;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`${
                                            pageNum === currentPage &&
                                            "bg-black dark:bg-slate-800 text-white"
                                        } border border-gray-200 dark:text-[#abc2d3] dark:border-slate-700 dark:hover:bg-slate-900 px-[10px] text-[0.9rem] py-[1px] rounded-md`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="border border-gray-200 dark:text-[#abc2d3] dark:border-slate-700 dark:hover:bg-slate-900 px-[10px] cursor-pointer hover:bg-gray-50 text-[0.9rem] py-[5px] rounded-md disabled:opacity-50"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Table;
