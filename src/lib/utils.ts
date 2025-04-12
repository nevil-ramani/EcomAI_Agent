import { twMerge } from "tailwind-merge";
import React from "react";

/**
 * Clone React element.
 * The function clones React element and adds Tailwind CSS classnames to the cloned element
 * @param element the React element to clone
 * @param classNames Tailwind CSS classnames
 * @returns { React.ReactElement } - Cloned React element
 */
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
