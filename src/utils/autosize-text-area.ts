const autosizeTextArea = (textRef: React.MutableRefObject<HTMLTextAreaElement | null>) => {
  if (textRef.current) {
    textRef.current.style.height = "0px";
    const scrollHeight = textRef.current.scrollHeight;
    textRef.current.style.height = scrollHeight + "px";
  }
};

export default autosizeTextArea;