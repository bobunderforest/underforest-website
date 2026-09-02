import { Text } from 'ui/common/typography/Text'

export const ProjectStoryText = ({ body }: { body: string }) => {
  const paragraphs = body.split(/\n+/).filter(Boolean)

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
          {paragraph}
        </Text>
      ))}
    </div>
  )
}
