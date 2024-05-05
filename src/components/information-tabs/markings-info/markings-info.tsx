import { MarkingsStore } from "@/lib/stores/Markings";
import { useCanvasContext } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { useEffect, useMemo, useRef, useState } from "react";
import { GlobalSettingsStore } from "@/lib/stores/GlobalSettings";
import { getOppositeCanvasId } from "@/components/pixi/canvas/utils/get-opposite-canvas-id";
import { TableVirtuosoHandle } from "react-virtuoso";
import { DataTable } from "./data-table";
import { EmptyableMarking, getColumns } from "./columns";

export function MarkingsInfo({ tableHeight }: { tableHeight: number }) {
    const { id } = useCanvasContext();
    const virtuosoTableRef = useRef<TableVirtuosoHandle>(null);

    const { markings: thisMarkings } = MarkingsStore(id).use(
        state => ({
            markings: state.markings,
            hash: state.markingsHash,
        }),
        (oldState, newState) => {
            // re-rendering tylko wtedy, gdy zmieni się hash stanu
            return oldState.hash === newState.hash;
        }
    );

    const { markings: oppositeMarkings } = MarkingsStore(
        getOppositeCanvasId(id)
    ).use(
        state => ({
            markings: state.markings,
            hash: state.markingsHash,
        }),
        (oldState, newState) => {
            // re-rendering tylko wtedy, gdy zmieni się hash stanu
            return oldState.hash === newState.hash;
        }
    );

    const [columns, setColumns] = useState(getColumns(id));

    const markings = useMemo(() => {
        const thisIds = thisMarkings.map(m => m.id);
        const thisLabels = thisMarkings.map(m => m.label);
        // eslint-disable-next-line sonarjs/prefer-immediate-return
        const m = [
            ...thisMarkings,
            ...oppositeMarkings.filter(m => !thisLabels.includes(m.label)),
        ]
            .sort((a, b) => a.label - b.label)
            .map(m =>
                thisIds.includes(m.id)
                    ? m
                    : { boundMarkingId: m.id, label: m.label }
            ) as EmptyableMarking[];

        return m;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [oppositeMarkings, thisMarkings]);

    useEffect(() => {
        setColumns(getColumns(id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [GlobalSettingsStore.state.settings.language]);

    return (
        <div className="w-full h-fit py-0.5">
            <DataTable
                ref={virtuosoTableRef}
                canvasId={id}
                height={`${tableHeight}px`}
                columns={columns}
                data={markings}
            />
        </div>
    );
}
