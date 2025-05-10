"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import ScriptArea from "./ScriptArea";
import ScriptAreaInfo from "./ScriptAreaInfo";
import { useRouter } from "next/navigation";
import {
  StarIcon,
  ScriptIcon,
  PlayIcon,
  SearchIcon,
  MoreIcon,
  DragIcon,
  PencilIcon,
  ChaptersIcon,
  ToggleSidebarIcon,
  ChapterIcon,
} from "../_assets/icons";
import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";
import { useAuth } from "@/app/_contexts/AuthContext";
import { changeFavoriteStatus } from "../_services/client";
import VirtualizedChapterList from "./VirtualizedChaptersList";
import SegmentedControl from "./ui/SegmentedControl";
import ScriptAreaControls from "./ScriptAreaControls";
import Tiptap from "./_tiptap/Tiptap";
import { rehydrateEditorContent } from "../_utils/tiptapCommands";
import useResizeObserver from "use-resize-observer";
import { useModal } from "../_contexts/ModalContext";
import ManageParticipants from "./modals/ManageParticipants";
import ProfilePicture from "./ProfilePicture";
import _ from "lodash";

export default function ScriptEditor() {
  const { script, setScript, nodes, setNodes, participants, editor } =
    useScriptEditor();
  const { user } = useAuth();
  const router = useRouter();

  const { openModal } = useModal();

  const { ref: virtualListParent, height } = useResizeObserver<HTMLDivElement>({
    box: "border-box",
  });

  const [editorOptions, setEditorOptions] = useState<any>({
    textType: "default",
    fontSize: 14,
    textAlignment: "left",
  });

  const [isSpellCheckEnabled, setIsSpellCheckEnabled] = useState(false);
  const [scriptAreaControlsVisible, setScriptAreaControlsVisible] =
    useState<any>(true);
  const [chaptersViewVisible, setChaptersViewVisible] = useState<any>(true);

  const documentTitleRef = useRef<HTMLInputElement | null>(null);
  const inputContainerRef = useRef<HTMLSpanElement | null>(null);
  const [documentTitle, setDocumentTitle] = useState(script?.title);
  const [selectedSegment, setSelectedSegment] = useState<any>(0);

  const chapterViewWidth = 324;

  const handleDocumentTitleChange = (e: any) => {
    setDocumentTitle(e.target.value);
  };

  const handleDocumentTitleFocusOut = () => {
    if (documentTitle.length) {
      let copyScriptData = { ...script };
      copyScriptData.title = documentTitle;
      setScript(copyScriptData);
    } else {
      setDocumentTitle(documentTitle);
    }
  };

  const handleDocumentTitleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleDocumentTitleFocusOut();
      documentTitleRef.current?.blur();
    }
  };

  const handlePresent = async () => {
    const participantsIdsAndRoles = participants.reduce(
      (acc: any, item: any) => {
        const { id, role } = item;
        acc[id] = { role, isConnected: false };
        return acc;
      },
      {}
    );
    try {
      const res = await fetch("/api/presentation/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script: script,
          nodes: nodes,
          userId: user.id,
          scriptParticipants: participantsIdsAndRoles,
        }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to create presentation");
      }
      const presentationCode = await res.text();
      router.push(`/p/${presentationCode}`);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleShareFile = () => {
    openModal({
      content: (
        <ManageParticipants
          metadata={{
            participants,
            userId: user?.id,
            scriptId: script?.id,
            nodes: nodes,
            scriptTitle: script?.title,
          }}
        />
      ),
      name: "manageParticipants",
    });
  };

  const setChapters = async (newChapters: any) => {
    await setNodes(newChapters); // This is updateNodesLocal from context.
    if (editor) {
      const content = rehydrateEditorContent(newChapters);
      editor.commands.setContent(content);
    }
  };

  const segments = [
    { id: 0, text: "Chapters", onClick: () => setSelectedSegment(0) },
    { id: 1, text: "People", onClick: () => setSelectedSegment(1) },
  ];

  const slideVariants = {
    hidden: { marginRight: `-${chapterViewWidth}px`, marginLeft: "0" },
    visible: { marginRight: "0", marginLeft: "8px" },
  };

  useEffect(() => {
    if (inputContainerRef.current && documentTitleRef.current) {
      documentTitleRef.current.style.width = `${inputContainerRef.current.offsetWidth}px`;
    }
  }, [documentTitle]);

  useEffect(() => {
    if (script && script?.title !== documentTitle) {
      setDocumentTitle(script.title);
    }
  }, [script?.title]);

  const currentUserInParticipants = participants.find(
    (p: any) => p?.id === user?.id
  );

  const nodesBySpeaker = _.groupBy(
    nodes,
    (chapter) => `${chapter.speaker.id}_${chapter.speaker.isGuest}`
  );

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center p-[10px] h-16 shrink-0">
        {/* Top bar with document title and icons */}
        <div className="grow flex items-center gap-3 min-w-0">
          <div className="icon-container">
            <ScriptIcon className="text-primary" />
          </div>
          <div className="relative grow flex items-center gap-2 min-w-0">
            <span
              ref={inputContainerRef}
              className="absolute left-0 top-0 w-fit m-auto font-semibold text-[13px] invisible min-w-0"
            >
              {documentTitle}
            </span>
            <input
              ref={documentTitleRef}
              type="text"
              value={documentTitle}
              onFocus={() => setIsSpellCheckEnabled(true)}
              onBlur={() => {
                handleDocumentTitleFocusOut();
                setIsSpellCheckEnabled(false);
              }}
              onChange={handleDocumentTitleChange}
              onKeyDown={handleDocumentTitleKeyDown}
              spellCheck={isSpellCheckEnabled}
              className="font-semibold text-[13px] inactive bg-transparent border-none outline-none rounded-sm focus:text-primary/90 ring-1 ring-transparent hover:ring-placeholder focus:ring-brand ring-offset-4 ring-offset-background min-w-0"
            />
            <div className="flex items-center gap-1">
              <span
                onClick={() =>
                  changeFavoriteStatus(script.id, !script.isFavorite)
                }
                className="button-icon !h-[25px] !bg-transparent"
              >
                <StarIcon
                  className={`h-4 ${
                    script?.isFavorite
                      ? "!text-favorite-yellow fill-current"
                      : ""
                  }`}
                />
              </span>
              <span className="button-icon !h-[25px] !bg-transparent">
                <MoreIcon className="rotate-90 w-3.5" />
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex h-7">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                style={{
                  backgroundImage: `url("/pfps/profile1.png")`,
                }}
                className={`${
                  index > 0 ? "-ml-[3px]" : ""
                } h-full aspect-square rounded-full box-content ring-2 ring-background bg-cover bg-center flex-shrink-0`}
              ></div>
            ))}
          </div>
          <button
            onClick={() => setScriptAreaControlsVisible((curr: any) => !curr)}
            className="btn-2-md !px-0 !aspect-square"
          >
            <PencilIcon className="h-3.5" />
          </button>
          <button
            onClick={() => setChaptersViewVisible((curr: any) => !curr)}
            className="btn-2-md !px-0 !aspect-square"
          >
            <ChaptersIcon className="w-3.5" />
          </button>
          {(currentUserInParticipants?.role === "author" ||
            currentUserInParticipants?.role === "editor") && (
            <button onClick={handleShareFile} className="btn-2-md">
              Invite
            </button>
          )}

          <button className="btn-1-md" onClick={handlePresent}>
            <span>Present</span>
          </button>
        </div>
      </div>
      <div className="grow flex overflow-hidden min-w-0 mr-2 mb-2">
        <div
          style={
            {
              "--editor-font-size": `${editorOptions.fontSize}px`,
            } as React.CSSProperties
          }
          className="slate flex flex-col relative grow items-center min-h-0 overflow-y-auto"
        >
          <ScriptAreaControls
            editorOptions={editorOptions}
            setEditorOptions={setEditorOptions}
            isVisible={scriptAreaControlsVisible}
            setisVisible={setScriptAreaControlsVisible}
          />
          <Tiptap />
          <ScriptAreaInfo />
        </div>
        <AnimatePresence>
          {chaptersViewVisible && (
            <motion.div
              layout
              key="slate"
              className="slate flex flex-col ml-2 px-2.5"
              style={{ width: chapterViewWidth + "px" }}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={slideVariants}
              transition={{ duration: 0.2 }}
            >
              <div className="h-16 border-stroke border-b-[1px] flex justify-between items-center shrink-0">
                <span
                  onClick={() => setChaptersViewVisible((curr: any) => !curr)}
                  className="mx-2 button-icon !bg-transparent"
                >
                  <ToggleSidebarIcon className="h-[18px]" />
                </span>

                <div className="rounded-[10px] h-[36px] p-[2px]">
                  <SegmentedControl
                    segments={segments}
                    selectedSegment={selectedSegment}
                  />
                </div>

                <span className="invisible mx-2 button-icon !bg-transparent">
                  <ToggleSidebarIcon className="h-[18px]" />
                </span>
              </div>

              <div
                ref={virtualListParent}
                className={`grow w-full py-2.5 min-h-0 overflow-y-auto`}
              >
                {selectedSegment === 0 ? (
                  <VirtualizedChapterList
                    chapters={nodes}
                    onChaptersChange={setChapters}
                    containerHeight={height! - 20}
                  />
                ) : (
                  <div className="flex flex-col">
                    {participants &&
                      participants.map((participant: any, index: any) => {
                        const isGuest = participant.role === "guest";
                        const participantIdentifier = `${
                          participant?.id || participant?.alias
                        }_${isGuest}`;
                        const speakerNodes = _.keys(nodesBySpeaker).includes(
                          participantIdentifier
                        )
                          ? nodesBySpeaker[participantIdentifier]
                          : [];

                        return (
                          <div
                            key={index}
                            className="flex flex-col rounded-[10px] px-3 py-2.5 hover:bg-background"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5 grow min-w-0">
                                <ProfilePicture
                                  className="h-8"
                                  displayName={
                                    participant?.displayName ||
                                    participant?.alias
                                  }
                                />

                                <div className="flex flex-col grow min-w-0 cursor-default pr-4">
                                  <span className="font-bold text-sm text-primary truncate">
                                    {participant?.role === "guest"
                                      ? participant?.alias
                                      : participant?.displayName}
                                  </span>
                                  <span className="font-medium text-xs text-secondary truncate">
                                    {String(participant?.role)
                                      .charAt(0)
                                      .toUpperCase() +
                                      String(participant?.role).slice(1)}
                                  </span>
                                </div>
                              </div>

                              <div className="group py-1 px-2 rounded-md ring-1 ring-stroke hover:bg-battleground hover:ring-transparent cursor-pointer flex items-center gap-1.5">
                                <ChapterIcon className="text-placeholder group-hover:text-secondary h-3" />
                                <span className="font-bold text-primary text-xs">
                                  {speakerNodes.length}
                                </span>
                              </div>
                            </div>

                            <ChapterChips
                              chapterIcon={false}
                              commaSeparated={true}
                              nodes={speakerNodes}
                              className="mt-2.5"
                            />
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const ChapterChips = ({
  nodes,
  commaSeparated = false,
  chapterIcon = false,
  className = "",
}: any) => {
  return (
    nodes.length > 0 && (
      <div
        className={`w-full ${className} ${
          commaSeparated ? "mx-[-2px]" : "mx-[-4px]"
        }`}
      >
        {nodes.map((chapter: any, chapterIndex: any) => {
          return (
            <p
              key={chapterIndex}
              className={`group cursor-pointer pb-[7px] pt-[5px] rounded-lg inline leading-8 break-all box-decoration-clone text-secondary font-semibold ${
                commaSeparated
                  ? "mx-[2px] hover:underline hover:text-primary text-[13px]"
                  : "mx-[4px] px-2 bg-battleground text-xs"
              }`}
            >
              {chapterIcon && (
                <ChapterIcon
                  className={`inline mr-1.5 ${
                    commaSeparated
                      ? "group-hover:text-primary h-3 text-secondary"
                      : "h-2.5 text-placeholder"
                  }`}
                />
              )}
              {chapter.title}
              {commaSeparated
                ? chapterIndex < nodes.length - 1
                  ? ","
                  : "."
                : ""}
            </p>
          );
        })}
      </div>
    )
  );
};

{
  /* <p
  key={chapterIndex}
  className="group mx-[2px] cursor-pointer bg-battleground hover:text-primary px-2 rounded-lg inline leading-8 break-all box-decoration-clone"
>
  <span className="h-[26px] flex gap-1.5 items-center">
    <ChapterIcon className="text-placeholder h-2.5" />
    <span className="group-hover:text-primary text-secondary font-semibold text-xs">
      {chapter.title}
    </span>
  </span>
</p> */
}
