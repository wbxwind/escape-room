# Agent Directive: Fix Deck Input/Draw Race Condition

## The Problem
Currently, the `components/Deck.tsx` interaction fails when clicking the deck to draw after typing a number. 

**Why it's failing:** 
The card uses an `onClick` event to detect the draw action. In the browser event lifecycle, when you click outside an active `<input>`, the standard `blur` event fires *before* the `click` event. 
1. User types in input.
2. User clicks the deck wrapper.
3. Input registers `onBlur` -> `setIsFocused(false)`.
4. Deck wrapper registers `onClick` -> `handleCardClick` checks `isFocused` (which is now `false`), so instead of submitting, it just calls `.focus()` again!

*This is why the user has to do a weird drag-release to avoid triggering a blur, or why clicking normally does nothing!*

## The Solution

To fix this, we must intercept the interaction *before* the browser blurs the input. We do this by changing `onClick` to `onMouseDown`, which fires at the very beginning of the interaction cycle, while the input is still fully focused.

### Task: Modify `components/Deck.tsx`

1. **Swap `onClick` for `onMouseDown`:**
   Find the root `<div className="card-base ...">` and change its click handler:
   ```tsx
   // Change this:
   onClick={handleCardClick}
   
   // To this:
   onMouseDown={handleCardClick}
   ```

2. **Prevent Event Fighting in the Handler:**
   Update the `handleCardClick` function so it calls `e.preventDefault()`. Since `mousedown` is what normally causes the browser to shift focus and trigger `blur`, calling `preventDefault()` intercepts that default browser DOM behavior, ensuring our React state stays perfectly synced without race conditions.

   Replace `handleCardClick` with exactly this:
   ```tsx
   const handleCardClick = (e: React.MouseEvent) => {
     // If the click is on the input itself, let the user type, don't draw.
     if ((e.target as HTMLElement).tagName === 'INPUT') {
       return
     }

     // Prevent the mousedown from firing a browser-level blur on the input
     e.preventDefault()

     if (!isFocused) {
       inputRef.current?.focus()
     } else {
       submitDraw()
     }
   }
   ```

### Verification
Once the agent applies this, the flow will be perfect:
1. Click the deck once -> Focuses.
2. Type a number.
3. Click the deck anywhere (not on the input text) -> Instantly triggers `submitDraw()`.
