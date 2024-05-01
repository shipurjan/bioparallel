"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { InternalMarking } from "@/lib/stores/Markings";
import { t } from "i18next";

export type ExtendedMarking = InternalMarking & {
    x: number;
    y: number;
};

export type EmptyMarking = Record<string, never>;
export type EmptyableMarking = InternalMarking | EmptyMarking;

type EmptyableCellContext = CellContext<EmptyableMarking, unknown>;
type DataCellContext = CellContext<InternalMarking, unknown>;

export function isInternalMarking(
    cell: EmptyableMarking
): cell is InternalMarking {
    return "id" in cell;
}

export function isEmptyMarking(cell: EmptyableMarking): cell is EmptyMarking {
    return Object.keys(cell).length === 0 && cell.constructor === Object;
}

const formatCell = <T,>(
    context: EmptyableCellContext,
    callback: (context: DataCellContext) => T,
    lastRowEmptyValue: T | string = ""
) => {
    const row = context.row.original;

    if (isInternalMarking(row)) {
        return callback(context as DataCellContext);
    }

    if (isEmptyMarking(row)) {
        return "ㅤ";
    }

    if (lastRowEmptyValue === "") return lastRowEmptyValue;

    const isLastRow = context.row.index + 1 === context.table.getRowCount();
    return isLastRow ? lastRowEmptyValue : "";
};

export const getColumns: () => Array<ColumnDef<EmptyableMarking>> = () => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={value => {
                    const newValue = !!value;
                    table.toggleAllPageRowsSelected(newValue);
                }}
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={value => {
                    const newValue = !!value;
                    row.toggleSelected(newValue);
                }}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: t("Marking.Keys.id", { ns: "object" }),
        cell: cell => formatCell(cell, ({ row }) => row.original.id),
    },
    {
        accessorKey: "type",
        header: t("Marking.Keys.type.Name", { ns: "object" }),
        cell: cell =>
            formatCell(cell, ({ row }) => {
                const marking = row.original;

                return t(`Marking.Keys.type.Keys.${marking.type}`, {
                    ns: "object",
                });
            }),
    },
];
