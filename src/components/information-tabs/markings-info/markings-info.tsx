import { useMarkingsStore } from "@/lib/stores/useMarkingsStore";
import { useCanvasContext } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { DataTable } from "./data-table";
import { ExtendedMarking, columns } from "./columns";

export function MarkingsInfo() {
    const { id } = useCanvasContext();
    const markings = useMarkingsStore(state =>
        state.markings.filter(marking => marking.canvasId === id)
    );

    return (
        <div className="w-full h-fit overflow-auto py-0.5 px-2">
            <DataTable columns={columns} data={markings as ExtendedMarking[]} />
        </div>
    );
}
