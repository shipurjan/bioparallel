import { MarkingsStore } from "@/lib/stores/Markings";
import { useCanvasContext } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { useEffect, useState } from "react";
import { GlobalSettingsStore } from "@/lib/stores/GlobalSettings";
import { DataTable } from "./data-table";
import { ExtendedMarking, getColumns } from "./columns";

export function MarkingsInfo({ tableHeight }: { tableHeight: number }) {
    const { id } = useCanvasContext();
    const { markings } = MarkingsStore(id).use(
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

    useEffect(() => {
        setColumns(getColumns());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [GlobalSettingsStore.state.settings.language]);

    return (
        <div className="w-full h-fit py-0.5">
            <DataTable
                height={`${tableHeight}px`}
                columns={columns}
                data={markings as ExtendedMarking[]}
            />
        </div>
    );
}
