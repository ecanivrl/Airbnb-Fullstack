'use client';

import { twMerge } from "tailwind-merge";


interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children,className }) => {
  return (
    <div className={twMerge("max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2  px-6",className)}>
      {children}
    </div>
  )
}

export default Container