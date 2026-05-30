import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
}

export function Container({
  children,
}: ContainerProps) {
  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[1600px]

        px-4
        sm:px-5
        md:px-6
        lg:px-8
        xl:px-10
      "
    >
      {children}
    </div>
  );
}
