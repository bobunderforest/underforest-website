type Point = { x: number; y: number }
type Triangle = [Point, Point, Point]

const point = (x: number, y: number): Point => ({ x, y })
const radians = (angle: number) => (Math.PI / 180) * angle
const add = (a: Point, b: Point) => point(a.x + b.x, a.y + b.y)
const subtract = (a: Point, b: Point) => point(a.x - b.x, a.y - b.y)
const rotate = (origin: Point, target: Point, angle: number) => {
  const offset = subtract(target, origin)
  const value = radians(angle)
  return add(
    point(
      offset.x * Math.cos(value) - offset.y * Math.sin(value),
      offset.x * Math.sin(value) + offset.y * Math.cos(value),
    ),
    origin,
  )
}
const center = ([a, b, c]: Triangle) =>
  point((a.x + b.x + c.x) / 3, (a.y + b.y + c.y) / 3)
const triangleInCircle = (origin: Point, radius: number): Triangle => {
  const top = point(origin.x, origin.y - radius)
  return [top, rotate(origin, top, 120), rotate(origin, top, 240)]
}
const triangleFromBase = (a: Point, c: Point): Triangle => [
  a,
  rotate(c, a, 60),
  c,
]

const growth = [
  { drawAt: [0], length: 1 },
  { drawAt: [0, 1], length: 3 },
  { drawAt: [0, 1, 3], length: 6 },
  { drawAt: [1, 3, 6, 7], length: 9 },
  { drawAt: [0, 1, 4, 7, 9], length: 12 },
  { drawAt: [1, 3, 6, 7, 10, 13], length: 15 },
  { drawAt: [0, 1, 4, 7, 9, 12, 15], length: 18 },
  { drawAt: [1, 3, 6, 9, 10, 13, 16, 19], length: 21 },
  { drawAt: [0, 1, 4, 9], length: 24 },
]

const rotations = [
  [0],
  [5, 3, 1],
  [4, 2],
  [3, 1, 3, 1, 5, 1, 5, 3, 5],
  [0, 2, 0, 4],
  [1, 5, 3, 5, 1, 5, 3, 1, 3, 5, 3, 1, 5, 1, 3],
  [2, 4, 0, 4, 2, 0],
  [5, 3, 1, 5, 1, 3, 5, 3, 1, 5, 3, 5, 1, 3, 1, 5, 3, 1, 3, 5, 1],
  [4, 0, 2, 4, 2, 0, 4, 2],
  [3, 1, 5, 3, 1, 5, 3, 1, 5, 3, 1, 5],
]

const reflections = growth.reduce<Triangle[][]>(
  (levels, growthLevel) => [
    ...levels,
    levels[levels.length - 1].flatMap((triangle, triangleIndex) =>
      triangle.flatMap((a, pointIndex, points) => {
        const position = triangleIndex * 3 + pointIndex
        const shouldDraw = growthLevel.drawAt.includes(
          position % growthLevel.length,
        )
        return shouldDraw
          ? [triangleFromBase(a, points[pointIndex < 2 ? pointIndex + 1 : 0])]
          : []
      }),
    ),
  ],
  [[triangleInCircle(point(0, 0), 1)]],
)

export const drawKaleidoscope = ({
  context,
  image,
  radius,
}: {
  context: CanvasRenderingContext2D
  image: CanvasImageSource
  radius: number
}) => {
  const scale = (value: number) => value * radius
  context.save()
  context.translate(context.canvas.width / 2, context.canvas.height / 2)
  reflections.forEach((triangles, level) => {
    context.save()
    context.globalAlpha = 1 - level * 0.075
    triangles.forEach((triangle, index) => {
      context.save()
      context.beginPath()
      context.moveTo(scale(triangle[0].x), scale(triangle[0].y))
      context.lineTo(scale(triangle[1].x), scale(triangle[1].y))
      context.lineTo(scale(triangle[2].x), scale(triangle[2].y))
      context.closePath()
      context.clip()
      const midpoint = center(triangle)
      context.translate(scale(midpoint.x), scale(midpoint.y))
      context.rotate(radians(60 * (rotations[level]?.[index % rotations[level].length] ?? 0)))
      if (level % 2 === 1) context.scale(-1, 1)
      if (rotations[level]) {
        context.drawImage(image, -radius, -radius, radius * 2, radius * 2)
      }
      context.restore()
    })
    context.restore()
  })
  context.restore()
}
