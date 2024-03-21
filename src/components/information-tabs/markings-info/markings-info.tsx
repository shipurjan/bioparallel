import { MarkingsStore } from "@/lib/stores/Markings";
import { useCanvasContext } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { DataTable } from "./data-table";
import { ExtendedMarking, columns } from "./columns";

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
