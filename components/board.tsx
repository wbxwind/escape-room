'use client'

import { useDraggable, useDroppable, useDndContext } from '@dnd-kit/core'
import { CardBody } from '@/components/CardBody'
import { JoinedAsset, resolveCardType, PANORAMA_TYPES, ACTION_TYPES } from '@/types'

function seedRotation(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0
  return ((h % 600) - 300) / 100 // −3° to +3°
}

interface DraggableCardProps {
  asset: JoinedAsset
  isFlipping?: boolean
  isBurst?: boolean
}

export function DraggableCard({ asset, isFlipping, isBurst }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: asset.state_id,
    data: asset,
  })

  const tilt = seedRotation(asset.state_id)

  const style: React.CSSProperties = {
    position: 'relative',
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(${tilt}deg) scale(1.08)`
      : undefined,
    zIndex:   isDragging ? 100 : 1,
    opacity:  isDragging ? 0.25 : 1,
    transition: isDragging ? 'none' : 'opacity 0.15s ease',
  }

  const shouldFlip = !isDragging && isFlipping

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing ${shouldFlip ? 'card-flip-wrapper' : ''}`}
    >
      <div className={shouldFlip ? 'card-flipping' : ''}>
        <CardBody asset={asset} />
      </div>
      {isBurst && !isDragging && <div className="card-drawn-burst-overlay" />}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────

interface DropZoneProps {
  id: string
  label?: string
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  /** Items currently occupying this slot (panorama slots only) */
  slotItems?: JoinedAsset[]
  /** Trigger the notch-snap glow animation */
  snapGlow?: boolean
}

export function DropZone({ id, label, className, style, children, slotItems, snapGlow }: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id })
  const { active } = useDndContext()

  const activeAsset = active?.data.current as JoinedAsset | undefined
  const activeType  = activeAsset ? resolveCardType(activeAsset) : null

  const isPanoramaSlot   = id.startsWith('panorama-')
  const slotHasSituation = slotItems?.some(i => PANORAMA_TYPES.has(resolveCardType(i))) ?? false

  const isWindowDrag = activeType === 'WINDOW' || activeType === 'ACTION_WINDOW'
  const isNotchDrag  = activeType === 'NOTCH'  || activeType === 'ACTION_NOTCH'
  const isActionDrag = activeType ? ACTION_TYPES.has(activeType) : false
  const isPanoDrag   = activeType ? PANORAMA_TYPES.has(activeType) : false

  // Whether this slot could accept the current drag type (even when not hovering)
  let isValidTarget = !isPanoramaSlot  // non-panorama zones are always fair game
  if (isPanoramaSlot && activeType) {
    if (isPanoDrag)        isValidTarget = !slotHasSituation  // empty slots for situations
    else if (isActionDrag) isValidTarget = slotHasSituation   // occupied slots for actions
    else                   isValidTarget = false
  }

  // Active hover color
  const hoverClass = isOver && isValidTarget
    ? isNotchDrag  ? 'drop-target-notch'
    : isWindowDrag ? 'drop-target-window'
    : 'drop-target-active'
    : ''

  // Subtle tint for valid-but-not-hovered panorama slots
  const hintClass = !isOver && isValidTarget && isPanoramaSlot && activeType
    ? 'drop-valid-hint'
    : ''

  // Window overlay: glass frame preview when Window card hovers a Situation slot
  const showWindowOverlay = isPanoramaSlot && isOver && isWindowDrag && slotHasSituation

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative flex items-center justify-center rounded-xl border
        bg-black/15 border-[rgba(255,255,255,0.07)]
        transition-all duration-150
        ${snapGlow ? 'notch-snap-glow' : ''}
        ${hoverClass} ${hintClass}
        ${className ?? ''}
      `}
    >
      {label && !children && (
        <span className="zone-label">{label}</span>
      )}
      {children}
      {showWindowOverlay && <div className="window-overlay-preview" />}
    </div>
  )
}
