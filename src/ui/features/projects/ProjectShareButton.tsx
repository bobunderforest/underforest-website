import { useEffect, useRef, useState } from 'react'
import { Button } from 'ui/controls/Button'
import type { ProjectEntry } from 'ui/features/experience-data/types'
import { copyToClipboard } from 'utils/browser/clipboard'

const RESET_MS = 2000

export const ProjectShareButton = ({
  entry,
  className,
}: {
  entry: ProjectEntry
  className?: string
}) => {
  const [copied, setCopied] = useState(false)
  const resetRef = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(resetRef.current), [])

  const copyLink = async () => {
    const url = new URL(`/projects/${entry.id}`, window.location.origin).href
    if (!(await copyToClipboard(url))) return

    setCopied(true)
    window.clearTimeout(resetRef.current)
    resetRef.current = window.setTimeout(() => setCopied(false), RESET_MS)
  }

  return (
    <Button
      compact
      dither
      accent={'bone'}
      onClick={copyLink}
      className={className}
      aria-label={`Copy link to ${entry.title}`}
    >
      {copied ? 'Link copied' : 'Copy link'}
    </Button>
  )
}
