import { useState } from 'react'
import { motion } from 'framer-motion'
import { ImageOpenable } from 'ui/common/image-openable-modal/ImageOpenable'
import { VideoOpenable } from 'ui/common/video-openable-modal/VideoOpenable'
import { cns } from 'utils/formatters/classnames'
import { motionEase } from 'utils/anim/motion-ease'
import { prefersReducedMotion } from 'utils/browser/prefers-reduced-motion'
import { Link } from 'ui/common/typography/Link'
import {
  EXPERIENCE_STATUS_LABEL,
  type Credit,
  type ExperienceDetail as Detail,
  type ExperienceStatus,
} from './resume-data'

const cornerClass = 'absolute size-[7px] border-accent'

const Corners = () => (
  <>
    <span
      className={cns(
        cornerClass,
        'top-[-1px] left-[-1px] border-t-2 border-l-2',
      )}
    />
    <span
      className={cns(
        cornerClass,
        'top-[-1px] right-[-1px] border-t-2 border-r-2',
      )}
    />
    <span
      className={cns(
        cornerClass,
        'bottom-[-1px] left-[-1px] border-b-2 border-l-2',
      )}
    />
    <span
      className={cns(
        cornerClass,
        'right-[-1px] bottom-[-1px] border-r-2 border-b-2',
      )}
    />
  </>
)

const DataWire = ({ reduced }: { reduced: boolean }) => {
  const slideIn = reduced ? 0 : -16
  const transition = { duration: 0.32, ease: motionEase.enter }

  return (
    <motion.span
      aria-hidden
      className={cns(
        'pointer-events-none absolute top-1/2 left-full z-[3] -translate-y-1/2',
        'ml-[26px] block h-[7px] w-[54px]',
        'desktop-s:hidden',
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
    >
      <motion.span
        className={
          'absolute top-1/2 left-0 h-px w-full origin-left -translate-y-1/2 bg-[repeating-linear-gradient(to_right,var(--color-accent)_0_5px,transparent_5px_10px)] opacity-70'
        }
        initial={{ scaleX: reduced ? 1 : 0.7 }}
        animate={{ scaleX: 1 }}
        exit={{ scaleX: reduced ? 1 : 0.7 }}
        transition={transition}
      />
      <span
        className={
          'absolute top-1/2 left-0 size-[5px] -translate-x-1/2 -translate-y-1/2 border border-accent bg-base'
        }
      />
      <span
        className={
          'absolute top-1/2 left-full -translate-x-1/2 -translate-y-1/2'
        }
      >
        <motion.span
          className={'block size-[5px] border border-accent bg-base'}
          initial={{ x: slideIn, rotate: 45 }}
          animate={{ x: 0, rotate: 45 }}
          exit={{ x: slideIn, rotate: 45 }}
          transition={transition}
        />
      </span>
    </motion.span>
  )
}

const mediaClass =
  'block aspect-video w-full border border-edge object-cover'

const DetailBody = ({ detail }: { detail: Detail }) => {
  if (detail.kind === 'image') {
    return <ImageOpenable src={detail.src} className={mediaClass} />
  }

  if (detail.kind === 'video') {
    return (
      <VideoOpenable
        src={detail.src}
        poster={detail.poster}
        className={mediaClass}
      />
    )
  }

  return (
    <p className={'font-face-regular text-[14px] leading-[1.55] text-text'}>
      {detail.body}
    </p>
  )
}

const StatusCallout = ({ status }: { status: ExperienceStatus }) => (
  <div className={'border border-accent/50 bg-accent/[0.06] px-3 py-2'}>
    <div
      className={
        'flex items-center gap-[6px] font-face-regular text-[10px] tracking-[0.16em] text-accent uppercase'
      }
    >
      <span aria-hidden>⊘</span>
      {EXPERIENCE_STATUS_LABEL[status.kind]}
    </div>
    {status.note && (
      <p
        className={'mt-2 font-face-regular text-[13px] leading-[1.5] text-text'}
      >
        {status.note}
      </p>
    )}
  </div>
)

const CreditsBlock = ({ credits }: { credits: Credit[] }) => (
  <div className={'border border-edge px-3 py-2'}>
    <div
      className={
        'font-face-regular text-[10px] tracking-[0.16em] text-system uppercase'
      }
    >
      // credits
    </div>
    <ul className={'mt-2 font-face-regular text-[13px] leading-[1.6]'}>
      {credits.map((credit) => (
        <li key={credit.role + credit.name} className={'text-muted'}>
          <span className={'tracking-[0.08em] text-muted/70 uppercase'}>
            {credit.role}
          </span>
          {' — '}
          {credit.href ? (
            <Link
              href={credit.href}
              isExternal
              className={'link-dash text-text'}
            >
              {credit.name}
            </Link>
          ) : (
            <span className={'text-text'}>{credit.name}</span>
          )}
        </li>
      ))}
    </ul>
  </div>
)

export const ExperienceDetail = ({
  details,
  status,
  credits,
}: {
  details: Detail[]
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
          <Corners />
          <div
            className={
              'flex items-center justify-between border-b border-accent/25 px-3 py-[6px] font-face-regular text-[10px] tracking-[0.16em] text-system uppercase'
            }
          >
            <span>detail feed</span>
            <span aria-hidden>▚</span>
          </div>
          <div className={'flex flex-col gap-3 p-3'}>
            {status && <StatusCallout status={status} />}
            {details.map((detail, i) => (
              <div key={i} className={'flex flex-col gap-2'}>
                {detail.caption && (
                  <div
                    className={
                      'font-face-regular text-[10px] tracking-[0.12em] text-muted uppercase'
                    }
                  >
                    {detail.caption}
                  </div>
                )}
                <DetailBody detail={detail} />
              </div>
            ))}
            {credits && credits.length > 0 && (
              <CreditsBlock credits={credits} />
            )}
          </div>
        </div>
      </motion.aside>
    </>
  )
}
