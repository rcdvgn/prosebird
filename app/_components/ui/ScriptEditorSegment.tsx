export default function ScriptEditorSegment({
  segments,
  selectedSegment,
  segmentWidth = 90,
}: any) {
  if (!segments) return;

  return (
    <div className="relative flex [&>div]:cursor-pointer h-full">
      <div
        className="transition-all duration-200 ease-in-out z-0 inset-y-0 m-auto bg-brand absolute h-full rounded-[10px]"
        style={{
          width: `${segmentWidth}px`,
          left: `${selectedSegment * segmentWidth}px`,
        }}
      ></div>

      {segments.map((segment: any, index: any) => {
        return (
          <div
            key={index}
            onClick={segment.onClick}
            style={{ width: `${segmentWidth}px` }}
            className={`z-10 h-full px-1 rounded-[10px] flex justify-center items-center gap-1 ${
              selectedSegment === index
                ? "text-primary"
                : "hover:bg-hover text-secondary hover:text-primary"
            }`}
          >
            {segment?.leftIcon && segment.leftIcon}
            {segment?.text && (
              <span className="font-bold text-[13px]">{segment.text}</span>
            )}

            {segment?.rightIcon && segment.rightIcon}
          </div>
        );
      })}
    </div>
  );
}
