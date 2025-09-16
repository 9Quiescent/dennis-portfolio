import React from "react";

type DcCardProps = React.HTMLAttributes<HTMLDivElement>;

export default function DcCard({ className = "", children, ...rest }: DcCardProps) {
  return (
    <div {...rest} className={`dc-card ${className}`}>
      {children}
    </div>
  );
}
