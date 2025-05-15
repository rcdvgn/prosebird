// Default.tsx
import React from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useInteractions,
  useHover,
  useDismiss,
  useRole,
  safePolygon,
  FloatingPortal,
} from "@floating-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronHorizontalIcon } from "@/app/_assets/icons";

export interface DropdownOption {
  label: string;
  value: any;
  disabled?: boolean;
  onClick?: () => void;
  subOptions?: DropdownOption[];
}

export interface DropdownGroup {
  label: string;
  options: DropdownOption[];
}

export type DropdownOptions = DropdownOption[] | DropdownGroup[];

export interface DefaultDropdownProps {
  options: DropdownOptions;
  onSelect: (option: DropdownOption) => void;
  metadata?: any;
  /** Passed from the wrapper */
  position?: "bottom-left" | "bottom-right" | "bottom";
}

const isGroup = (item: DropdownOption | DropdownGroup): item is DropdownGroup =>
  (item as DropdownGroup).options !== undefined;

const optionStyle =
  "w-full text-left px-4 py-2 hover:bg-hover disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-inactive hover:text-primary font-semibold text-[13px]";

const dropdownStyle =
  "relative bg-foreground p-1 rounded-xl shadow-lg overflow-hidden ring-1 ring-stroke flex flex-col";

export default function DefaultDropdown({
  options,
  onSelect,
  position = "bottom-left",
}: DefaultDropdownProps) {
  return (
    <div className={`${dropdownStyle} min-w-48`}>
      {options.map((item, idx) =>
        isGroup(item) ? (
          <GroupSection key={idx} group={item} />
        ) : (
          <OptionItem
            key={(item as DropdownOption).value}
            opt={item as DropdownOption}
          />
        )
      )}
    </div>
  );

  function GroupSection({ group }: { group: DropdownGroup }) {
    return (
      <div className="">
        <div className="border-b-[1px] border-border px-4 py-2 text-[13px] font-semibold text-secondary select-none">
          {group.label}
        </div>
        {group.options.map((opt) => (
          <OptionItem key={opt.value} opt={opt} />
        ))}
      </div>
    );
  }

  function OptionItem({ opt }: { opt: DropdownOption }) {
    // leaf node
    if (!opt.subOptions) {
      return (
        <button
          type="button"
          disabled={opt.disabled}
          className={optionStyle}
          onClick={() => {
            if (opt.disabled) return;
            opt.onClick?.();
            onSelect(opt);
          }}
        >
          {opt.label}
        </button>
      );
    }

    // has subOptions → render a nested submenu
    return (
      <NestedOption opt={opt} onSelect={onSelect} parentPosition={position!} />
    );
  }
}

interface NestedProps {
  opt: DropdownOption;
  onSelect: (o: DropdownOption) => void;
  parentPosition: "bottom-left" | "bottom-right" | "bottom";
}

function NestedOption({ opt, onSelect, parentPosition }: NestedProps) {
  const [open, setOpen] = React.useState(false);

  // choose left or right start based on parentPosition
  const placement =
    parentPosition === "bottom-right" ? "left-start" : "right-start";

  const { refs, x, y, strategy, context } = useFloating({
    placement,
    middleware: [offset({ mainAxis: 12, alignmentAxis: 0 }), flip()],

    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen,
  });

  const hover = useHover(context, {
    move: false,
    delay: { open: 75, close: 150 },
    handleClose: safePolygon({ blockPointerEvents: true }),
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "menu" });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    dismiss,
    role,
  ]);

  return (
    <div key={opt.value} className="relative">
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        type="button"
        disabled={opt.disabled}
        className={`${optionStyle} flex justify-between items-center`}
        onClick={() => {
          if (opt.disabled) return;
          // Optionally let click also toggle submenu:
          setOpen((o) => !o);
        }}
      >
        <span>{opt.label}</span>
        <span className="ml-2">
          <ChevronHorizontalIcon className="h-2.5" />
        </span>
      </button>

      <FloatingPortal>
        <AnimatePresence>
          {open && (
            <motion.div
              ref={refs.setFloating}
              {...getFloatingProps()}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              className={`${dropdownStyle} z-[10000]`}
            >
              {opt.subOptions!.map((sub) => (
                <button
                  key={sub.value}
                  type="button"
                  disabled={sub.disabled}
                  className={optionStyle}
                  onClick={() => {
                    if (sub.disabled) return;
                    sub.onClick?.();
                    onSelect(sub);
                    setOpen(false);
                  }}
                >
                  {sub.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </div>
  );
}
