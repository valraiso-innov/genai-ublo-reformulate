import React, { RefObject, useEffect } from "react";

const autosizeTextArea = (
  textRef: React.MutableRefObject<HTMLTextAreaElement | null>,
) => {
  if (textRef.current) {
    textRef.current.style.height = "0px";
    const scrollHeight = textRef.current.scrollHeight;
    textRef.current.style.height = scrollHeight + "px";
  }
};

const useAutosize = (
  value: string,
  textRef: RefObject<HTMLTextAreaElement>,
) => {
  useEffect(() => {
    autosizeTextArea(textRef);
  }, [value, textRef]);

  useEffect(() => {
    const handleResize = () => {
      autosizeTextArea(textRef);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [textRef]);
};

export default useAutosize;
