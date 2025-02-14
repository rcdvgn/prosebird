import React, { useState } from "react";
// @ts-ignore
import { FixedSizeList as List, areEqual } from "react-window";
// @ts-ignore
import { DragDropContext, Draggable } from "@hello-pangea/dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";
import AutoSizer from "react-virtualized-auto-sizer";
import { DragIcon } from "../_assets/icons";

// Create an array of 20 chapter objects
const initialChapters = Array.from({ length: 20 }, (_, index) => ({
  id: `chapter-${index + 1}`,
  name: `This is chapter ${index + 1}`,
}));

// A memoized row renderer that uses react-window's style prop.
const Row = React.memo(({ data, index, style }: any) => {
  const { chapters, placeholderProps, isDragging } = data;
  const chapter = chapters[index];

  const isPlaceholder = placeholderProps.top / 48 === index;

  return (
    <>
      {isPlaceholder && placeholderProps.height > 0 && (
        <div
          style={{
            ...style,
            height: placeholderProps.height,
            backgroundColor: "rgba(0, 0, 255, 0.1)",
            border: "1px blue dashed",
            borderRadius: "10px",
            boxSizing: "border-box",
            pointerEvents: "none",
          }}
        />
      )}

      <Draggable draggableId={chapter.id} index={index} key={chapter.id}>
        {(provided: any, snapshot: any) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps} // Apply draggableProps to the outer container
            style={{
              ...style,
              ...provided.draggableProps.style,
            }}
            className={`h-12 w-full`}
          >
            <div
              className={`group w-full h-full m-auto flex items-center py-2.5 pr-2 rounded-[10px] transition-all duration-150 ease-in-out ${
                snapshot.isDragging
                  ? "scale-90 bg-battleground/90 shadow-[0px 4px 5px 0px rgba(0,0,0,0.25)] backdrop-sepia-50 ring-1 ring-border"
                  : isDragging
                  ? "" // Remove hover effect when any item is dragging
                  : "hover:bg-hover"
              }`}
            >
              <div className="button-icon !bg-transparent">
                <span className="font-semibold text-[13px] text-secondary group-hover:hidden">
                  {index + 1 + "."}
                </span>
                {/* Wrap DragIcon in a span and apply dragHandleProps ONLY here */}
                <span
                  {...provided.dragHandleProps}
                  className="hidden group-hover:grid cursor-grab w-full h-full place-items-center"
                >
                  <DragIcon className="h-3" />
                </span>
              </div>
              <div
                style={{
                  backgroundImage: `url("/pfps/profile1.png")`,
                }}
                className="h-7 aspect-square rounded-full bg-cover bg-center flex-shrink-0 mr-2.5"
              ></div>
              <div className="font-semibold text-[13px] text-primary grow truncate">
                {chapter.name}
              </div>
            </div>
          </div>
        )}
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

  const itemSize = 48; // each row is 50px tall

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
            <div
              className={`group w-full h-full m-auto flex items-center py-2.5 pr-2 rounded-[10px] transition-all duration-150 ease-in-out ${
                snapshot.isDragging
                  ? "scale-90 bg-battleground/90 shadow-[0px 4px 5px 0px rgba(0,0,0,0.25)] backdrop-sepia-50 ring-1 ring-border"
                  : isDragging
                  ? "" // Remove hover effect when any item is dragging
                  : "hover:bg-hover"
              }`}
            >
              <div className="button-icon !bg-transparent">
                <span className="font-semibold text-[13px] text-secondary group-hover:hidden">
                  {rubric.source.index + 1 + "."}
                </span>
                <span
                  {...provided.dragHandleProps}
                  className="hidden group-hover:grid cursor-grab w-full h-full place-items-center"
                >
                  <DragIcon className="h-3" />
                </span>
              </div>
              <div
                style={{
                  backgroundImage: `url("/pfps/profile1.png")`,
                }}
                className="h-7 aspect-square rounded-full bg-cover bg-center flex-shrink-0 mr-2.5"
              ></div>
              <div className="font-semibold text-[13px] text-primary grow truncate">
                {chapters[rubric.source.index].name}
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
                itemCount={chapters.length}
                itemSize={itemSize} // adjust based on row height
                // Use the droppable's innerRef as the outerRef for the List
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
