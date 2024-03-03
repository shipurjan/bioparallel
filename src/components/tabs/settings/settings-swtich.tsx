import { Label } from "@/components/ui/label";
import { Switch, SwitchProps } from "@/components/ui/switch";
import { cn } from "@/lib/utils/shadcn";

export type SettingsSwitchProps = SwitchProps & {
    label: string;
};
export function SettingsSwitch({
    className,
    label,
    id,
    ...props
}: SettingsSwitchProps) {
    return (
        <div className="flex items-center justify-center gap-2 px-2 py-1">
            <Switch {...props} className={cn("", className)} id={id} />
            <Label
                className={cn("cursor-pointer", {
                    "font-normal": props.checked,
                    "font-light opacity-80": !props.checked,
                })}
                htmlFor={id}
            >
                {label}
            </Label>
        </div>
    );
}
