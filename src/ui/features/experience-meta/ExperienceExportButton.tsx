import { Button } from 'ui/controls/Button'
import { useExperienceDomainFilter } from 'ui/features/experience-data/experience-data-context'
import {
  resumeFileHref,
  resumeVariantFor,
} from 'ui/features/experience-data/experience-data'

export const ExperienceExportButton = () => {
  const { domainFilter } = useExperienceDomainFilter()
  const variant = resumeVariantFor(domainFilter)

  return (
    <Button
      field
      href={resumeFileHref(domainFilter)}
      download={variant.file}
      aria-label={`Download resume PDF — ${variant.title}`}
    >
      Export dossier — strip aesthetic layer for HR
    </Button>
  )
}
