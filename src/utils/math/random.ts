export const random = (min: number, max: number, float?: boolean) =>
  float
    ? Math.random() * (max - min) + min
    : Math.floor(Math.random() * (max - min + 1)) + min
