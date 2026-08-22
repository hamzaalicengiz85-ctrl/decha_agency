import { Link } from 'react-router-dom'
import Icon from './ui/Icon'

export default function ProjectCard({ project }) {
  const tags = Array.isArray(project.tags) ? project.tags : []

  return (
    <Link
      to={`/projeler/${project.slug}`}
      className="group surface surface-hover flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-800">
        <img
          src={project.cover_url}
          alt={`${project.title} proje görseli`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-ink-950/80 px-3 py-1 text-xs font-medium text-brand-200 backdrop-blur">
          {project.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">{project.title}</h3>
            <p className="mt-1 text-xs uppercase tracking-widest text-slate-500">
              {project.client} · {project.year}
            </p>
          </div>
          <Icon
            name="arrow"
            className="mt-1 h-5 w-5 shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-brand-400"
          />
        </div>

        <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-400">{project.summary}</p>

        {tags.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400"
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
