export const rasterizeSvg = (
  svgText: string,
  width: number,
  height: number,
) =>
  new Promise<HTMLCanvasElement>((resolve, reject) => {
    const sized = svgText
      .replace(/\s(?:width|height)="[^"]*"/g, '')
      .replace(/<svg/, `<svg width="${width}" height="${height}"`)
    const url = URL.createObjectURL(
      new Blob([sized], { type: 'image/svg+xml' }),
    )
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      URL.revokeObjectURL(url)
      if (!ctx) {
        reject(new Error('2d context unavailable'))
        return
      }
      ctx.drawImage(image, 0, 0, width, height)
      resolve(canvas)
    }
    image.onerror = (event) => {
      URL.revokeObjectURL(url)
      reject(event)
    }
    image.src = url
  })
