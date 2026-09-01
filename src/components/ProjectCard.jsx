import { Link } from 'react-router-dom'
import Icon from './ui/Icon'
import { fileCode, initials } from '../lib/initials'

/**
 * Proje dosya kartı. Fotoğraf kullanılmaz — kimlik, dosya kodu ve
 * tipografik bir künye alanıyla kurulur.
 */
export default function ProjectCard({ project }) {
  const tags = Array.isArray(project.tags) ? project.tags : []
  const metrics = Array.isArray(project.metrics) ? project.metrics : []

  return (
    <Link
      to={`/projeler/${project.slug}`}
      className="panel panel-hover brackets group flex h-full flex-col overflow-hidden"
    
      data-rec={`projects:${project.id ?? ''}`}
      data-rec-label={project.title}>
      {/* Dosya sekmesi */}
      <div className="flex items-center justify-between border-b border-accent/40 bg-accent/10 px-4 py-2">
        <span className="num font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          Dosya {fileCode(project.slug, project.year)}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
          {project.category}
        </span>
      </div>

      {/* Künye alanı: monogram + öne çıkan ölçüm */}
      <div className="relative flex items-center justify-between gap-4 border-b border-accent/30 px-4 py-6">
        <span className="phosphor relative font-display text-[2.4rem] font-bold leading-none tracking-[0.03em] text-accent">
          {initials(project.client || project.title)}
        </span>
        {metrics[0] ? (
          <span className="relative text-right">
            <span className="num block font-display text-xl font-bold text-fg">
              {metrics[0].value}
            </span>
            <span className="eyebrow mt-0.5 block">{metrics[0].label}</span>
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[15px] font-bold uppercase text-accent">{project.title}</h3>
          <Icon
            name="arrow"
            className="mt-0.5 h-4 w-4 shrink-0 text-accent/60 transition group-hover:text-accent"
          />
        </div>
        <p className="eyebrow mt-1.5">
          {project.client} · {project.year}
        </p>

        <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-fg-muted">{project.summary}</p>

        {tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5 border-t border-dashed border-accent/25 pt-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="border border-accent/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-fg-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  )
}
