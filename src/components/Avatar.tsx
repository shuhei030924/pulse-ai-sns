interface AvatarProps {
  initials: string
  color: string
  size?: 'sm' | 'md' | 'lg' | 'story'
  className?: string
  ring?: boolean
  online?: boolean
}

const sizes = {
  sm: 'h-8 w-8 text-[11px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-14 w-14 text-lg',
  story: 'h-[68px] w-[68px] text-lg',
}

export function Avatar({
  initials,
  color,
  size = 'md',
  className = '',
  ring,
  online,
}: AvatarProps) {
  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`inline-flex items-center justify-center rounded-full font-semibold text-white ${sizes[size]} ${
          ring ? 'ring-2 ring-line' : ''
        }`}
        style={{ background: color }}
        aria-hidden
      >
        {initials}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-online" />
      )}
    </div>
  )
}
