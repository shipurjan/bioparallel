import { MarkingsStore } from "@/lib/stores/Markings";
import { useCanvasContext } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { useEffect, useMemo, useRef, useState } from "react";
import { GlobalSettingsStore } from "@/lib/stores/GlobalSettings";
import { getOppositeCanvasId } from "@/components/pixi/canvas/utils/get-opposite-canvas-id";
import { CUSTOM_GLOBAL_EVENTS, LABEL_MAP } from "@/lib/utils/const";
import { TableVirtuosoHandle } from "react-virtuoso";
import { sleep } from "@/lib/utils/misc/sleep";
import { DataTable } from "./data-table";
import { EmptyableMarking, getColumns } from "./columns";

export function MarkingsInfo({ tableHeight }: { tableHeight: number }) {
    const { id } = useCanvasContext();
    const virtuosoTableRef = useRef<TableVirtuosoHandle>(null);
    const cursor = MarkingsStore(id).use(state => state.cursor);

    useEffect(() => {
        const resetCursor = () => {
            MarkingsStore(id).actions.cursor.updateCursor(
                Infinity,
                undefined,
                undefined
            );
        };
        document.addEventListener(
            CUSTOM_GLOBAL_EVENTS.RESET_MARKING_CURSOR,
            resetCursor
        );
        return () => {
            document.removeEventListener(
                CUSTOM_GLOBAL_EVENTS.RESET_MARKING_CURSOR,
                resetCursor
            );
        };
    }, [id]);

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

    const [columns, setColumns] = useState(getColumns());

    const markings = useMemo(() => {
        const thisIds = thisMarkings.map(m => m.id);
        const thisLabels = thisMarkings.map(m => m.label);
        // eslint-disable-next-line sonarjs/prefer-immediate-return
        const m = [
            ...thisMarkings,
            ...oppositeMarkings.filter(m => !thisLabels.includes(m.label)),
        ]
            .sort((a, b) => {
                let aIdx = LABEL_MAP.indexOf(a.label);
                if (aIdx === -1) aIdx = Number(a.label) + LABEL_MAP.length;
                let bIdx = LABEL_MAP.indexOf(b.label);
                if (bIdx === -1) bIdx = Number(b.label) + LABEL_MAP.length;

                return aIdx - bIdx;
            })
            .map(m =>
                thisIds.includes(m.id)
                    ? m
                    : { boundMarkingId: m.id, label: m.label }
            ) as EmptyableMarking[];

        return m;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [oppositeMarkings, thisMarkings, cursor]);

    useEffect(() => {
        const virtuoso = virtuosoTableRef.current;
        if (virtuoso === null) return;

        const getIndex = () => {
            if (Number.isFinite(cursor.rowIndex)) {
                if (cursor.rowIndex < 0) {
                    return markings.length + cursor.rowIndex;
                }
                return cursor.rowIndex;
            }
            return markings.length - 1;
        };

        const index = getIndex();
        sleep(0).then(() => {
            virtuoso.scrollToIndex({
                index,
                align: "center",
                behavior: "smooth",
            });
        });
    }, [cursor, markings.length]);

    useEffect(() => {
        setColumns(getColumns());
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
