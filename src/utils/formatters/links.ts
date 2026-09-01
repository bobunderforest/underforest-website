const CHANNEL_TAG: [test: RegExp, tag: string][] = [
  [/github\.com/, 'src'],
  [/(youtube\.com|youtu\.be)/, 'vid'],
  [/instagram\.com/, 'ig'],
  [/store\.steampowered\.com/, 'steam'],
  [/itch\.io/, 'itch'],
  [/behance\.net/, 'bnc'],
]

export const channelTag = (href: string) =>
  CHANNEL_TAG.find(([test]) => test.test(href))?.[1] ?? 'www'
