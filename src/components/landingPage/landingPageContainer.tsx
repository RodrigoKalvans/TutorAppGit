import React from "react";

export default function LandingPageContainer({children, style = ""}: { children: React.ReactNode, style?: string }) {
  return (
    <>
      <div className={`${style} flex justify-center w-full`}>
        {children}
      </div>
    </>
  );
}
