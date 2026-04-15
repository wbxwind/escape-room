'use client'

import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CardBody } from '@/components/CardBody'
import { JoinedAsset } from '@/types'

export function DraggableCard({ asset }: { asset: JoinedAsset }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: asset.state_id,
    data: asset,
  })

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.3 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
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
      className={`relative flex items-center justify-center rounded-xl transition-all
        ${isOver ? 'ring-2 ring-cyan-400 bg-cyan-950/20' : 'bg-black/20 border border-slate-800'}
        ${className}`}
    >
      {label && !children && (
        <span className="text-xs font-mono text-zinc-600 uppercase">{label}</span>
      )}
      {children}
    </div>
  )
}
