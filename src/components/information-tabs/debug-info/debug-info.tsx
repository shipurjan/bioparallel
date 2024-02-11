import { HTMLAttributes } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableRow,
} from "@/components/ui/table";
import { useCanvasContext } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { cn } from "@/lib/utils/shadcn";
import { useCanvas } from "@/components/pixi/canvas/hooks/useCanvas";
import { useThrottledCanvasUpdater } from "@/components/pixi/canvas/hooks/useCanvasUpdater";

export type TableKeys = {
    keys: string[];
    values: string[];
}[];

function getNestedValue(obj: unknown, keys: string[]): string | number {
    const value = keys.reduce(
        // eslint-disable-next-line security/detect-object-injection
        // @ts-expect-error keys are always strings
        // eslint-disable-next-line security/detect-object-injection
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
            // eslint-disable-next-line security/detect-object-injection
            typeof (obj as Record<string, unknown>)[e]
        )
    );
}

const getTableValues = (
    obj: unknown | undefined,
    permanentKeys?: string[]
): string[] => {
    return [...new Set([...(permanentKeys ?? []), ...getPrimitiveValues(obj)])];
};

export const DebugInfoTables = (
    obj: unknown,
    tableKeys: TableKeys,
    name: string,
    className: string
) =>
    tableKeys.map(({ keys, values }) => (
        <Table
            key={`${name}${keys.length === 0 ? "" : "."}${keys.join(".")}`}
            className="caption-top grow overflow-hidden"
        >
            <TableCaption className={cn("text-xl font-bold", className)}>
                {`${name}${keys.length === 0 ? "" : "."}${keys.join(".")}`}
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
    ));

export type DebugInfoProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;
export function DebugInfo({ ...props }: DebugInfoProps) {
    const { id } = useCanvasContext();
    const canvas = useCanvas(id);
    const { app, viewport } = canvas;

    useThrottledCanvasUpdater(id);

    const OOB = viewport?.OOB();

    const appKeys: TableKeys = [
        {
            keys: ["screen"],
            values: getTableValues(app?.screen, [
                "left",
                "right",
                "top",
                "bottom",
            ]),
        },
        {
            keys: ["stage"],
            values: getTableValues(app?.stage),
        },
        {
            keys: ["stage", "_bounds"],
            // eslint-disable-next-line no-underscore-dangle
            values: getTableValues(app?.stage._bounds),
        },
        {
            keys: ["renderer", "options"],
            values: getTableValues(app?.renderer.options),
        },
        {
            keys: ["ticker"],
            values: getTableValues(app?.ticker, ["FPS"]),
        },
    ];

    const viewportKeys: TableKeys = [
        {
            keys: ["corner"],
            values: getTableValues(viewport?.corner),
        },
        {
            keys: ["center"],
            values: getTableValues(viewport?.center),
        },
        {
            keys: ["position"],
            values: getTableValues(viewport?.position, ["x", "y"]),
        },
        {
            keys: [],
            values: getTableValues(viewport, [
                "x",
                "y",
                "width",
                "height",
                "screenWidth",
                "screenHeight",
                "worldWidth",
                "worldHeight",
                "worldScreenWidth",
                "worldScreenHeight",
                "screenWorldWidth",
                "screenWorldHeight",
                "screenWidthInWorldPixels",
                "screenHeightInWorldPixels",
                "left",
                "right",
                "top",
                "bottom",
                "scaled",
            ]),
        },
        {
            keys: ["_bounds"],
            // eslint-disable-next-line no-underscore-dangle
            values: getTableValues(viewport?._bounds),
        },
    ];

    const OOBKeys: TableKeys = [
        {
            keys: [],
            values: getTableValues(OOB),
        },
        {
            keys: ["cornerPoint"],
            values: getTableValues(OOB?.cornerPoint),
        },
    ];

    return (
        <div
            className="w-full h-full flex flex-wrap justify-between items-start gap-0 px-2"
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
