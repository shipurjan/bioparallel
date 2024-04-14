import { Label } from "@/components/ui/label";
import { Switch, SwitchProps } from "@/components/ui/switch";
import { cn } from "@/lib/utils/shadcn";
import { useId } from "react";
import { useTranslation } from "react-i18next";

export type SettingsSwitchProps = SwitchProps;
export function SettingsSwitch({ className, ...props }: SettingsSwitchProps) {
    const id = useId();
    const { t } = useTranslation();
    return (
        <div className="flex items-center justify-start gap-2 px-2 py-1">
            <Switch {...props} className={cn("", className)} id={id} />
            <Label
                className={cn("cursor-pointer", {
                    "font-normal": props.checked,
                    "font-light opacity-80": !props.checked,
                })}
                htmlFor={id}
            >
                {props.checked ? t("On") : t("Off")}
            </Label>
        </div>
    );
}
