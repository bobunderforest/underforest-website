const CHANNEL_TAG: [test: RegExp, tag: string][] = [
  [/linkedin\.com/, 'hire me'],
  [/github\.com/, 'src'],
  [/(youtube\.com|youtu\.be)/, 'vid'],
  [/instagram\.com/, 'img'],
  [/store\.steampowered\.com/, 'steam'],
  [/itch\.io/, 'game'],
  [/behance\.net/, 'bnc'],
  [/x\.com/, 'x.com'],
]

export const channelTag = (href: string) =>
  CHANNEL_TAG.find(([test]) => test.test(href))?.[1] ?? 'www'
