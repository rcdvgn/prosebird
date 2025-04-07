import {
  CommentsIcon,
  CustomStylingIcon,
  LiveAlertsIcon,
  MultiDeviceSupportIcon,
  PrivacyVisibilityIcon,
  ProgressControlIcon,
  SpeedControlIcon,
  VoiceScrollIcon,
} from "@/app/_assets/presentationIcons";
import Header from "./Header";
import { SearchIcon } from "@/app/_assets/icons";

const Presentation = () => {
  return (
    <div className="py-40">
      <Header
        section="presentation"
        title1="Not your traditional "
        title2="teleprompter"
        subtitle="Go beyond static text scrolling. OnQ adapts to you. It’s teleprompting, reinvented for collaboration."
      />

      <div className="rounded-[10px] border-stroke border-[1px] w-full overflow-hidden mb-12">
        <img className="w-full" src="/landing/presentation1.png" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(330px,1fr))] gap-11">
        <Feature
          icon={<VoiceScrollIcon className="h-4 text-brand" />}
          name="Voice Scroll"
          description="Switch between voice and automatic scrolling for a hands-free presentation with no distractions. When you talk, we listen."
        />

        <Feature
          icon={<ProgressControlIcon className="h-4 text-brand" />}
          name="Progress Control"
          description="Our interactive progress bar lets you easily rewind, pause and fast forward without losing track of the state of your presentation."
        />

        <Feature
          icon={<MultiDeviceSupportIcon className="w-[18px] text-brand" />}
          name="Multi-Device Support"
          description="Need more screens? Tune in to presentations from anywhere. The progress will be synchronized across all your devices."
        />

        <Feature
          icon={<SpeedControlIcon className="w-4 text-brand" />}
          name="Speed Control"
          description="Fine-tune scroll speed and track pacing with visual timers to master timing for rehearsals or live events, down to the second."
        />

        <Feature
          icon={<CustomStylingIcon className="h-4 text-brand" />}
          name="Custom Styling"
          description="Experiment with different text alignments, font sizes and view widths. Don't worry, we'll remember your preferences in the next time."
        />

        <Feature
          icon={<PrivacyVisibilityIcon className="h-4 text-brand" />}
          name="Privacy & Visibility"
          description="Define who can join and conduct your presentations with visibility settings and personalized links."
        />

        <Feature
          icon={<LiveAlertsIcon className="h-4 text-brand" />}
          name="Live Alerts"
          description="Stay in the loop with alerts about new participants, script changes, device pairing, words remaining and more."
        />

        <Feature
          icon={<CommentsIcon className="h-4 text-brand" />}
          name="Comments"
          description="Add personal notes throughout your presentation to guide your performance. Visible to you, silent to everyone else."
        />

        <Feature
          icon={<SearchIcon className="h-4 text-brand" />}
          name="Search"
          description="Effortlessly locate any part of your script. Quickly search for keywords or phrases and skip scrolling."
        />
      </div>
    </div>
  );
};

const Feature = ({ icon, name, description }: any) => {
  return (
    <div className="w-[330px]">
      <div className="flex items-center gap-2 my-2.5">
        {icon}

        <span className="font-bold text-[15px] text-primary">{name}</span>
      </div>

      <p className="font-semibold text-sm text-secondary">{description}</p>
    </div>
  );
};

export default Presentation;
