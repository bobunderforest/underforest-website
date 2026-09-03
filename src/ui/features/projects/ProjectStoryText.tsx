import { Link } from 'ui/common/typography/Link'
import { Text } from 'ui/common/typography/Text'

const markdownLinkPattern = /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g

const ProjectStoryTextFragment = ({ children }: { children: string }) => {
  const leadingWhitespace = children.match(/^\s*/)?.[0] ?? ''
  const trailingWhitespace = children.match(/\s*$/)?.[0] ?? ''
  const contentEnd = children.length - trailingWhitespace.length
  const content = children.slice(leadingWhitespace.length, contentEnd)

  if (!content) return children

  return (
    <>
      {leadingWhitespace}
      <Text tag={'span'} face={'inherit'} size={'inherit'}>
        {content}
      </Text>
      {trailingWhitespace}
    </>
  )
}

const renderProjectStoryText = (text: string) => {
  const parts: React.ReactNode[] = []
  let precedingIndex = 0

  for (const match of text.matchAll(markdownLinkPattern)) {
    const index = match.index
    const [source, label, href] = match

    parts.push(
      <ProjectStoryTextFragment key={`text-${index}`}>
        {text.slice(precedingIndex, index)}
      </ProjectStoryTextFragment>,
    )
    parts.push(
      <Link key={index} href={href} isExternal>
        <ProjectStoryTextFragment>{label}</ProjectStoryTextFragment>
      </Link>,
    )
    precedingIndex = index + source.length
  }

  if (parts.length === 0) return text

  parts.push(
    <ProjectStoryTextFragment key={'text-final'}>
      {text.slice(precedingIndex)}
    </ProjectStoryTextFragment>,
  )

  return parts
}

export const ProjectStoryText = ({ body }: { body: string | string[] }) => {
  const paragraphs = (Array.isArray(body) ? body : body.split(/\n+/)).filter(
    Boolean,
  )

  return (
    <div className={'max-w-[84ch]'}>
      {paragraphs.map((paragraph, i) => (
        <Text
          key={i}
          tag={'p'}
          tone={'primary'}
          size={'lead'}
          className={'mb-[0.75em] last:mb-0'}
        >
          {renderProjectStoryText(paragraph)}
        </Text>
      ))}
    </div>
  )
}
