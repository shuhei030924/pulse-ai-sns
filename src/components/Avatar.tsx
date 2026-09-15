interface AvatarProps {
  initials: string
  color: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  ring?: boolean
}

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
}

export function Avatar({ initials, color, size = 'md', className = '', ring }: AvatarProps) {
  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold text-void ${sizes[size]} ${ring ? 'ring-2 ring-lime/60' : ''} ${className}`}
      style={{
        background: `linear-gradient(145deg, ${color}, color-mix(in oklab, ${color} 60%, #1a1a22))`,
        boxShadow: `0 4px 14px -4px ${color}66`,
      }}
      aria-hidden
    >
      {initials}
    </div>
  )
}
