'use client'

import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CardBody } from '@/components/CardBody'
import { JoinedAsset } from '@/types'

/** Deterministic rotation seeded from card ID — same card always tilts the same way. */
function seedRotation(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0
  return ((h % 600) - 300) / 100 // −3° to +3°
}

export function DraggableCard({ asset }: { asset: JoinedAsset }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: asset.state_id,
    data: asset,
  })

  const tilt = seedRotation(asset.state_id)

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(${tilt}deg) scale(1.08)`
      : undefined,
    zIndex:   isDragging ? 100 : 1,
    opacity:  isDragging ? 0.25 : 1,
    transition: isDragging ? 'none' : 'opacity 0.15s ease',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <CardBody asset={asset} />
    </div>
  )
}

interface DropZoneProps {
  id: string
  label?: string
  className?: string
  children?: React.ReactNode
}

export function DropZone({ id, label, className, children }: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`
        relative flex items-center justify-center rounded-xl
        transition-all duration-150
        ${isOver
          ? 'drop-target-active ring-2 ring-[rgba(0,220,200,0.6)] bg-[rgba(0,200,180,0.06)] border-[rgba(0,220,200,0.5)]'
          : 'bg-black/15 border border-[rgba(255,255,255,0.07)]'
        }
        ${className ?? ''}
      `}
    >
      {label && !children && (
        <span className="zone-label">{label}</span>
      )}
      {children}
    </div>
  )
}
