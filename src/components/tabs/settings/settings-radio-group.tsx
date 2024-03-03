import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupProps } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils/shadcn";
import { Children } from "react";

export type SettingsRadioGroupProps = RadioGroupProps;
export function SettingsRadioGroup({
    className,
    value,
    children,
    ...props
}: SettingsRadioGroupProps) {
    const arrayChildren = Children.toArray(children);
    return (
        <RadioGroup {...props} className={cn("", className)}>
            {Children.map(arrayChildren, child => (
                <div className="flex items-center space-x-2">
                    {child}
                    <Label
                        className={cn("cursor-pointer", {
                            // @ts-expect-error - child is expected to be RadioGroupItem
                            "font-normal": value === child.props.value,
                            "font-light opacity-80":
                                // @ts-expect-error - child is expected to be RadioGroupItem
                                value !== child.props.value,
                        })}
                        // @ts-expect-error - child is expected to be RadioGroupItem
                        htmlFor={child.props.id}
                    >
                        {/* @ts-expect-error - child is expected to be RadioGroupItem */}
                        {child.props.label}
                    </Label>
                </div>
            ))}
        </RadioGroup>
    );
}
