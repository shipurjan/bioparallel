/* eslint-disable no-underscore-dangle */
/* eslint-disable security/detect-object-injection */
import { Fragment, HTMLAttributes } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableRow,
} from "@/components/ui/table";
import { useGlobalCanvasRef } from "@/refs/pixi";
import { useCanvasContext } from "@/hooks/useCanvasContext";
import { useThrottledUpdate } from "@/hooks/useThrottledUpdate";
import { cn } from "@/lib/utils";

export type TableKeys = {
    keys: string[];
    values: string[];
}[];

function getNestedValue(obj: unknown, keys: string[]): string | number {
    const value = keys.reduce(
        // eslint-disable-next-line security/detect-object-injection
        // @ts-expect-error keys are always strings
        (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
        obj
    ) as string | number;

    if (typeof value === "number") {
        return +value.toFixed(3);
    }

    return value;
}

function getPrimitiveValues(obj: unknown | undefined): string[] {
    if (obj === undefined) return [];
    return Object.keys(obj as Record<string, unknown>).filter(e =>
        ["string", "number", "boolean"].includes(
            typeof (obj as Record<string, unknown>)[e]
        )
    );
}

export const DebugInfoTables = (
    obj: unknown,
    tableKeys: TableKeys,
    name: string,
    className: string
) =>
    tableKeys.map(({ keys, values }) => (
        <Fragment key={keys.join(".")}>
            <Table className="caption-top w-fit max-w-16 overflow-hidden">
                <TableCaption
                    className={cn("mt-8 text-xl font-bold", className)}
                >
                    {`${name}.${keys.join(".")}`}
                </TableCaption>
                <TableBody className="">
                    {values.length === 0 ? (
                        <TableRow className="flex">
                            <TableCell className="grow font-semibold text-right">
                                {keys[keys.length - 1]}
                            </TableCell>
                            <TableCell className="grow">
                                {JSON.stringify(getNestedValue(obj, keys))}
                            </TableCell>
                        </TableRow>
                    ) : (
                        values.map(value => (
                            <TableRow key={value} className="flex">
                                <TableCell className=" grow font-semibold text-right">
                                    {value}
                                </TableCell>
                                <TableCell className="grow">
                                    {JSON.stringify(
                                        getNestedValue(obj, [...keys, value])
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </Fragment>
    ));

export type DebugInfoProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;
export function DebugInfo({ ...props }: DebugInfoProps) {
    const { id } = useCanvasContext();
    const globalCanvasRef = useGlobalCanvasRef(id);
    const { app, viewport } = globalCanvasRef;

    // Odśwież informacje o canvasie co 100ms
    useThrottledUpdate(100);

    const OOB = viewport?.OOB();

    const appKeys: TableKeys = [
        {
            keys: ["stage"],
            values: getPrimitiveValues(app?.stage),
        },
        {
            keys: ["stage", "_bounds"],
            values: getPrimitiveValues(app?.stage._bounds),
        },
        {
            keys: ["renderer", "options"],
            values: getPrimitiveValues(app?.renderer.options),
        },
        {
            keys: ["ticker"],
            values: getPrimitiveValues(app?.ticker),
        },
    ];

    const viewportKeys: TableKeys = [
        {
            keys: [],
            values: getPrimitiveValues(viewport),
        },
        {
            keys: ["_bounds"],
            values: getPrimitiveValues(viewport?._bounds),
        },
    ];

    const OOBKeys: TableKeys = [
        {
            keys: [],
            values: getPrimitiveValues(OOB),
        },
        {
            keys: ["cornerPoint"],
            values: getPrimitiveValues(OOB?.cornerPoint),
        },
    ];

    return (
        <div
            className="w-full h-full flex flex-wrap items-start gap-3 px-16"
            {...props}
        >
            {app && DebugInfoTables(app, appKeys, "app", "text-red-400")}
            <div className="basis-full" />
            {OOB &&
                DebugInfoTables(
                    OOB,
                    OOBKeys,
                    "viewport.OOB()",
                    "text-emerald-400"
                )}
            {viewport &&
                DebugInfoTables(
                    viewport,
                    viewportKeys,
                    "viewport",
                    "text-sky-400"
                )}
        </div>
    );
}
