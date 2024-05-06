import { MarkingsStore } from "@/lib/stores/Markings";
import { useCanvasContext } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { useEffect, useMemo, useState } from "react";
import { GlobalSettingsStore } from "@/lib/stores/GlobalSettings";
import { getOppositeCanvasId } from "@/components/pixi/canvas/utils/get-opposite-canvas-id";
import invariant from "tiny-invariant";
import { hasDuplicates } from "@/lib/utils/array/hasDuplicates";
import { IS_DEV_ENVIRONMENT } from "@/lib/utils/const";
import { DataTable } from "./data-table";
import { EmptyableMarking, getColumns } from "./columns";

export function MarkingsInfo({ tableHeight }: { tableHeight: number }) {
    const { id } = useCanvasContext();
    const language = GlobalSettingsStore.use(state => state.settings.language);
    const selectedMarking = MarkingsStore(id).use(
        state => state.selectedMarking
    );

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

    useEffect(() => {
        // sprawdzanie, czy znaczniki są unikalne
        if (IS_DEV_ENVIRONMENT) {
            const markingLabels = thisMarkings.map(m => m.label);

            invariant(
                !hasDuplicates(markingLabels),
                "Markings must have unique labels"
            );
        }
    }, [thisMarkings]);

    const [columns, setColumns] = useState(getColumns(id));

    const markings = useMemo(() => {
        const thisIds = thisMarkings.map(m => m.id);
        const thisLabels = thisMarkings.map(m => m.label);
        return [
            ...thisMarkings,
            ...oppositeMarkings.filter(m => !thisLabels.includes(m.label)),
        ]
            .sort((a, b) => a.label - b.label)
            .map(m =>
                thisIds.includes(m.id)
                    ? m
                    : { boundMarkingId: m.id, label: m.label }
            ) as EmptyableMarking[];
    }, [oppositeMarkings, thisMarkings]);

    useEffect(() => {
        setColumns(getColumns(id));
    }, [id, language, selectedMarking]);

    return (
        <div className="w-full h-fit py-0.5">
            <DataTable
                canvasId={id}
                selectedMarking={selectedMarking}
                height={`${tableHeight}px`}
                columns={columns}
                data={markings}
            />
        </div>
    );
}
