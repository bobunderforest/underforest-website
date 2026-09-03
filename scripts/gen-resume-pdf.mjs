import { createWriteStream } from 'node:fs'
import { mkdir, readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import PDFDocument from 'pdfkit'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = join(root, 'public', 'resume')

const readJson = async (relativePath) =>
  JSON.parse(await readFile(join(root, relativePath), 'utf8'))

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const formatMonth = (value) => {
  const [year, month] = String(value).split('-')
  if (!month) return year
  return `${MONTHS[Number(month) - 1]} ${year}`
}

const formatPeriod = (from, to) =>
  formatMonth(from) === formatMonth(to)
    ? formatMonth(from)
    : `${formatMonth(from)} — ${formatMonth(to)}`

const durationLabel = (from, to) => {
  const [fy, fm] = String(from).split('-').map(Number)
  const [ty, tm] = String(to).split('-').map(Number)
  if (!fm || !tm) return ''
  const months = (ty - fy) * 12 + (tm - fm) + 1
  if (months <= 1) return ''
  if (months < 12) return `${months} mo`
  const years = Math.floor(months / 12)
  const rest = months % 12
  return rest ? `${years} yr ${rest} mo` : `${years} yr`
}

const periodYear = (value) => String(value ?? '').match(/\d{4}/)?.[0] ?? ''

const matchesDomain = (domains, domain) =>
  domain === 'unified' || (domains ?? []).includes(domain)

const SKILL_AREAS = [
  'Engine & gameplay',
  'Graphics & real-time',
  'Web & frontend',
  'Backend & data',
  'Web3',
  'Tooling',
]

const groupSkills = (skills, domain) => {
  const selected = skills.filter((skill) =>
    matchesDomain(skill.domains, domain),
  )
  const areas = [
    ...new Set([
      ...SKILL_AREAS,
      ...selected.map((skill) => skill.area).filter(Boolean),
    ]),
  ]
  return areas
    .map((area) => ({
      title: area,
      items: selected.filter((skill) => skill.area === area),
    }))
    .filter((group) => group.items.length)
}

const entryHeadline = (entry) => {
  if (entry.break) return 'Career break'
  return [entry.role, entry.place].filter(Boolean).join(' — ')
}

const entryMeta = (entry) => {
  const period = formatPeriod(entry.from, entry.to)
  const duration = durationLabel(entry.from, entry.to)
  return [entry.employment, duration ? `${period} (${duration})` : period]
    .filter(Boolean)
    .join(' · ')
}

const SIZE = {
  name: 21,
  title: 11,
  section: 11,
  entry: 11,
  body: 9.5,
}

const COLOR = {
  text: '#111111',
  muted: '#444444',
}

const PAGE_MARGIN = 52

const stripProtocol = (url) => url.replace(/^https?:\/\/(www\.)?/, '')
const linkDomain = (url) => stripProtocol(url).replace(/\/$/, '').split('/')[0]

const resolveLinks = (item, hrefLabel) => {
  const seen = new Set()
  const out = []
  const add = (label, href) => {
    if (!href || seen.has(href)) return
    seen.add(href)
    out.push({ label, href })
  }
  if (item.href) add(hrefLabel ?? linkDomain(item.href), item.href)
  for (const link of item.links ?? []) add(link.label, link.href)
  return out
}

const buildDocument = ({ variant, data, socials, doc }) => {
  const contentWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right

  const paragraph = (text, options = {}) => {
    doc
      .font(options.bold ? 'Helvetica-Bold' : 'Helvetica')
      .fontSize(options.size ?? SIZE.body)
      .fillColor(options.color ?? COLOR.text)
      .text(text, { width: contentWidth, lineGap: 1.5, ...options })
  }

  const sectionHeading = (text, reserve = 0) => {
    if (reserve) keepTogether(SIZE.section * 3.5 + reserve)
    doc.moveDown(0.9)
    paragraph(text.toUpperCase(), {
      bold: true,
      size: SIZE.section,
      characterSpacing: 0.8,
    })
    doc
      .moveTo(doc.page.margins.left, doc.y + 3)
      .lineTo(doc.page.margins.left + contentWidth, doc.y + 3)
      .lineWidth(0.75)
      .strokeColor('#999999')
      .stroke()
    doc.moveDown(0.55)
  }

  const bullets = (lines) => {
    lines.forEach((line) => {
      paragraph(`•  ${line}`, {
        indent: 6,
        color: COLOR.text,
      })
    })
  }

  const measureText = (text, options = {}) => {
    doc
      .font(options.bold ? 'Helvetica-Bold' : 'Helvetica')
      .fontSize(options.size ?? SIZE.body)
    return doc.heightOfString(text, {
      width: contentWidth,
      lineGap: 1.5,
      ...options,
    })
  }

  const keepTogether = (height) => {
    const bottom = doc.page.height - doc.page.margins.bottom
    const atPageTop = doc.y <= doc.page.margins.top + 1
    if (!atPageTop && doc.y + height > bottom) doc.addPage()
  }

  const linkRow = (items) => {
    if (!items.length) return
    doc.font('Helvetica').fontSize(SIZE.body).fillColor(COLOR.muted)
    items.forEach((item, index) => {
      const isLast = index === items.length - 1
      doc.text(item.label, {
        width: contentWidth,
        lineGap: 1.5,
        continued: !isLast,
        link: item.href,
        underline: true,
      })
      if (!isLast)
        doc.text('  ·  ', { continued: true, link: null, underline: false })
    })
  }

  const asideText = (entry) => {
    const body = (entry.resume?.summary ?? entry.summary ?? []).join(' ')
    const period = entry.periodLabel ?? formatPeriod(entry.from, entry.to)
    return period ? `${period} — ${body}` : body
  }

  const measureEntry = (entry) => {
    const summary = entry.resume?.summary ?? entry.summary ?? []
    const skills = entry.resume?.skills ?? entry.skills
    const links = resolveLinks(entry)
    const linksHeight = links.length
      ? measureText(links.map((link) => link.label).join('  ·  '))
      : 0
    if (entry.aside) {
      const labelHeight = entry.asideLabel
        ? measureText(entry.asideLabel, { bold: true, size: SIZE.entry })
        : 0
      return (
        labelHeight + measureText(asideText(entry)) + linksHeight + SIZE.body
      )
    }
    let height = measureText(entryHeadline(entry), {
      bold: true,
      size: SIZE.entry,
    })
    height += linksHeight
    height += measureText(entryMeta(entry))
    height += SIZE.body * 0.4
    summary.forEach((line) => {
      height += measureText(`•  ${line}`, { indent: 6 })
    })
    if (skills?.length) height += measureText(`Skills: ${skills.join(', ')}`)
    return height + SIZE.body
  }

  const measureProject = (project) => {
    const name = (project.label || project.place || project.id).replace(
      /\n/g,
      ' ',
    )
    const year = periodYear(project.period ?? project.from)
    const links = resolveLinks(project, 'Demo')
    let height = measureText(`${name}${year ? `  (${year})` : ''}`, {
      bold: true,
    })
    height += measureText(project.resumeNote)
    if (links.length)
      height += measureText(links.map((link) => link.label).join('  ·  '))
    return height + SIZE.body
  }

  paragraph(data.name, { bold: true, size: SIZE.name })
  doc.moveDown(0.2)
  paragraph(variant.title, { size: SIZE.title, color: COLOR.muted })

  if (data.location) {
    doc.moveDown(0.15)
    paragraph(data.location, { color: COLOR.muted })
  }

  const contacts = [
    data.email && { label: data.email, link: `mailto:${data.email}` },
    data.phone && { label: data.phone },
    data.site && { label: stripProtocol(data.site), link: data.site },
    ...socials
      .filter((social) => ['linkedin', 'github'].includes(social.label))
      .map((social) => ({
        label: stripProtocol(social.href),
        link: social.href,
      })),
  ].filter(Boolean)

  doc.moveDown(0.35)
  doc.font('Helvetica').fontSize(SIZE.body).fillColor(COLOR.muted)
  contacts.forEach((contact, index) => {
    const isLast = index === contacts.length - 1
    doc.text(contact.label, {
      width: contentWidth,
      lineGap: 1.5,
      continued: !isLast,
      link: contact.link ?? null,
      underline: Boolean(contact.link),
    })
    if (!isLast)
      doc.text('  ·  ', { continued: true, link: null, underline: false })
  })

  sectionHeading('Summary')
  variant.summary.forEach((text, index) => {
    if (index > 0) doc.moveDown(0.35)
    paragraph(text)
  })

  sectionHeading('Skills')
  groupSkills(data.skills, variant.domain).forEach((group) => {
    const label = `${group.title}: `
    doc.font('Helvetica-Bold').fontSize(SIZE.body).fillColor(COLOR.text)
    doc.text(label, { width: contentWidth, continued: true })
    doc.font('Helvetica')
    doc.text(group.items.map((skill) => skill.label).join(', '), {
      width: contentWidth,
      lineGap: 1.5,
    })
    doc.moveDown(0.15)
  })

  sectionHeading('Experience')
  data.experience
    .filter((entry) =>
      entry.resumeVariants
        ? entry.resumeVariants.includes(variant.domain)
        : matchesDomain(entry.domains, variant.domain),
    )
    .filter((entry) => !(entry.break && variant.domain !== 'web'))
    .forEach((entry, index) => {
      if (index > 0) doc.moveDown(0.65)
      keepTogether(measureEntry(entry))

      if (entry.aside) {
        if (entry.asideLabel) {
          paragraph(entry.asideLabel, { bold: true, size: SIZE.entry })
        }
        doc.font('Helvetica-Oblique').fontSize(SIZE.body).fillColor(COLOR.muted)
        doc.text(asideText(entry), { width: contentWidth, lineGap: 1.5 })
        const asideLinks = resolveLinks(entry)
        if (asideLinks.length) {
          doc.moveDown(0.15)
          linkRow(asideLinks)
        }
        return
      }

      paragraph(entryHeadline(entry), { bold: true, size: SIZE.entry })
      linkRow(resolveLinks(entry))
      paragraph(entryMeta(entry), { color: COLOR.muted })
      doc.moveDown(0.25)
      bullets(entry.resume?.summary ?? entry.summary ?? [])
      const entrySkills = entry.resume?.skills ?? entry.skills
      if (entrySkills?.length) {
        paragraph(`Skills: ${entrySkills.join(', ')}`, { color: COLOR.muted })
      }
    })

  const experienceById = new Map(
    data.experience.map((entry) => [entry.id, entry]),
  )

  const resumeProjects = (data.projects ?? [])
    .map((project) => ({
      ...(project.dataFromExperience ? experienceById.get(project.id) : {}),
      ...project,
    }))
    .filter(
      (project) =>
        project.resumeNote && matchesDomain(project.domains, variant.domain),
    )
  if (resumeProjects.length) {
    sectionHeading('Notable Projects', measureProject(resumeProjects[0]))
    resumeProjects.forEach((project, index) => {
      if (index > 0) doc.moveDown(0.4)
      const name = (project.label || project.place || project.id).replace(
        /\n/g,
        ' ',
      )
      const year = periodYear(project.period ?? project.from)
      doc.font('Helvetica-Bold').fontSize(SIZE.body).fillColor(COLOR.text)
      doc.text(name, { width: contentWidth, continued: Boolean(year) })
      if (year) {
        doc.font('Helvetica').fillColor(COLOR.muted)
        doc.text(`  (${year})`, { width: contentWidth, lineGap: 1.5 })
      }
      paragraph(project.resumeNote)
      linkRow(resolveLinks(project, 'Demo'))
    })
  }

  sectionHeading('Education')
  data.education.forEach((entry, index) => {
    if (index > 0) doc.moveDown(0.5)
    paragraph(`${entry.degree}, ${entry.field}`, { bold: true })
    paragraph(
      `${entry.place}, ${entry.location} · ${entry.from} — ${entry.to}`,
      { color: COLOR.muted },
    )
  })

  sectionHeading('Languages')
  paragraph(
    data.languages
      .map((line) => [line.term, line.value].filter(Boolean).join(' — '))
      .join('  ·  '),
  )
}

const writeVariant = async ({ domain, variant, data, socials }) => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: {
      top: PAGE_MARGIN,
      bottom: PAGE_MARGIN,
      left: PAGE_MARGIN,
      right: PAGE_MARGIN,
    },
    info: {
      Title: `${data.name} — ${variant.title}`,
      Author: data.name,
      Subject: variant.summary.join(' '),
      Keywords: data.skills
        .filter((skill) => matchesDomain(skill.domains, domain))
        .map((skill) => skill.label)
        .join(', '),
    },
    lang: 'en-US',
    pdfVersion: '1.7',
    tagged: true,
    displayTitle: true,
  })

  const target = join(outputDir, variant.file)
  const stream = createWriteStream(target)
  doc.pipe(stream)
  buildDocument({ variant: { ...variant, domain }, data, socials, doc })
  doc.end()

  await new Promise((done, fail) => {
    stream.on('finish', done)
    stream.on('error', fail)
  })

  return target
}

export const generateResumePdfs = async () => {
  const [experience, resume, socials, projects] = await Promise.all([
    readJson('src/app-data/experience.json'),
    readJson('src/app-data/resume.json'),
    readJson('src/app-data/socials.json'),
    readJson('src/app-data/projects.json'),
  ])

  await mkdir(outputDir, { recursive: true })

  const data = {
    ...experience,
    name: resume.name,
    ...resume,
    projects: projects.projects,
  }

  return Promise.all(
    Object.entries(resume.variants).map(([domain, variant]) =>
      writeVariant({ domain, variant, data, socials }),
    ),
  )
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1])
) {
  const files = await generateResumePdfs()
  files.forEach((file) => console.log(`resume pdf → ${file}`))
}
