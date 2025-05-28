export async function imageUrlToBase64(imageUrl: string) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result); // data:image/xxx;base64,...
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
