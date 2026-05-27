import type { MuscleGroup } from "../../types";

interface MuscleBodySvgProps {
    muscleGroup: MuscleGroup
    className?: string
}

const HIGHLIGHT: Record<MuscleGroup, string> = {
    chest:    '#ef4444',
    back:     '#3b82f6',
    shoulders:'#f97316',
    biceps:   '#a855f7',
    triceps:  '#8b5cf6',
    legs:     '#22c55e',
    core:     '#eab308',
    fullBody: '#6366f1',
}

const BASE = '#334155'

export default function MuscleBodySvg({ muscleGroup, className = '' }: MuscleBodySvgProps) {
    const h = HIGHLIGHT[muscleGroup]
    const b = BASE

    const is = (group: MuscleGroup | MuscleGroup[]) =>
        Array.isArray(group)
    ? group.includes(muscleGroup) || muscleGroup === 'fullBody'
            : muscleGroup === group || muscleGroup === 'fullBody'

    return (
        <svg
            viewBox="0 0 60 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <circle cx ="30" cy="9" r="7" fill={b} />

            <rect x="27" y="15" width="6" height="5" rx="1" fill={b} />

            <ellipse cx="15" cy="23" rx="7" ry="5"
                     fill={is('shoulders') ? h : b} />

            <ellipse cx="45" cy="23" rx="7" ry="5"
                     fill={is('shoulders') ? h : b} />

            <path d="M20 19 L40 19 L43 36 L17 36 Z" rx="2"
                  fill={is('chest') ? h : b} />

            {muscleGroup === 'back' && (
                <path d="M20 19 L40 19 L43 36 L17 36 Z"
                      fill={h} opacity="0.9" />
            )}

            <rect x="7" y="20" width="9" height="19" rx="4"
                  fill={is(['biceps', 'triceps']) ? h : b} />

            <rect x="44" y="20" width="9" height="19" rx="4"
                  fill={is(['biceps', 'triceps']) ? h : b} />

            <rect x="6" y="40" width="8" height="15" rx="4"
                  fill={b} />
            <rect x="46" y="40" width="8" height="15" rx="4"
                  fill={b} />

            <rect x="18" y="36" width="24" height="16" rx="3"
                  fill={is('core') ? h : b} />

            <path d="M18 52 L42 52 L39 62 L21 62 Z" fill={is('legs') ? h : b} />

            <rect x="19" y="61" width="10" height="19" rx="5" fill={is('legs') ? h : b} />
            <rect x="31" y="61" width="10" height="19" rx="5" fill={is('legs') ? h : b} />

            <rect x="20" y="81" width="8" height="15" rx="4" fill={is('legs') ? h : b} />
            <rect x="32" y="81" width="8" height="15" rx="4" fill={is('legs') ? h : b} />
        </svg>
    )
}