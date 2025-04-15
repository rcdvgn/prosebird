import { EnergyIcon, StressIcon, TimeIcon } from "@/app/_assets/landingIcons";
import { SubHeader } from "./Header";

export default function Benefits() {
  const items = [
    {
      icon: <TimeIcon className="text-brand h-12" />,
      title: "Time",
      desc: "Traditional presentation prep can be repetitive and draining. ProseBird streamlines rehearsals so you can focus on perfecting your message.",
    },
    {
      icon: <StressIcon className="text-brand h-12" />,
      title: "Stress",
      desc: "High-stakes moments are proven to heighten anxiety and self-doubt. With ProseBird, every performance feels like a practice run.",
    },
    {
      icon: <EnergyIcon className="text-brand h-12" />,
      title: "Energy",
      desc: "Writing, planing and delivering presentations takes a lot of effort, ProseBird simplifies it by combining everything you need in one place.",
    },
  ];

  return (
    <div className="bg-middleground w-full flex justify-center items-start py-16 md:py-28 px-4">
      <div className="w-full max-w-[1080px] text-center">
        <SubHeader title="ProseBird is here to save you" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
          {items.map((item: any, index: any) => {
            return (
              <div
                key={index}
                className="w-full max-w-[330px] flex flex-col gap-4 items-center justify-start"
              >
                {item.icon}

                <span className="text-xl md:text-2xl font-bold text-primary">
                  {item.title}
                </span>

                <p className="text-sm md:text-[15px] leading-[22px] font-semibold text-secondary">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
