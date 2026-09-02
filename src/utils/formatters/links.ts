const CHANNEL_TAG: [test: RegExp, tag: string][] = [
  [/linkedin\.com/, 'job'],
  [/github\.com/, 'src'],
  [/(youtube\.com|youtu\.be)/, 'vid'],
  [/instagram\.com/, 'img'],
  [/store\.steampowered\.com/, 'steam'],
  [/itch\.io/, 'play'],
  [/behance\.net/, 'bnc'],
]

export const channelTag = (href: string) =>
  CHANNEL_TAG.find(([test]) => test.test(href))?.[1] ?? 'www'
