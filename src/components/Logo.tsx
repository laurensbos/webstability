interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  variant?: 'default' | 'white'
  className?: string
}

export default function Logo({ size = 'md', variant = 'default', className = '' }: LogoProps) {
  const sizes = {
    sm: { text: 'text-lg' },
    md: { text: 'text-xl' },
    lg: { text: 'text-2xl' },
  }
  
  const textColor = variant === 'white' ? 'text-white' : 'text-gray-900'
  const hoverColor = variant === 'white' ? 'hover:text-white/80' : 'hover:text-primary-600'
  
  // showText prop wordt genegeerd - we tonen altijd alleen tekst
  return (
    <div className={`flex items-center ${className}`} aria-label="Webstability">
      <span className={`font-display font-bold tracking-tight ${sizes[size].text} ${textColor} ${hoverColor} transition-colors`}>
        webstability
      </span>
    </div>
  )
}
