import {ReactNode} from "react";

const BoxContainer = ({children, style = ""}: {children: ReactNode, style?: String}) => {
  return (
    <div className={`${style} p-8 shadow bg-white rounded-3xl`}>
      {children}
    </div>
  );
};

export default BoxContainer;
