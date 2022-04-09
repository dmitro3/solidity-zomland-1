import React from "react";
import { Btn, Row } from "../../assets/styles/common.style";
import { ArrowRightIcon } from "@heroicons/react/solid";

export const Button = ({
  title,
  onClick,
  size,
  icon,
  noIcon,
  disabled,
  animated,
  secondary,
  dark,
  className,
  readonly
}) => {
  const sizeMapping = {
    xxs: "text-xs lg:px-2 px-1 lg:py-0.5 py-0.5",
    xs: "text-sm lg:px-4 px-3 lg:py-2 py-1",
    sm: "text-sm lg:px-4 px-3 lg:py-3 py-2.5",
    md: "text-base lg:px-5 px-4 lg:py-2 py-1.5",
    lg: "lg:text-lg text-base lg:px-6 px-4 lg:py-2 py-1.5",
  };

  const iconMapping = {
    xxs: "lg:h-3 h-2",
    xs: "lg:h-4 h-3",
    sm: "lg:h-4 h-3",
    md: "lg:h-5 h-4",
    lg: "lg:h-6 h-5",
  };

  return (
    <>
      <Btn
        animated={animated}
        className={`border-2 rounded-lg font-semibold uppercase text-white group transition ease-in-out duration-200 ${
          disabled && "grayscale cursor-default opacity-40"
        } 
        ${
          readonly && "grayscale opacity-70"
        }
         ${
          secondary
            ? "border-orange-500 hover:text-orange-500 hover:border-orange-600"
            : dark
            ? "border-purple-600 text-purple-500 hover:text-purple-300 hover:border-purple-400"
            : "border-transparent bg-orange-600 hover:bg-orange-700"
        } ${className}`}
        onClick={() => {
          if (!disabled) {
            onClick();
          }
        }}
      >
        <Row
          className={`justify-center whitespace-nowrap ${
            sizeMapping[size ?? "md"]
          } `}
        >
          {title}
          {noIcon ?? icon ?? (
            <ArrowRightIcon className={`ml-2 ${iconMapping[size ?? "md"]}`} />
          )}
        </Row>
      </Btn>
    </>
  );
};
