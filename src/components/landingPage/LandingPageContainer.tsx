import React from "react";

/**
 *
 * @param {JSX} children
 * @return {JSX} component with children
 */
export default function LandingPageContainer({children}: {children: React.ReactNode}) {
  return (
    <>
      <div className={" w-full"}>
        {children}
      </div>
    </>
  );
}
