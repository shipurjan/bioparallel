import { message } from "@tauri-apps/plugin-dialog";

function getErrorMessage(errorData: unknown): string {
    if (errorData instanceof Error) {
        return errorData.message;
    }

    if (typeof errorData === "string") {
        return errorData;
    }

    if (typeof errorData === "object") {
        return JSON.stringify(errorData);
    }

    return "Something went wrong";
}

export function showErrorDialog(
    errorData: unknown,
    kind: "error" | "info" | "warning" = "error"
) {
    const error = getErrorMessage(errorData);
    message(error, { kind });
}
