import { twMerge } from "tailwind-merge";
import React from "react";

interface ElementWithClassName extends React.ReactElement {
  props: {
    className?: string;
    [key: string]: unknown;
  };
}

export default function cloneElement(
  element: ElementWithClassName,
  classNames: string
) {
  return React.cloneElement(element, {
    className: twMerge(element.props.className, classNames),
  });
}
