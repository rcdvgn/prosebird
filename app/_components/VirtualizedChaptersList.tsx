import React, { useState } from "react";
// @ts-ignore
import { FixedSizeList as List, areEqual } from "react-window";
// @ts-ignore
import { DragDropContext, Draggable } from "@hello-pangea/dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";
import AutoSizer from "react-virtualized-auto-sizer";
import { AddChapterIcon, AddIcon, DragIcon } from "../_assets/icons";

// Create an array of 20 chapter objects
const initialChapters = Array.from({ length: 14 }, (_, index) => ({
  id: `chapter-${index + 1}`,
  name: `This is chapter ${index + 1}`,
}));

// Define row dimensions and gap
const rowHeight = 48; // Actual content height
const gap = 4; // Gap between rows
const itemSize = rowHeight + gap; // Total size per item (for react-window)

const Row = React.memo(({ data, index, style }: any) => {
  const { chapters, placeholderProps, isDragging } = data;

  if (index === chapters.length) {
    return (
      <div
        style={{
          ...style,
          height: `${itemSize} !important`,
        }}
        className="group bg-foreground hover:bg-battleground border-[1px] border-border rounded-[10px] h-12 w-full flex items-center justify-center cursor-pointer"
      >
        <AddChapterIcon className="h-3.5 text-inactive group-hover:text-primary" />
      </div>
    );
  }

  const chapter = chapters[index];

  // Determine if we should render the placeholder at this index
  const isPlaceholder = placeholderProps.top / itemSize === index;

  return (
    <>
      {isPlaceholder && placeholderProps.height > 0 && (
        // Wrap placeholder in a div that takes the full "item" style,
        // then add an inner div with the desired rowHeight and gap.
        <div style={style}>
          <div
            style={{
              height: rowHeight,
              marginBottom: gap,
              backgroundColor: "rgba(0, 0, 255, 0.1)",
              border: "1px blue dashed",
              borderRadius: "10px",
              boxSizing: "border-box",
              pointerEvents: "none",
            }}
          />
        </div>
      )}

      <Draggable draggableId={chapter.id} index={index} key={chapter.id}>
        {(provided: any, snapshot: any) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              style={{
                ...style,
                ...provided.draggableProps.style,
              }}
            >
              {/* Wrap content in a div that applies a bottom margin equal to the gap */}
              <div style={{ marginBottom: gap }}>
                <div
                  className={`group w-full h-full m-auto flex items-center justify-between py-2.5 pl-3 pr-2 rounded-[10px] transition-all duration-150 ease-in-out ${
                    snapshot.isDragging
                      ? "scale-90 bg-battleground/90 shadow-[0px_4px_5px_0px_rgba(0,0,0,0.25)] backdrop-sepia-50 ring-1 ring-border"
                      : isDragging
                      ? ""
                      : "hover:bg-hover"
                  }`}
                  // Set explicit height equal to rowHeight
                  style={{ height: rowHeight }}
                >
                  <div className="flex items-center grow min-w-0">
                    <div
                      style={{
                        backgroundImage: `url("/pfps/profile1.png")`,
                      }}
                      className="h-7 aspect-square rounded-full bg-cover bg-center flex-shrink-0 mr-2.5"
                    ></div>
                    <div className="font-medium text-[13px] text-inactive grow truncate">
                      {chapter.name}
                    </div>
                  </div>

                  <span
                    {...provided.dragHandleProps}
                    className={`hidden text-secondary hover:text-primary cursor-grab  place-items-center w-[32px] aspect-square shrink-0 ${
                      isDragging ? "" : "group-hover:grid"
                    }`}
                  >
                    <DragIcon className="h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        }}
      </Draggable>
    </>
  );
}, areEqual);

export default function VirtualizedChapterList() {
  const [chapters, setChapters] = useState(initialChapters);
  const [isDragging, setIsDragging] = useState(false);
  const [placeholderProps, setPlaceholderProps] = useState({
    height: 0,
    top: 0,
  });

  const onDragStart = (start: any) => {
    setIsDragging(true);
    setPlaceholderProps({
      height: itemSize,
      top: start.source.index * itemSize,
    });
  };

  const onDragEnd = (result: any) => {
    setIsDragging(false);
    setPlaceholderProps({ height: 0, top: 0 });
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;

    const updatedChapters = Array.from(chapters);
    const [removed] = updatedChapters.splice(result.source.index, 1);
    updatedChapters.splice(result.destination.index, 0, removed);
    setChapters(updatedChapters);
  };

  const onDragUpdate = (update: any) => {
    if (update.destination) {
      setPlaceholderProps({
        height: itemSize,
        top: update.destination.index * itemSize,
      });
    } else {
      setPlaceholderProps({ height: 0, top: 0 });
    }
  };

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragUpdate={onDragUpdate}
      onDragStart={onDragStart}
    >
      <StrictModeDroppable
        droppableId="droppable"
        mode="virtual"
        renderClone={(provided: any, snapshot: any, rubric: any) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
            }}
            className={`h-12 w-full`}
          >
            <div style={{ marginBottom: gap }}>
              <div
                className={`group w-full h-full m-auto flex items-center justify-between py-2.5 pl-3 pr-2 rounded-[10px] transition-all duration-150 ease-in-out ${
                  snapshot.isDragging
                    ? "scale-90 bg-battleground/90 shadow-[0px_4px_5px_0px_rgba(0,0,0,0.25)] backdrop-sepia-50 ring-1 ring-border"
                    : isDragging
                    ? ""
                    : "hover:bg-hover"
                }`}
                style={{ height: rowHeight }}
              >
                <div className="flex items-center grow min-w-0">
                  <div
                    style={{
                      backgroundImage: `url("/pfps/profile1.png")`,
                    }}
                    className="h-7 aspect-square rounded-full bg-cover bg-center flex-shrink-0 mr-2.5"
                  ></div>
                  <div className="font-medium text-[13px] text-inactive grow truncate">
                    {chapters[rubric.source.index].name}
                  </div>
                </div>

                <span
                  {...provided.dragHandleProps}
                  className={`hidden text-secondary hover:text-primary cursor-grab  place-items-center w-[32px] aspect-square shrink-0 ${
                    isDragging ? "" : "group-hover:grid"
                  }`}
                >
                  <DragIcon className="h-3" />
                </span>
              </div>
            </div>
          </div>
        )}
      >
        {(droppableProvided: any) => (
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                width={width}
                itemCount={chapters.length + 1} // extra row for "Add" button
                itemSize={itemSize} // Now includes gap
                outerRef={droppableProvided.innerRef}
                itemData={{ chapters, placeholderProps, isDragging }}
              >
                {Row}
              </List>
            )}
          </AutoSizer>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
}
