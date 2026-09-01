import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DataCaptureBorder } from 'ui/common/cyber-kit/DataCaptureBorder'
import { DataWire } from 'ui/common/cyber-kit/DataWire'
import { Text } from 'ui/common/typography/Text'
import { Button } from 'ui/controls/Button'
import type {
  Credit,
  ExperienceDetail,
  ExperienceStatus,
  LinkRef,
} from 'ui/features/experience-data/types'
import { useStableHeightCollapseScroll } from 'utils/anim/collapsible-scroll'
import { motionEase } from 'utils/anim/motion-ease'
import { prefersReducedMotion } from 'utils/browser/prefers-reduced-motion'
import { cns } from 'utils/formatters/classnames'
import { ExperienceDetailsBody } from './ExperienceDetailsBody'
import { ExperienceDetailsCredits } from './ExperienceDetailsCredits'
import { ExperienceDetailsStatus } from './ExperienceDetailsStatus'
import { ExperienceDetailsSkills } from './ExperienceDetailsSkills'

type ExperienceDetailsProps = {
  details: ExperienceDetail[]
  status?: ExperienceStatus
  credits?: Credit[]
  skills?: string[]
  href?: string
  links?: LinkRef[]
}

const ExperienceDetailsActions = ({
  href,
  links,
}: {
  href?: string
  links?: LinkRef[]
}) =>
  href || links?.length ? (
    <div className={'flex flex-col gap-1'}>
      {href && (
        <Button href={href} isExternal compact wide>
          Visit project ↗
        </Button>
      )}
      {links?.map((link) => (
        <Button key={link.href} href={link.href} isExternal compact wide quiet>
          {link.label}
        </Button>
      ))}
    </div>
  ) : null

const ExperienceDetailsContent = ({
  details,
  status,
  credits,
  skills,
  href,
  links,
}: ExperienceDetailsProps) => (
  <>
    {skills && skills.length > 0 && <ExperienceDetailsSkills skills={skills} />}
    {details.map((detail, i) => (
      <div key={i} className={'flex flex-col gap-2'}>
        {detail.caption && (
          <Text size={'hint'} tone={'secondary'} uppercase>
            {detail.caption}
          </Text>
        )}
        <ExperienceDetailsBody detail={detail} />
      </div>
    ))}
    {credits && credits.length > 0 && (
      <ExperienceDetailsCredits credits={credits} />
    )}
    {status && <ExperienceDetailsStatus status={status} />}
    <ExperienceDetailsActions href={href} links={links} />
  </>
)

const ExperienceDetailsToggle = ({
  expanded,
  panelId,
  onClick,
}: {
  expanded: boolean
  panelId: string
  onClick: () => void
}) => (
  <Text
    tag={'button'}
    type={'button'}
    tone={'accent'}
    uppercase
    aria-expanded={expanded}
    aria-controls={panelId}
    className={
      'flex w-full cursor-pointer items-center justify-between border-t border-accent/25 pt-3 text-left'
    }
    onClick={onClick}
  >
    <span>{expanded ? 'hide details' : 'show details'}</span>
    <span aria-hidden>{expanded ? '−' : '+'}</span>
  </Text>
)

export const ExperienceDetails = ({
  details,
  status,
  credits,
  skills,
  href,
  links,
}: ExperienceDetailsProps) => {
  const [reduced] = useState(prefersReducedMotion)

  return (
    <>
      <DataWire reduced={reduced} />
      <motion.aside
        data-inner
        onClick={(e) => e.stopPropagation()}
        className={cns(
          'pointer-events-auto absolute top-1/2 left-full z-[2] cursor-default',
          'ml-[80px] w-[clamp(360px,39vw,600px)]',
          'desktop-s:ml-[40px] tablet-s:hidden',
        )}
        initial={{ opacity: 0, x: reduced ? 0 : -16, y: '-50%' }}
        animate={{ opacity: 1, x: 0, y: '-50%' }}
        exit={{ opacity: 0, x: reduced ? 0 : -16, y: '-50%' }}
        transition={{ duration: 0.32, ease: motionEase.enter }}
      >
        <div className={'relative border border-accent/45 bg-base'}>
          <DataCaptureBorder />
          <Text
            size={'hint'}
            tone={'system'}
            uppercase
            className={
              'flex items-center justify-between border-b border-accent/25 px-3 py-[6px]'
            }
          >
            <span>detail feed</span>
            <span aria-hidden>▚</span>
          </Text>
          <div className={'flex flex-col gap-3 p-3'}>
            <ExperienceDetailsContent
              details={details}
              status={status}
              credits={credits}
              skills={skills}
              href={href}
              links={links}
            />
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export const ExperienceDetailsDisclosure = ({
  expanded,
  onExpandedChange,
  onCollapseComplete,
  ...props
}: ExperienceDetailsProps & {
  expanded: boolean
  onExpandedChange: (expanded: boolean) => void
  onCollapseComplete: () => void
}) => {
  const [reduced] = useState(prefersReducedMotion)
  const panelId = useId()
  const {
    panelRef,
    captureCollapseStart,
    handleAnimationStart,
    handleAnimationUpdate,
    handleAnimationComplete,
  } = useStableHeightCollapseScroll({ expanded, onCollapseComplete })
  const collapseDetails = () => {
    captureCollapseStart()
    onExpandedChange(false)
  }
  const toggleExpanded = () => {
    if (expanded) {
      collapseDetails()
      return
    }
    onExpandedChange(true)
  }

  return (
    <div data-inner className={'hidden pt-4 tablet-s:block'}>
      <ExperienceDetailsToggle
        expanded={expanded}
        panelId={panelId}
        onClick={toggleExpanded}
      />
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            ref={panelRef}
            id={panelId}
            data-experience-details-panel
            className={'overflow-hidden [overflow-anchor:none]'}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onAnimationStart={handleAnimationStart}
            onUpdate={handleAnimationUpdate}
            onAnimationComplete={handleAnimationComplete}
            transition={{
              duration: reduced ? 0 : 0.32,
              ease: motionEase.enter,
            }}
          >
            <div className={'flex flex-col gap-3 pt-3'}>
              <ExperienceDetailsContent {...props} />
              <ExperienceDetailsToggle
                expanded
                panelId={panelId}
                onClick={collapseDetails}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
