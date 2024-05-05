/* eslint-disable func-names */
/* eslint-disable security/detect-object-injection */
/* eslint-disable jsx-a11y/click-events-have-key-events */

"use client";

import {
    ColumnDef,
    Row,
    SortDirection,
    SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { HTMLAttributes, Ref, forwardRef, useEffect, useState } from "react";
import { TableVirtuoso, TableVirtuosoHandle } from "react-virtuoso";
import { cn } from "@/lib/utils/shadcn";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { MarkingsStore } from "@/lib/stores/Markings";
import { CANVAS_ID } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { EmptyableMarking, isInternalMarking } from "./columns";

// Original Table is wrapped with a <div> (see https://ui.shadcn.com/docs/components/table#radix-:r24:-content-manual),
// but here we don't want it, so let's use a new component with only <table> tag
const TableComponent = forwardRef<
    HTMLTableElement,
    HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
    <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm bg-card/10", className)}
        {...props}
    />
));
TableComponent.displayName = "TableComponent";

const TableRowComponent = <TData,>(rows: Row<TData>[], canvasId: CANVAS_ID) =>
    // eslint-disable-next-line sonarjs/cognitive-complexity
    function getTableRow(props: HTMLAttributes<HTMLTableRowElement>) {
        // eslint-disable-next-line no-void
        void { canvasId };
        // @ts-expect-error data-index is a valid attribute
        const index = props["data-index"];
        const row = rows[index];

        if (!row) return null;

        const marking = row.original as EmptyableMarking;
        const selected = isInternalMarking(marking) ? marking.selected : false;
        const cells = row.getVisibleCells();

        return (
            <TableRow
                key={row.id}
                className={cn("last:border-b-0")}
                data-state={selected && "selected"}
                onClick={e => {
                    e.stopPropagation();
                }}
                {...props}
            >
                {cells.map(cell => (
                    <TableCell key={cell.id}>
                        {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                        )}
                    </TableCell>
                ))}
            </TableRow>
        );
    };

function SortingIndicator({ isSorted }: { isSorted: SortDirection | false }) {
    if (!isSorted) return null;
    return (
        <div className="relative w-0 right-0">
            {
                {
                    asc: "↑",
                    desc: "↓",
                }[isSorted]
            }
        </div>
    );
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    height: string;
    canvasId: CANVAS_ID;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DataTable = forwardRef<TableVirtuosoHandle, any>(function <
    TData,
    TValue,
>(
    { columns, data, height, canvasId }: DataTableProps<TData, TValue>,
    ref: Ref<TableVirtuosoHandle> | undefined
) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            rowSelection,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
    });

    const { setTableRows } = MarkingsStore(canvasId).actions.table;

    const { rows } = table.getRowModel();

    useEffect(() => {
        setTableRows(
            rows.map(row => {
                const marking = row.original as EmptyableMarking;
                return {
                    id: row.id,
                    index: row.index,
                    marking: {
                        ...(marking.boundMarkingId && {
                            boundMarkingId: marking.boundMarkingId,
                        }),
                        ...(isInternalMarking(marking) && {
                            id: marking.id,
                        }),
                    },
                };
            })
        );
    }, [rows, setTableRows]);

    return (
        <>
            <div className="flex-1 text-center text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected
            </div>
            <TableVirtuoso
                ref={ref}
                followOutput
                style={{
                    height,
                    scrollbarGutter: "stable both-edges",
                }}
                totalCount={rows.length}
                components={{
                    Table: TableComponent,
                    TableRow: TableRowComponent(rows, canvasId),
                }}
                fixedHeaderContent={() =>
                    table.getHeaderGroups().map(headerGroup => (
                        <TableRow
                            className={cn("bg-card hover:bg-muted border-b-0")}
                            key={headerGroup.id}
                        >
                            {headerGroup.headers.map(header => {
                                return (
                                    <TableHead
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        style={{
                                            width: header.getSize(),
                                        }}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className="flex items-center"
                                                {...{
                                                    style: header.column.getCanSort()
                                                        ? {
                                                              cursor: "pointer",
                                                              userSelect:
                                                                  "none",
                                                          }
                                                        : {},
                                                    onClick:
                                                        header.column.getToggleSortingHandler(),
                                                }}
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                                <SortingIndicator
                                                    isSorted={header.column.getIsSorted()}
                                                />
                                            </div>
                                        )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))
                }
            />
        </>
    );
});
