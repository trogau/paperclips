# Dygraph Graph Features - Resizable and Minimizable

This document describes the new resize and minimize features added to the dygraph graphs in the Paperclips automation script.

## New Features

### 1. Minimize/Expand Toggle

Each graph now has a minimize button in its title bar that allows you to collapse the graph to just its title bar.

**How it works:**
- Click the arrow button (▼) in the title bar to minimize the graph
- When minimized, the arrow changes to (▶) and the graph content is hidden
- Click again to expand and restore the graph
- **Graphs remain draggable even when minimized**
- Data continues to update in the background while minimized

**Visual Indicators:**
- ▼ = Expanded (graph visible)
- ▶ = Minimized (only title bar visible)
- The arrow rotates smoothly when toggling

### 2. Resizable Graphs

Graphs can now be resized by dragging the resize handle in the bottom-right corner.

**How it works:**
- Hover over the bottom-right corner of any graph to see the resize cursor (↘)
- Click and drag to resize the graph to your desired dimensions
- The graph automatically adjusts its visualization to fit the new size
- Minimum size: 200px width x 150px height

**Implementation Details:**
- The dygraph `resize()` method is called during and after resizing
- A small delay (50ms) after resizing ensures proper graph rendering
- Resize handle becomes more visible (opacity increases) while dragging

### 3. Draggable Graphs (Existing Feature - Enhanced)

The existing drag functionality has been enhanced to work seamlessly with the new features:
- Drag by clicking anywhere on the title bar (except the minimize button)
- Title bar becomes more visible while dragging (opacity increases to 0.7)
- Graphs stay within viewport bounds while dragging

## Technical Implementation

### Modified Function: `createDraggableGraph()`

**Location:** lines 1870-2072 in `paperclips.js`

**Key Changes:**

1. **Title Bar Enhancement:**
   - Added flex layout to title bar
   - Added minimize button with event handling
   - Prevented drag events when clicking minimize button

2. **Resize Handle:**
   - Added 20x20px resize handle in bottom-right corner
   - Implemented mouse event handlers for resizing
   - Added minimum size constraints

3. **Dygraph Instance Storage:**
   - Added `setDygraphInstance()` method to wrapper element
   - Stores reference to dygraph object for resize callbacks

4. **State Management:**
   - Tracks minimize state (isMinimized, savedHeight)
   - Tracks resize state (isResizing, startX, startY, startWidth, startHeight)
   - Tracks drag state (isDragging, offsetX, offsetY)

### Updated Graph Functions

All graph creation functions have been updated to store the dygraph instance:

**Stage 1 Graphs:**
- `graphClipRates()` - Clips and Wire Growth Rate
- `graphInvestments()` - Investments Growth
- `graphYomi()` - Yomi metrics
- `graphRevenue()` - Revenue tracking

**Stage 2 Graphs:**
- `graphDrones()` - Activity/Clip Rate
- `graphMatterRate()` - Matter Rate
- `graphWireRate()` - Wire Rate

**Stage 3 Graphs:**
- `graphExploration()` - Exploration Rate
- `graphProbes()` - Total Probe Metrics
- `graphProbeRates()` - Probe change rates

**Pattern used in all graph functions:**
```javascript
var g = new Dygraph(document.getElementById("graphDivId"), data, options);

// Store dygraph instance in the wrapper for resize functionality
var wrapper = document.getElementById("graphDivId").parentElement;
if (wrapper && wrapper.setDygraphInstance) {
  wrapper.setDygraphInstance(g);
}
```

## DOM Structure

Each graph has the following structure:

```
wrapper (position: absolute)
├── dragHandle (title bar with minimize button)
│   ├── spacer (flex: 1)
│   └── minimizeButton (▼/▶)
├── container (the graph div with id)
│   └── [dygraph canvas elements]
└── resizeHandle (bottom-right corner)
```

## Browser Compatibility

The implementation uses standard DOM APIs and CSS that work in all modern browsers:
- `addEventListener()` for events
- CSS flexbox for layout
- CSS transforms for button rotation
- Standard mouse events (mousedown, mousemove, mouseup)

## Usage in Paperclips Game

1. Load the game at https://www.decisionproblem.com/paperclips/
2. Open browser console (F12)
3. Paste and run the updated `paperclips.js` script
4. Graphs will appear with the new resize and minimize features
5. Interact with graphs as needed to fit your screen resolution

## Benefits

1. **Better Screen Space Management:** Minimize graphs you don't need to see constantly
2. **Flexible Sizing:** Adjust graph sizes to fit your monitor and preferences
3. **Improved Multi-tasking:** Keep graphs visible while working with other tools
4. **Maintains Functionality:** Data updates continue even when graphs are minimized
5. **Responsive Design:** Graphs adapt to different screen resolutions

## Notes

- Graphs continue to update their data even when minimized (intervals keep running)
- Resizing triggers dygraph's `resize()` method to redraw the graph correctly
- There may be a small delay (up to the interval time) before a resized graph fully updates
- Minimum graph size is enforced to prevent usability issues (200x150 pixels)
- All features work independently - you can resize, minimize, and drag in any order
