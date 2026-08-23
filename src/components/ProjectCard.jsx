import { Link } from 'react-router-dom'
import Icon from './ui/Icon'

export default function ProjectCard({ project }) {
  const tags = Array.isArray(project.tags) ? project.tags : []

  return (
    <Link
      to={`/projeler/${project.slug}`}
      className="panel panel-hover group flex h-full flex-col overflow-hidden"
    >
      {/* Dosya sekmesi */}
      <div className="flex items-center justify-between border-b border-line/20 bg-line/[0.05] px-4 py-2">
        <span className="num font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
          Dosya · {String(project.year ?? '').slice(-2)}-{project.slug.slice(0, 4).toUpperCase()}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent-ink">
          {project.category}
        </span>
      </div>

      {/* Monitör görüntüsü */}
      <div className="p-3">
        <div className="crt-screen screen-paper aspect-[16/10] bg-bg-soft">
          <img
            src={project.cover_url}
            alt={`${project.title} proje görseli`}
            loading="lazy"
            className="h-full w-full object-cover opacity-95 transition duration-500 group-hover:opacity-100"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[16px] font-bold uppercase text-fg">{project.title}</h3>
          <Icon
            name="arrow"
            className="mt-1 h-4 w-4 shrink-0 text-fg-subtle transition group-hover:text-accent-ink"
          />
        </div>
        <p className="eyebrow mt-1.5">
          {project.client} · {project.year}
        </p>

        <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-fg-muted">{project.summary}</p>

        {tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5 border-t border-dashed border-line/25 pt-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="border border-line/25 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-subtle"
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
