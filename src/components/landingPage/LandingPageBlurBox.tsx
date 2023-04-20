import React from "react";

/**
 * Blur boxes from landing page
 * @param {stlye} styles and children
 * @return {JSX} component
 */
export default function LandingPageBlurBox({children, style = ""}: { children: React.ReactNode, style?: string }) {
  return (
    <>
      <div className={`${style} w-full mt-16 rounded-4xl p-6 pb-10 shadow-xl`}>
        {children}
      </div>
    </>
  );
}
