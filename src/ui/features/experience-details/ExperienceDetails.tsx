import { useState } from 'react'
import { motion } from 'framer-motion'
import { CorneredBorder } from 'ui/common/cyber-kit/CorneredBorder'
import { DataWire } from 'ui/common/cyber-kit/DataWire'
import type {
  Credit,
  ExperienceDetail,
  ExperienceStatus,
} from 'ui/features/experience-data/types'
import { motionEase } from 'utils/anim/motion-ease'
import { prefersReducedMotion } from 'utils/browser/prefers-reduced-motion'
import { cns } from 'utils/formatters/classnames'
import { ExperienceDetailsBody } from './ExperienceDetailsBody'
import { ExperienceDetailsCredits } from './ExperienceDetailsCredits'
import { ExperienceDetailsStatus } from './ExperienceDetailsStatus'

export const ExperienceDetails = ({
  details,
  status,
  credits,
}: {
  details: ExperienceDetail[]
  status?: ExperienceStatus
  credits?: Credit[]
}) => {
  const [reduced] = useState(prefersReducedMotion)

  return (
    <>
      <DataWire reduced={reduced} />
      <motion.aside
        data-inner
        onClick={(e) => e.stopPropagation()}
        className={cns(
          'pointer-events-auto absolute top-1/2 left-full z-[2] cursor-default',
          'ml-[80px] w-[clamp(360px,50vw,600px)]',
          'desktop-s:hidden',
        )}
        initial={{ opacity: 0, x: reduced ? 0 : -16, y: '-50%' }}
        animate={{ opacity: 1, x: 0, y: '-50%' }}
        exit={{ opacity: 0, x: reduced ? 0 : -16, y: '-50%' }}
        transition={{ duration: 0.32, ease: motionEase.enter }}
      >
        <div className={'relative border border-accent/45 bg-base'}>
          <CorneredBorder />
          <div
            className={
              'flex items-center justify-between border-b border-accent/25 px-3 py-[6px] font-face-regular text-hint tracking-[0.16em] text-system uppercase'
            }
          >
            <span>detail feed</span>
            <span aria-hidden>▚</span>
          </div>
          <div className={'flex flex-col gap-3 p-3'}>
            {status && <ExperienceDetailsStatus status={status} />}
            {details.map((detail, i) => (
              <div key={i} className={'flex flex-col gap-2'}>
                {detail.caption && (
                  <div
                    className={
                      'font-face-regular text-hint tracking-[0.12em] text-muted uppercase'
                    }
                  >
                    {detail.caption}
                  </div>
                )}
                <ExperienceDetailsBody detail={detail} />
              </div>
            ))}
            {credits && credits.length > 0 && (
              <ExperienceDetailsCredits credits={credits} />
            )}
          </div>
        </div>
      </motion.aside>
    </>
  )
}
