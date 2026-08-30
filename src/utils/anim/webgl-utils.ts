export function compileShader(
  ctx: WebGLRenderingContext,
  source: string,
  type: GLenum,
) {
  const shader = ctx.createShader(type)!
  ctx.shaderSource(shader, source)
  ctx.compileShader(shader)

  if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
    console.error('Error compiling shader:', ctx.getShaderInfoLog(shader))
    ctx.deleteShader(shader)
    return null
  }

  return shader
}

export function createProgram(
  gl: WebGLRenderingContext,
  vshader: WebGLShader,
  fshader: WebGLShader,
) {
  const prog = gl.createProgram()!

  gl.attachShader(prog, vshader)
  gl.attachShader(prog, fshader)

  gl.linkProgram(prog)

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(prog))
    gl.deleteProgram(prog)
    return null
  }

  return prog
}
