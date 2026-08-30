import Typograf from 'typograf'

const tp = new Typograf({ locale: ['en-US'] })

export const typograf = (text: string | null | undefined): string => {
  if (!text || typeof text !== 'string') return ''

  return tp.execute(text)
}

export const italicizeBold = (
  text: string,
  className = 'italic text-egg-shell',
): string => text.replace(/\*\*(.+?)\*\*/g, `<em class="${className}">$1</em>`)
