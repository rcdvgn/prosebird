"use client";

import React, { useEffect } from "react";

const useAutosizeTextArea = (
  newCommentInput: HTMLTextAreaElement | null,
  newComment: string
) => {
  useEffect(() => {
    if (newCommentInput) {
      newCommentInput.style.height = "0px";
      const scrollHeight = newCommentInput.scrollHeight;
      newCommentInput.style.height = scrollHeight + "px";
    }
  }, [newCommentInput, newComment]);
};

export default useAutosizeTextArea;
