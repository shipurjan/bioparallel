/* eslint-disable no-throw-literal */
import { CanvasMetadata } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { showErrorDialog } from "@/lib/errors/showErrorDialog";
import { Marking, MarkingsStore } from "@/lib/stores/Markings";
import { getVersion } from "@tauri-apps/api/app";
import { open, confirm } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { t } from "i18next";
import { Viewport } from "pixi-viewport";
import { ExportObject } from "./saveMarkingsDataWithDialog";

function validateFileData(_data: unknown): _data is ExportObject {
    const data = _data as ExportObject;
    return (
        typeof data === "object" &&
        data !== null &&
        "software" in data &&
        "name" in data.software &&
        data.software.name === "bioparallel" &&
        "version" in data.software
    );
}

export async function loadMarkingsDataWithDialog(viewport: Viewport) {
    try {
        const fileResponse = await open({
            title: t("Load markings data from file", {
                ns: "tooltip",
            }),
            filters: [
                {
                    name: "Markings data file",
                    // TODO: add .xyt
                    extensions: ["json"],
                },
            ],
            directory: false,
            canCreateDirectories: false,
            multiple: false,
        });

        if (fileResponse === null) throw "cancel";

        const id = viewport.name as CanvasMetadata["id"] | null;
        if (id === null) throw new Error(`Canvas ID: ${id} not found`);

        const file = await readTextFile(fileResponse.path);
        const data: unknown = JSON.parse(file);
        if (!validateFileData(data)) {
            throw new Error("Invalid markings data file");
        }

        const appVersion = await getVersion();

        if (data.software.version !== appVersion) {
            const confirmed = confirm(
                `The markings data was created with a different version of the application (${data.software.version}). Loading it might not work.\n\nAre you sure you want to load it?`,
                {
                    kind: "warning",
                    title: fileResponse?.name ?? "Are you sure?",
                }
            );
            if (!confirmed) throw "cancel";
        }

        if (MarkingsStore(id).state.markings.length !== 0) {
            const confirmed = confirm(
                "Are you sure you want to load this image?\n\nIt will remove the previously loaded image and all existing forensic marks.",
                {
                    kind: "warning",
                    title: fileResponse?.name ?? "Are you sure?",
                }
            );
            if (!confirmed) throw "cancel";
        }

        const markings: Marking[] = data.markings.map(marking => ({
            ...marking,
            hidden: false,
            selected: false,
        }));

        MarkingsStore(id).state.reset();
        MarkingsStore(id).actions.markings.addMany(markings);
    } catch (error) {
        if (typeof error === "string" && error === "cancel") return;

        showErrorDialog(error);
    }
}
