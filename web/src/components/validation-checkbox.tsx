import Image from "next/image";

import CheckboxDefaultSvg from "@/images/icons/checkbox_default.svg";
import CheckboxCheckedSvg from "@/images/icons/checkbox_checked.svg";
import CheckboxErrorSvg from "@/images/icons/checkbox_error.svg";

interface IProps {
  text: string;
  status: CheckboxStatus;
}

export enum CheckboxStatus {
  Default,
  Checked,
  Error,
}

export default function ValidationCheckbox(props: IProps) {
  let icon;
  switch (props.status) {
    case CheckboxStatus.Default:
      icon = CheckboxDefaultSvg;
      break;
    case CheckboxStatus.Checked:
      icon = CheckboxCheckedSvg;
      break;
    case CheckboxStatus.Error:
      icon = CheckboxErrorSvg;
      break;
  }

  return (
    <div className="flex gap-4 items-center py-1.5">
      <Image priority src={icon} alt="Checkbox status" width={28} />
      <p className={props.status === CheckboxStatus.Error ? "text-error" : ""}>
        {props.text}
      </p>
    </div>
  );
}
