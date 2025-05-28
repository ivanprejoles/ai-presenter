
// ✅ File validation function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateFile = (file: File, toast: any): boolean => {

  const acceptedFormats = [
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ];

  if (!acceptedFormats.includes(file.type)) {
    toast({
      title: "Invalid file format",
      description: "Please upload a PDF, Excel, Word, or CSV file.",
      variant: "destructive",
    });
    return false;
  }

  if (file.size > 25 * 1024 * 1024) {
    toast({
      title: "File too large",
      description: "Maximum file size is 25MB.",
      variant: "destructive",
    });
    return false;
  }

  return true;
};
