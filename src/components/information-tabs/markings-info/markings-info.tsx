import { MarkingsStore } from "@/lib/stores/Markings";
import { useCanvasContext } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { DataTable } from "./data-table";
import { ExtendedMarking, columns } from "./columns";

export function MarkingsInfo() {
    const { id } = useCanvasContext();
    const { markings } = MarkingsStore.use(
        state => ({
            markings: state.markings.filter(m => m.canvasId === id),
            hash: state.markingsHash,
        }),
        (oldState, newState) => {
            return oldState.hash === newState.hash;
        }
    );

    return (
        <div className="w-full h-fit overflow-auto py-0.5 px-2">
            <DataTable
                height="190px"
                columns={columns}
                data={markings as ExtendedMarking[]}
            />
        </div>
    );
}
