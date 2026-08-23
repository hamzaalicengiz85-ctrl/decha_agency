import { Link } from 'react-router-dom'
import Icon from './ui/Icon'

export default function ProjectCard({ project }) {
  const tags = Array.isArray(project.tags) ? project.tags : []

  return (
    <Link
      to={`/projeler/${project.slug}`}
      className="glass glass-hover group flex h-full flex-col overflow-hidden p-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[13px] bg-bg-elev">
        <img
          src={project.cover_url}
          alt={`${project.title} proje görseli`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-[900ms] ease-smooth group-hover:scale-[1.04]"
        />
        <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg">
          {project.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-fg">{project.title}</h3>
            <p className="eyebrow mt-1.5">
              {project.client} · {project.year}
            </p>
          </div>
          <Icon
            name="arrow"
            className="mt-1 h-4 w-4 shrink-0 text-fg-subtle transition duration-300 group-hover:translate-x-0.5 group-hover:text-accent"
          />
        </div>

        <p className="mt-4 flex-1 text-sm leading-relaxed text-fg-muted">{project.summary}</p>

        {tags.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border hairline px-2.5 py-1 text-[11px] text-fg-subtle"
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
