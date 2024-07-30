import { useState, useEffect, RefObject } from "react";

function useSelection(textAreaRef: RefObject<HTMLTextAreaElement>) {
  const [isSelected, setIsSelected] = useState(false);
  const [selection, setSelection] = useState<string | null>(null);

  useEffect(() => {
    const checkSelection = () => {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && textAreaRef.current) {
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        const rangeTest =
          textAreaRef.current?.selectionEnd -
          textAreaRef.current?.selectionStart;
        if (rangeTest > 0 && rect) {
          const isWithinDiv =
            rect.top === 0 &&
            rect.bottom === 0 &&
            rect.left === 0 &&
            rect.right === 0;
          if (isWithinDiv && rangeTest > 0) {
            setIsSelected(true);
            setSelection(sel.toString() ? sel.toString() : getSelectionText());
            return;
          }
        }
      }
      setIsSelected(false);
      setSelection(null);
    };

    const getSelectionText = () => {
      try {
        const ta = textAreaRef.current;
        if (ta) {
          return ta.value.substring(ta.selectionStart, ta.selectionEnd);
        }
      } catch (e) {
        console.log("Can't get selection text", e);
      }
      return "";
    };

    document.addEventListener("selectionchange", checkSelection);
    return () => {
      document.removeEventListener("selectionchange", checkSelection);
    };
  }, [textAreaRef]);

  return { isSelected, selection };
}

export default useSelection;
