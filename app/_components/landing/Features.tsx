import {
  CommentsIcon,
  CustomStylingIcon,
  LiveAlertsIcon,
  MultiDeviceSupportIcon,
  PrivacyVisibilityIcon,
  ProgressControlIcon,
  SearchIcon,
  SpeedControlIcon,
  VoiceScrollIcon,
} from "@/app/_assets/landingIcons";
import { Header } from "./Header";
import InViewAnimation from "./InViewAnimation";

const Features = ({ featuresRef }: any) => {
  return (
    <div
      ref={featuresRef}
      className="bg-middleground w-full min-h-screen flex justify-center items-start py-40 sm:px-12"
    >
      <InViewAnimation className="w-full max-w-[1080px] px-4">
        <Header
          section="presentation"
          title1="Not your traditional "
          title2="teleprompter"
          subtitle="Fast, reliable, customizable. Go beyond static text scrolling, ProseBird adapts to you."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-11 justify-items-center">
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
      </InViewAnimation>
    </div>
  );
};

const Feature = ({ icon, name, description }: any) => {
  return (
    <div className="w-full max-w-[330px] flex flex-col items-center">
      <div className="flex flex-col items-center gap-3 my-2.5">
        {icon}

        <span className="font-bold text-lg text-primary">{name}</span>
      </div>

      <p className="font-semibold text-sm text-secondary text-center">
        {description}
      </p>
    </div>
  );
};

export default Features;
