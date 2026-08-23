import type { ReactNode } from 'react'
import { cx } from '../lib/cx'
import type { PanelFocus } from '../types/portfolio'

interface PanelFrameProps {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
  panelId?: Exclude<PanelFocus, null>
  highlighted?: boolean
}

function PanelFrame({
  title,
  action,
  children,
  className,
  bodyClassName,
  panelId,
  highlighted = false,
}: PanelFrameProps) {
  return (
    <section
      className={cx('panel-frame flex min-h-0 flex-col rounded-sm', highlighted && 'panel-highlight', className)}
      data-panel={panelId}
    >
      <header className="relative z-10 flex shrink-0 items-start justify-between gap-3 border-b border-white/6 px-3 py-2.5 lg:px-4">
        <div>
          <p className="hud-label">{title}</p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      <div className={cx('relative z-10 min-h-0 flex-1 px-3 py-3 lg:px-4 lg:py-3.5', bodyClassName)}>{children}</div>
    </section>
  )
}

export default PanelFrame
