export const grabVideoFrame = (
  video: HTMLVideoElement,
): Promise<string | undefined> =>
  new Promise((resolve) => {
    const canvas = drawVideoFrame(video)
    if (!canvas) return resolve(undefined)
    try {
      canvas.toBlob((blob) =>
        resolve(blob ? URL.createObjectURL(blob) : undefined),
      )
    } catch {
      resolve(undefined)
    }
  })

export const drawVideoFrame = (
  video: HTMLVideoElement,
): HTMLCanvasElement | undefined => {
  if (!video.videoWidth || !video.videoHeight) return undefined
  try {
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d')
    if (!context) return undefined
    context.drawImage(video, 0, 0)
    return canvas
  } catch {
    return undefined
  }
}
