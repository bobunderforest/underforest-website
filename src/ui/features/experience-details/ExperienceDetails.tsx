import { useCallback, useEffect, useId, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useScroll,
  useTransform,
} from 'framer-motion'
import { createPortal } from 'react-dom'
import { DataCaptureBorder } from 'ui/common/cyber-kit/DataCaptureBorder'
import { DATA_WIRE_DRAW_DURATION, DataWire } from 'ui/common/cyber-kit/DataWire'
import { Text } from 'ui/common/typography/Text'
import { Button } from 'ui/controls/Button'
import type { ExperienceEntry } from 'ui/features/experience-data/types'
import { FieldLabel } from 'ui/sections/FieldLabel'
import { useStableHeightCollapseScroll } from 'utils/anim/collapsible-scroll'
import { limitLenisWheelInput } from 'utils/anim/lenis'
import { ease } from 'utils/anim/easings'
import { motionEase } from 'utils/anim/motion-ease'
import { prefersReducedMotion } from 'utils/browser/prefers-reduced-motion'
import { subscribeScrollLockChange } from 'utils/browser/scroll-util'
import { cns } from 'utils/formatters/classnames'
import { useElementSize } from 'utils/hooks/useElementSize'
import { useMounted } from 'utils/hooks/useMounted'
import { useResizeObserver } from 'utils/hooks/useResizeObserver'
import { useWindowSize } from 'utils/hooks/useWindowSize'
import { ExperienceDetailsBody } from './ExperienceDetailsBody'
import { ExperienceDetailsCredits } from './ExperienceDetailsCredits'
import { ExperienceDetailsStatus } from './ExperienceDetailsStatus'
import { ExperienceDetailsSkills } from './ExperienceDetailsSkills'

const VIEWPORT_PADDING = 24
const FEED_HEADER_HEIGHT = 29
const FEED_EXIT_FADE_DURATION = 0.1
const WIRE_GAP = 26

const ExperienceDetailsActions = ({
  href,
  links,
}: {
  href?: ExperienceEntry['href']
  links?: ExperienceEntry['links']
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
  entry: { details = [], status, credits, skills, href, links },
}: {
  entry: ExperienceEntry
}) => (
  <>
    {skills && skills.length > 0 && <ExperienceDetailsSkills skills={skills} />}
    {details.map((detail, i) => (
      <div key={i} className={'flex flex-col gap-2'}>
        {detail.caption && (
          <FieldLabel className={'mb-0'}>{detail.caption}</FieldLabel>
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

const ExperienceDetailsContentTransition = ({
  entry,
  reduced,
}: {
  entry: ExperienceEntry
  reduced: boolean
}) => (
  <AnimatePresence mode={'wait'}>
    <motion.div
      key={entry.id}
      className={'flex flex-col gap-3 px-3 pt-3 pb-4'}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          duration: reduced ? 0 : 0.18,
          ease: motionEase.enter,
        },
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: reduced ? 0 : 0.18,
          ease: motionEase.exit,
        },
      }}
    >
      <ExperienceDetailsContent entry={entry} />
    </motion.div>
  </AnimatePresence>
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
    <span className={'flex min-w-0 items-center gap-1.5'}>
      <span
        aria-hidden
        className={
          'inline-flex w-[3ch] shrink-0 -translate-y-[0.08em] justify-center'
        }
      >
        ::
      </span>
      {expanded ? 'hide details' : 'show details'}
    </span>
    <span aria-hidden className={'shrink-0 text-right whitespace-nowrap'}>
      {expanded ? '[ - ]' : '[ + ]'}
    </span>
  </Text>
)

export const ExperienceDetails = ({
  entry,
  entryRef,
  sourceRef,
}: {
  entry: ExperienceEntry
  entryRef: React.RefObject<HTMLElement | null>
  sourceRef: React.RefObject<HTMLElement | null>
}) => {
  const [reduced] = useState(prefersReducedMotion)
  const isPresent = useIsPresent()
  const portalReady = useMounted()
  const { width: viewportWidth, height: viewportHeight } = useWindowSize()
  const { ref: contentRef, height: contentHeight } =
    useElementSize<HTMLDivElement>()
  const panelRef = useRef<HTMLElement>(null)
  const [entryHeight, setEntryHeight] = useState(0)
  const [sourceRight, setSourceRight] = useState(0)
  const [sourceDocumentY, setSourceDocumentY] = useState(0)
  const [lockedSourceY, setLockedSourceY] = useState<number | null>(null)
  const [panelLeft, setPanelLeft] = useState(0)
  const [borderBlinkKey, setBorderBlinkKey] = useState(0)
  const { scrollY, scrollYProgress } = useScroll({
    target: entryRef,
    offset: ['start center', 'end center'],
  })
  const availableContentHeight = Math.max(
    viewportHeight - VIEWPORT_PADDING * 2 - FEED_HEADER_HEIGHT,
    0,
  )
  const contentOverflow = Math.max(contentHeight - availableContentHeight, 0)
  const panelHeight =
    FEED_HEADER_HEIGHT + Math.min(contentHeight, availableContentHeight)
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -contentOverflow],
    { ease: ease.easeInOutQuad },
  )
  const measureConnection = useCallback(() => {
    const entry = entryRef.current
    const source = sourceRef.current
    if (!entry || !source) return
    const sourceRect = source.getBoundingClientRect()
    setEntryHeight(entry.getBoundingClientRect().height)
    setSourceRight(sourceRect.right)
    setSourceDocumentY(sourceRect.top + scrollY.get() + sourceRect.height / 2)
    if (panelRef.current) {
      setPanelLeft(panelRef.current.offsetLeft)
    }
  }, [entryRef, scrollY, sourceRef])

  useResizeObserver(entryRef, measureConnection)
  useResizeObserver(sourceRef, measureConnection, { initCall: false })
  useResizeObserver(panelRef, measureConnection, { initCall: false })

  useEffect(measureConnection, [measureConnection, portalReady, viewportWidth])

  useEffect(() => {
    let measurementFrame = 0
    let stopWaitingForScroll: (() => void) | undefined
    const unsubscribe = subscribeScrollLockChange((locked) => {
      cancelAnimationFrame(measurementFrame)
      stopWaitingForScroll?.()
      stopWaitingForScroll = undefined
      measurementFrame = requestAnimationFrame(() => {
        if (!locked) {
          const restoredScrollY = window.scrollY
          const releaseLockedSource = () => {
            measureConnection()
            setLockedSourceY(null)
            stopWaitingForScroll?.()
            stopWaitingForScroll = undefined
          }

          if (Math.abs(scrollY.get() - restoredScrollY) <= 0.5) {
            releaseLockedSource()
          } else {
            stopWaitingForScroll = scrollY.on('change', releaseLockedSource)
          }
          return
        }

        const source = sourceRef.current
        if (!source) return
        const sourceRect = source.getBoundingClientRect()
        setLockedSourceY(sourceRect.top + sourceRect.height / 2)
      })
    })

    return () => {
      cancelAnimationFrame(measurementFrame)
      stopWaitingForScroll?.()
      unsubscribe()
    }
  }, [measureConnection, scrollY, sourceRef])

  useEffect(() => {
    if (contentOverflow <= 0 || entryHeight <= 0) return
    return limitLenisWheelInput(Math.min(entryHeight / contentOverflow, 1))
  }, [contentOverflow, entryHeight])

  if (!portalReady) return null

  return createPortal(
    <>
      <DataWire
        reduced={reduced}
        scrollY={scrollY}
        sourceDocumentY={sourceDocumentY}
        lockedSourceY={lockedSourceY}
        sourceX={sourceRight + WIRE_GAP}
        targetX={panelLeft}
        targetY={viewportHeight / 2}
        viewportWidth={viewportWidth}
        viewportHeight={viewportHeight}
      />
      <motion.aside
        ref={panelRef}
        data-inner
        onClick={(e) => e.stopPropagation()}
        className={cns(
          'pointer-events-auto fixed top-1/2 right-content-outer-padded z-[51]',
          'w-experience-column-width cursor-default tablet-s:hidden',
        )}
        initial={{ opacity: 1, x: 0, y: '-50%' }}
        animate={{ opacity: 1, x: 0, y: '-50%' }}
        exit={{
          opacity: 0,
          x: 0,
          y: '-50%',
          transition: {
            duration: reduced ? 0 : FEED_EXIT_FADE_DURATION,
            delay: reduced
              ? 0
              : DATA_WIRE_DRAW_DURATION - FEED_EXIT_FADE_DURATION,
            ease: motionEase.exit,
          },
        }}
        transition={{ duration: 0.32, ease: motionEase.enter }}
      >
        <motion.div
          className={'relative border border-accent/45 bg-[#0f0602]'}
          initial={{ height: 0 }}
          animate={{ height: panelHeight }}
          exit={{ height: 0 }}
          transition={{
            duration: reduced ? 0 : 0.22,
            ease: motionEase.travel,
          }}
          onAnimationComplete={() =>
            setBorderBlinkKey((current) => current + 1)
          }
        >
          {isPresent && borderBlinkKey > 0 && (
            <DataCaptureBorder blinkKey={borderBlinkKey} />
          )}
          <div className={'h-full overflow-hidden'}>
            <FieldLabel
              tone={'system'}
              blockComment
              readout={<span aria-hidden>▚</span>}
              className={
                'mb-0 w-full shrink-0 justify-between border-b border-accent/25 px-3 py-[6px]'
              }
            >
              detail feed
            </FieldLabel>
            <div
              className={'overflow-hidden'}
              style={{ maxHeight: availableContentHeight }}
            >
              <motion.div ref={contentRef} style={{ y: contentY }}>
                <ExperienceDetailsContentTransition
                  entry={entry}
                  reduced={reduced}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.aside>
    </>,
    document.body,
  )
}

export const ExperienceDetailsDisclosure = ({
  entry,
  expanded,
  onExpandedChange,
  onCollapseComplete,
}: {
  entry: ExperienceEntry
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
              <ExperienceDetailsContent entry={entry} />
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
