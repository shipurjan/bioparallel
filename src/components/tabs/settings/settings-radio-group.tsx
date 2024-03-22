import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupProps } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils/shadcn";
import { Children, ReactElement, cloneElement, useId } from "react";

export type SettingsRadioGroupProps = RadioGroupProps;
export function SettingsRadioGroup({
    className,
    value,
    children,
    ...props
}: SettingsRadioGroupProps) {
    const arrayChildren = Children.toArray(children) as ReactElement[];
    return (
        <RadioGroup
            {...props}
            className={cn("flex flex-wrap justify-evenly", className)}
        >
            {Children.map(arrayChildren, child => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const id = useId();
                return (
                    <div className="flex items-center space-x-2">
                        {cloneElement(child, {
                            id,
                        })}
                        <Label
                            className={cn("cursor-pointer", {
                                "font-normal": value === child.props.value,
                                "font-light opacity-80":
                                    value !== child.props.value,
                            })}
                            htmlFor={id}
                        >
                            {child.props.label}
                        </Label>
                    </div>
                );
            })}
        </RadioGroup>
    );
}
