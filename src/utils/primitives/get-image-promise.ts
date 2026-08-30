export const getImagePromise = (src: string) =>
  new Promise<HTMLImageElement>((resolve) => {
    const img = document.createElement('img')
    img.onload = () => resolve(img)
    img.src = src
  })
