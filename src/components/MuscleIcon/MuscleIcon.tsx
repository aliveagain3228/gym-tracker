import * as Icons from 'lucide-react'

interface MuscleIconProps {
    name: string
    size?: number
    className?: string
}

export default function MuscleIcon({ name, size = 20, className = '' }: MuscleIconProps) {
    const IconComponent = Icons[name as keyof typeof Icons] as React.ComponentType<{
        size?: number
        className?: string
    }>

    if (!IconComponent) {
        return <Icons.Target size={size} className={className} />
    }

    return <IconComponent size={size} className={className} />
}