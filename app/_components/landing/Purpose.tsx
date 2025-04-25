import { SubHeader } from "./Header";
import InViewAnimation from "./InViewAnimation";

export default function Purpose() {
  return (
    <div className="bg-middleground w-full min-h-screen flex justify-center items-start py-20 md:py-40 px-4 sm:px-6 md:px-12">
      <InViewAnimation className="w-full max-w-6xl text-center flex flex-col items-center">
        <SubHeader title="ProseBird was born from 2 convictions" />

        <div className="flex flex-col md:flex-row items-stretch justify-between w-full gap-6 mt-8">
          <Block
            headline={`"Delivery matters as much as the message."`}
            subheadline="A brilliant idea can fall flat if it's poorly presented. We believe your words deserve a stage that matches their power."
            index="1"
          />
          <Block
            headline={`"Great presentations shouldn't require years of training."`}
            subheadline="You shouldn't need to be a TEDx speaker to communicate with confidence. Everyone deserves tools that makes presenting feel natural."
            index="2"
          />
        </div>
      </InViewAnimation>
    </div>
  );
}

const Block = ({ headline, subheadline, index }: any) => {
  return (
    <div className="rounded-xl bg-background border-stroke border-[1px] p-6 md:p-8 flex-1 flex flex-col">
      <div className="flex items-start gap-4 md:gap-6 h-full">
        <div className="py-1.5 flex-shrink-0">
          <span className="bg-brand rounded-full h-7 w-7 grid place-items-center text-base text-primary font-bold">
            {index}
          </span>
        </div>
        <div className="flex flex-col h-full">
          <p className="text-left leading-tight md:leading-10 text-2xl md:text-3xl font-bold text-primary mb-4 md:mb-5">
            {headline}
          </p>

          <p className="text-left leading-normal md:leading-relaxed text-secondary text-sm md:text-base font-semibold">
            {subheadline}
          </p>
        </div>
      </div>
    </div>
  );
};
