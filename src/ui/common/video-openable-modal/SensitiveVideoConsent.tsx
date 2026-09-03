import { Button } from 'ui/controls/Button'
import { Text } from 'ui/common/typography/Text'

export const SensitiveVideoConsent = ({
  onConsent,
}: {
  onConsent: () => void
}) => (
  <div
    className={
      'pointer-events-none absolute inset-0 z-10 flex items-end select-none'
    }
  >
    <div
      className={
        'pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-base via-base/80 to-transparent'
      }
    />
    <div
      style={{
        backgroundImage:
          'radial-gradient(var(--color-atomic-orange) 0.6px, transparent 0.9px)',
        backgroundSize: '5px 5px',
        maskImage: 'linear-gradient(to top, black, transparent)',
      }}
      className={
        'pointer-events-none absolute inset-x-0 bottom-0 h-2/3 opacity-25'
      }
    />
    <div className={'relative w-fit max-w-full p-4'}>
      <Text size={'note'} uppercase className={'mb-2 text-atomic-orange'}>
        Content warning · sensitive topic
      </Text>
      <Button
        type={'button'}
        accent={'atomic'}
        compact
        className={'pointer-events-auto'}
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation()
          onConsent()
        }}
      >
        Consent to see the full video
      </Button>
    </div>
  </div>
)
