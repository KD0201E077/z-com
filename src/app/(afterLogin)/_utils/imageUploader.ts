import { Dispatch, SetStateAction } from "react";

export const HandleImageUpload = (
  files: FileList | null,
  setPreview: Dispatch<
    SetStateAction<
      ({
        dataUrl: string;
        file: File;
      } | null)[]
    >
  >
) => {
  if (files) {
    const newFiles = Array.from(files);
    const tempPreviews: Array<{ dataUrl: string; file: File }> = [];
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        tempPreviews.push({
          dataUrl: reader.result as string,
          file,
        });
        //readAsDataURL는 비동기 작업임
        if (tempPreviews.length === newFiles.length) {
          setPreview((prev) => [...prev, ...tempPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  }
};
