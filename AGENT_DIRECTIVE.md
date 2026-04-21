# Agent Directive: Deck Interaction Bugfix

## Objective
The `components/Deck.tsx` currently has an interaction bug. The user notices that if they `mousedown` on the `<input>` element and drag out, releasing `mouseup` (firing `onClick`) on the main card container, it instantly triggers a draw. It should only trigger a draw on an explicit direct click/tap against the deck background itself.

## The Bug
The `onClick` handler on the outmost `div.card-base` fires on `mouseup` as long as both down/up events happen inside the container. Since the input is an internal child, a drag gesture starting on the input and terminating on the background will cause `(e.target as HTMLElement).tagName === 'INPUT'` to evaluate as `false`, immediately executing `submitDraw()`.

## Instructed Changes

Open `components/Deck.tsx` and refactor the click detection strategy to be instantaneous and precise:

1. **Swap `onClick` to `onMouseDown`:**
   On the root `.card-base` `div`, locate `onClick={handleCardClick}` and change it to `onMouseDown={handleCardClick}`. This ensures the action triggers instantly the moment the mouse presses down, rather than waiting for a release, completely eliminating "drag-and-release" bleeding from inputs.

2. **Halt Input Event Bubbling:**
   To prevent `onMouseDown` from bubbling up when the user explicitly clicks inner form elements (like the text input), add an `onMouseDown` handler to the `<form>` wrapper that immediately calls `.stopPropagation()`.

```tsx
// 1. In your root Deck render:
<div
  className={`...`}
  style={{ ... }}
  onMouseDown={handleCardClick} // <--- Change from onClick
>
```

```tsx
// 2. Around line 105, update the form wrapper:
<form
  onSubmit={handleSubmit}
  onMouseDown={(e) => e.stopPropagation()} // <--- Add this to swallow clicks on the overlay
  className={`...`}
>
```

3. **Simplify `handleCardClick`:**
   Since the `<form>` now completely swallows all mouse events targeted at the input, `handleCardClick` will only ever be fired when clicking hitting the actual grey deck background. You can safely remove the `e.target` check.

```typescript
// Replace the old handleCardClick with this simpler version:
const handleCardClick = (e: React.MouseEvent) => {
  if (!isFocused) {
    inputRef.current?.focus()
  } else {
    submitDraw()
  }
}
```

Please execute these logic swaps in `components/Deck.tsx`.
