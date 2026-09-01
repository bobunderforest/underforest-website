import { useMemo } from 'react'
import {
  ScrollReadoutGroupContext,
  useRegisterScrollReadout,
} from 'ui/fx/scroll-readout-context'
import { ScrollStageContext } from 'ui/fx/scroll-stage-context'
import { StickyViewportLayer } from 'ui/fx/StickyViewportLayer'
import { cns } from 'utils/formatters/classnames'
import type { StickyScrollLayer } from 'utils/hooks/useStickyScrollLayer'

type Props = React.BaseProps & {
  scroll: StickyScrollLayer
  id?: string
  style?: React.CSSProperties
  stageClassName?: string
  stageInFront?: boolean
  inFlow?: React.ReactNode
  debugLabel?: string
}

export const StickyScrollSection = ({
  scroll,
  id,
  className,
  style,
  stageClassName,
  stageInFront,
  inFlow,
  debugLabel,
  children,
}: Props) => {
  const { sectionRef, stageRef, inView, scrollYProgress } = scroll
  const readoutPath = useRegisterScrollReadout({
    label: debugLabel,
    progress: scrollYProgress,
  })
  const stage = useMemo(() => ({ active: inView, scroll }), [inView, scroll])

  return (
    <ScrollStageContext.Provider value={stage}>
      <ScrollReadoutGroupContext.Provider value={readoutPath}>
        <div
          id={id}
          ref={sectionRef}
          className={cns('isolate', className)}
          style={style}
        >
          {inFlow}
          <StickyViewportLayer
            stageRef={stageRef}
            hidden={!inView}
            inFront={stageInFront}
            className={stageClassName}
          >
            {children}
          </StickyViewportLayer>
        </div>
      </ScrollReadoutGroupContext.Provider>
    </ScrollStageContext.Provider>
  )
}
