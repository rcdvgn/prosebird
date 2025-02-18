export default function SegmentedControl({
  segments,
  selectedSegment,
  segmentWidth = 90,
}: any) {
  if (!segments) return;

  return (
    <div className="relative flex [&>div]:cursor-pointer h-full">
      <div
        className="transition-all duration-200 ease-in-out z-0 inset-y-0 m-auto bg-brand absolute h-full rounded-lg"
        style={{
          width: `${segmentWidth}px`,
          left: `${selectedSegment * segmentWidth}px`,
        }}
      ></div>

      {segments.map((segment: any) => {
        return (
          <div
            onClick={segment.onClick}
            style={{ width: `${segmentWidth}px` }}
            className={`z-10 h-full px-1 rounded-lg flex justify-center items-center gap-1 ${
              selectedSegment === segment.id
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
