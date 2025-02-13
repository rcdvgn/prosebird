import React, { useState } from "react";
// @ts-ignore
import { FixedSizeList as List, areEqual } from "react-window";
// @ts-ignore
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";
import AutoSizer from "react-virtualized-auto-sizer";
import { DragIcon } from "../_assets/icons";

// Create an array of 20 chapter objects
const initialChapters = Array.from({ length: 20 }, (_, index) => ({
  id: `chapter-${index + 1}`,
  name: `This is chapter ${index + 1}`,
}));

// Row component with original styling
const Row = React.memo(({ data: chapters, index, style }: any) => {
  const chapter = chapters[index];

  return (
    <Draggable draggableId={chapter.id} index={index} key={chapter.id}>
      {(provided: any, snapshot: any) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          // Combine react-window's style with draggable props style
          style={{
            ...style,
            ...provided.draggableProps.style,
          }}
          className="h-12 w-full"
        >
          <div className="group w-full h-full m-auto flex items-center py-2.5 pr-2 rounded-[10px] hover:bg-hover">
            <div className="button-icon !bg-transparent">
              <span className="font-semibold text-[13px] text-secondary group-hover:hidden">
                {index + 1 + "."}
              </span>
              <DragIcon className="h-3 hidden group-hover:block" />
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
  );
}, areEqual);

export default function VirtualizedChapterList() {
  const [chapters, setChapters] = useState(initialChapters);
  // placeholderProps will hold the computed top offset and height (in pixels)
  const [placeholderProps, setPlaceholderProps] = useState({
    height: 0,
    top: 0,
  });
  const itemSize = 50; // each row is 50px tall

  // When drag ends, clear the placeholder and update the list order
  const onDragEnd = (result: any) => {
    setPlaceholderProps({ height: 0, top: 0 });
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;

    const updatedChapters = Array.from(chapters);
    const [removed] = updatedChapters.splice(result.source.index, 1);
    updatedChapters.splice(result.destination.index, 0, removed);
    setChapters(updatedChapters);
  };

  // As the drag updates, update the placeholder's position based on the destination index
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
    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
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
            className="h-12 w-full"
          >
            <div className="group w-full h-full m-auto flex items-center py-2.5 pr-2 rounded-[10px] hover:bg-hover">
              <div className="button-icon !bg-transparent">
                <span className="font-semibold text-[13px] text-secondary group-hover:hidden">
                  {rubric.source.index + 1 + "."}
                </span>
                <DragIcon className="h-3 hidden group-hover:block" />
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
          // Wrap the List in a relatively positioned container to allow absolute positioning for the placeholder
          <div
            ref={droppableProvided.innerRef}
            style={{ height: "100%", width: "100%", position: "relative" }}
          >
            <AutoSizer>
              {({ height, width }) => (
                <List
                  height={height} // numeric height from AutoSizer
                  itemCount={chapters.length}
                  itemSize={itemSize}
                  width={width} // full container width
                  itemData={chapters}
                >
                  {Row}
                </List>
              )}
            </AutoSizer>
            {/* Render a styled placeholder if dragging */}
            {placeholderProps.height > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: placeholderProps.top,
                  left: 0,
                  width: "100%",
                  height: placeholderProps.height,
                  backgroundColor: "rgba(0, 0, 255, 0.1)",
                  border: "1px blue solid",
                  borderRadius: "10px",
                  boxSizing: "border-box",
                  pointerEvents: "none",
                }}
              >
                {/* You can add text here if desired */}
              </div>
            )}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
}
