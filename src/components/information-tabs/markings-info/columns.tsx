"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { InternalMarking } from "@/lib/stores/Markings";
import { t } from "i18next";

export type ExtendedMarking = InternalMarking & {
    x: number;
    y: number;
};

export const getColumns: () => ColumnDef<ExtendedMarking>[] = () => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={value =>
                    table.toggleAllPageRowsSelected(!!value)
                }
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={value => row.toggleSelected(!!value)}
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "label",
        header: t("Marking.Keys.label", { ns: "object" }),
    },
    {
        accessorKey: "type",
        header: t("Marking.Keys.type.Name", { ns: "object" }),
        cell: ({ row }) => {
            const marking = row.original;
            return t(`Marking.Keys.type.Keys.${marking.type}`, {
                ns: "object",
            });
        },
    },
];
