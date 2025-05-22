import React, { useEffect, useState } from "react";
// @ts-ignore
import { FixedSizeList as List, areEqual } from "react-window";
// @ts-ignore
import { DragDropContext, Draggable } from "@hello-pangea/dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";
import {
  AddChapterIcon,
  AddIcon,
  ChapterIcon,
  DragIcon,
  RenameIcon,
  TargetIcon,
  TrashCanIcon,
} from "../_assets/icons";

const rowHeight = 48;
const gap = 4;
const itemSize = rowHeight + gap;

const Row = React.memo(({ data, index, style }: any) => {
  const {
    chapters,
    placeholderProps,
    isDragging,
    handleTitleChange,
    handleDeleteChapter,
  } = data;

  const [isEditing, setIsEditing] = useState(false);

  if (index === chapters.length) {
    return (
      <div
        style={{
          ...style,
          height: `${itemSize} !important`,
        }}
        className="group bg-foreground hover:bg-battleground border-[1px] border-border rounded-[14px] h-12 w-full flex items-center justify-center cursor-pointer"
      >
        <AddChapterIcon className="h-3.5 text-inactive group-hover:text-primary" />
      </div>
    );
  }

  const chapter = chapters[index];
  const isPlaceholder = placeholderProps.top / itemSize === index;

  return (
    <>
      {isPlaceholder && placeholderProps.height > 0 && (
        <div style={style}>
          <div
            style={{
              height: rowHeight,
              marginBottom: gap,
              backgroundColor: "rgba(0, 0, 255, 0.1)",
              border: "1px blue dashed",
              borderRadius: "14px",
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
              <div style={{ marginBottom: gap }}>
                <div
                  className={`group w-full h-full m-auto flex items-center justify-between gap-2 py-2.5 px-2 rounded-[14px] transition-all duration-150 ease-in-out ${
                    isEditing ? "!bg-transparent" : ""
                  } ${
                    snapshot.isDragging
                      ? "scale-90 bg-battleground/90 shadow-[0px_4px_5px_0px_rgba(0,0,0,0.25)] backdrop-sepia-50 ring-1 ring-border text-primary"
                      : isDragging
                      ? "text-primary"
                      : "hover:bg-hover text-primary"
                  }`}
                  style={{ height: rowHeight }}
                >
                  <div className="flex items-center grow min-w-0">
                    {isEditing ? (
                      <span className="grid button-icon !pointer-events-none !text-tertiary">
                        <RenameIcon className="h-[15px]" />
                      </span>
                    ) : (
                      <>
                        <span
                          {...provided.dragHandleProps}
                          className="group-hover:grid hidden button-icon !bg-transparent !cursor-grab"
                        >
                          <DragIcon className="h-3" />
                        </span>
                        <span className="group-hover:hidden grid button-icon !pointer-events-none !text-tertiary">
                          <ChapterIcon className="h-[15px]" />
                        </span>
                      </>
                    )}
                    <input
                      onFocus={() => setIsEditing(true)}
                      onBlur={() => setIsEditing(false)}
                      className="h-8 placeholder-current font-medium text-[13px] bg-transparent focus:bg-battleground rounded-lg outline-none grow truncate focus:px-2.5 focus:border-[1px] border-border transition-all"
                      value={chapter.title === "\u200B" ? "" : chapter.title}
                      placeholder={`Chapter ${index + 1}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.currentTarget.blur();
                        }
                      }}
                      onChange={(e) => handleTitleChange(index, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <span className="flex">
                    <span className="rounded-full button-icon">
                      <div
                        style={{
                          backgroundImage: `url("/pfps/profile1.png")`,
                        }}
                        className="h-[26px] aspect-square rounded-full bg-cover bg-center flex-shrink-0"
                      ></div>
                    </span>
                    <span
                      onClick={() => handleDeleteChapter(index)}
                      className="button-icon"
                    >
                      <TrashCanIcon className="h-[15px]" />
                    </span>
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

export default function VirtualizedChapterList({
  chapters,
  onChaptersChange,
  containerHeight,
}: any) {
  const [isDragging, setIsDragging] = useState(false);
  const [placeholderProps, setPlaceholderProps] = useState({
    height: 0,
    top: 0,
  });

  const handleTitleChange = (index: number, newTitle: string) => {
    const updatedChapters = [...chapters];
    updatedChapters[index] = { ...updatedChapters[index], title: newTitle };
    onChaptersChange(updatedChapters);
  };

  const handleDeleteChapter = (index: number) => {
    const updatedChapters = [...chapters];
    updatedChapters.splice(index, 1);
    onChaptersChange(updatedChapters);
  };

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
    onChaptersChange(updatedChapters);
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

  if (!chapters) return null;

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
                className={`group w-full h-full m-auto flex items-center justify-between gap-2 py-2.5 px-2 rounded-[14px] transition-all duration-150 ease-in-out ${
                  snapshot.isDragging
                    ? "scale-90 bg-battleground/90 shadow-[0px_4px_5px_0px_rgba(0,0,0,0.25)] backdrop-sepia-50 ring-1 ring-border text-primary"
                    : isDragging
                    ? "text-primary"
                    : "hover:bg-hover text-primary"
                }`}
                style={{ height: rowHeight }}
              >
                <div className="flex items-center grow min-w-0">
                  <span
                    {...provided.dragHandleProps}
                    className="group-hover:grid hidden button-icon !bg-transparent !cursor-grab"
                  >
                    <DragIcon className="h-3" />
                  </span>
                  <span className="group-hover:hidden grid button-icon !pointer-events-none !text-tertiary">
                    <ChapterIcon className="h-[15px]" />
                  </span>
                  <input
                    className="h-8 placeholder-current font-medium text-[13px] bg-transparent focus:bg-battleground rounded-lg outline-none grow truncate focus:px-2.5 focus:border-[1px] border-border transition-all"
                    value={
                      chapters[rubric.source.index].title === "\u200B"
                        ? ""
                        : chapters[rubric.source.index].title
                    }
                    placeholder={`Chapter ${rubric.source.index + 1}`}
                    readOnly
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <span className="flex">
                  <span className="rounded-full button-icon">
                    <div
                      style={{
                        backgroundImage: `url("/pfps/profile1.png")`,
                      }}
                      className="h-[26px] aspect-square rounded-full bg-cover bg-center flex-shrink-0"
                    ></div>
                  </span>
                  <span className="button-icon">
                    <TrashCanIcon className="h-[15px]" />
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
      >
        {(droppableProvided: any) => (
          <List
            height={containerHeight}
            itemCount={chapters.length + 1}
            itemSize={itemSize}
            outerRef={droppableProvided.innerRef}
            itemData={{
              chapters,
              placeholderProps,
              isDragging,
              handleTitleChange,
              handleDeleteChapter, // pass it down!
            }}
          >
            {Row}
          </List>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
}
