# Visual Guide - Graph Features

## Before (Original Design)

```
┌─────────────────────────────────┐
│ ░░░░░░ Title Bar (draggable) ░░░│  <- Semi-transparent, drag-only
└─────────────────────────────────┘
┌─────────────────────────────────┐
│                                 │
│                                 │
│         Graph Content           │  <- Fixed size
│      (Dygraph Canvas)           │
│                                 │
│                                 │
└─────────────────────────────────┘
```

**Limitations:**
- Fixed size (500x400 pixels)
- Takes up constant screen space
- Only draggable, not resizable
- No way to temporarily hide graphs

---

## After (New Design)

### Expanded State

```
┌─────────────────────────────────┐
│ ░░░░░░░░░░░ Title Bar ░░░░░░░ ▼│  <- Minimize button added
└─────────────────────────────────┘
┌─────────────────────────────────┐
│                                 │
│                                 │
│         Graph Content           │  <- Resizable
│      (Dygraph Canvas)           │
│                                 │
│                               ╱ │  <- Resize handle
└───────────────────────────────╱─┘     (bottom-right)
```

### Minimized State

```
┌─────────────────────────────────┐
│ ░░░░░░░░░░░ Title Bar ░░░░░░░ ▶│  <- Arrow points right
└─────────────────────────────────┘
     ^
     |
     Only title bar visible - graph content hidden
     Still draggable!
```

---

## Interactive Elements

### 1. Minimize Button (Top-Right of Title Bar)

```
Normal State:     ▼  (Down arrow)
Minimized State:  ▶  (Right arrow)

Hover: Cursor changes to pointer
Click: Toggles between expanded/minimized
```

### 2. Resize Handle (Bottom-Right Corner)

```
Visual appearance:
┌─────┐
│     │
│   ╱ │  <- 20x20px colored square
└──╱──┘     Cursor: ↘ (nwse-resize)

While dragging:
- Opacity increases (0.5 → 0.8)
- Graph resizes in real-time
- Dygraph updates continuously
```

### 3. Drag Handle (Title Bar)

```
Normal:   ░░░░░ opacity 0.3
Dragging: ▓▓▓▓▓ opacity 0.7

Cursor: move (↔)
Z-index: 100 → 1000 (brings to front while dragging)
```

---

## Multiple Graphs Layout Example

### Stage 1 - Four Graphs Expanded

```
Screen Layout (Right side of game):
                                     Browser Window Edge
                                            ↓
    ┌─────────────────┐   ┌─────────────────┐
    │ Clips Rate    ▼ │   │ Investments   ▼ │
    │                 │   │                 │
    │     Graph       │   │     Graph       │
    │                ╱│   │                ╱│
    └────────────────╱┘   └────────────────╱┘

    ┌─────────────────┐   ┌─────────────────┐
    │ Yomi          ▼ │   │ Revenue       ▼ │
    │                 │   │                 │
    │     Graph       │   │     Graph       │
    │                ╱│   │                ╱│
    └────────────────╱┘   └────────────────╱┘
```

### Same Graphs - Some Minimized

```
Screen Layout (More space available):
                                     Browser Window Edge
                                            ↓
    ┌─────────────────┐   ┌─────────────────┐
    │ Clips Rate    ▼ │   │ Investments   ▶ │ <- Minimized
    │                 │   └─────────────────┘
    │     Graph       │
    │                ╱│   ┌─────────────────┐
    └────────────────╱┘   │ Revenue       ▶ │ <- Minimized
                          └─────────────────┘
    ┌─────────────────┐
    │ Yomi          ▼ │
    │                 │
    │     Graph       │
    │                ╱│
    └────────────────╱┘
```

### Resized for Smaller Screen

```
All graphs made smaller to fit:

    ┌───────────┐  ┌───────────┐
    │ Clips   ▼ │  │ Invest  ▼ │
    │   Graph   │  │   Graph   │
    │          ╱│  │          ╱│
    └─────────╱─┘  └─────────╱─┘

    ┌───────────┐  ┌───────────┐
    │ Yomi    ▼ │  │ Revenue ▼ │
    │   Graph   │  │   Graph   │
    │          ╱│  │          ╱│
    └─────────╱─┘  └─────────╱─┘
```

---

## User Interactions

### To Minimize a Graph:
1. Locate the ▼ button in the top-right of the title bar
2. Click once
3. Graph collapses to title bar only
4. Button changes to ▶

### To Expand a Minimized Graph:
1. Locate the ▶ button in the title bar
2. Click once
3. Graph expands back to previous size
4. Button changes to ▼

### To Resize a Graph:
1. Move mouse to bottom-right corner of graph
2. Cursor changes to diagonal resize arrow (↘)
3. Click and drag to desired size
4. Release mouse button
5. Graph renders at new size

### To Move a Graph:
1. Click and hold on the title bar (avoid the ▼ button)
2. Drag to desired position
3. Release mouse button
4. Graph stays in new position

---

## Color Coding (by Stage)

**Stage 1 (Business Phase):**
- Green: Clips Rate
- Yellow: Investments
- Red: Yomi
- Blue: Revenue

**Stage 2 (Drone Phase):**
- Green: Activity/Drones
- Yellow: Matter Rate
- Red: Wire Rate

**Stage 3 (Probe Phase):**
- Green: Probes
- Yellow: Exploration
- Blue: Probe Rates

The border color of each graph matches its category color.

---

## Behavior Notes

✓ Minimized graphs continue to update data in the background
✓ Resizing a graph updates its visualization immediately
✓ All graphs maintain their position when page is scrolled
✓ Graphs can overlap (last clicked is on top)
✓ Minimum size constraints prevent graphs from becoming unusable
✓ All interactions work smoothly with no page refresh needed
