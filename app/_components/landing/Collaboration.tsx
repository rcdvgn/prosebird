import Image from "next/image";
import { Header } from "./Header";
import InViewAnimation from "./InViewAnimation";

const Collaboration = ({ collaborationRef }: any) => {
  return (
    <div
      ref={collaborationRef}
      className="bg-middleground w-full min-h-screen flex justify-center items-start py-40 md:px-12"
    >
      <InViewAnimation className="w-full max-w-[1080px] px-4">
        <Header
          section="collaboration"
          title1="You and your team, "
          title2="on the same wavelength"
          subtitle="From start to finish, ProseBird lets you bring your team to every step of the way."
        />

        {/* Grid container - changes from 2 columns to 1 column on smaller screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-20">
          <CollabBlock
            title="Real time co-editing"
            subtitle="Refine the script along with your team and watch their changes come to life in real time."
            imageUrl="https://utfs.io/a/dv6kwxfdfm/X7kJqL6j4LDU529HWzEFueN1Vm64jTRKMndLzY87IafHqglQ"
            alt="Collaborative editor"
          />
          <CollabBlock
            title="Chapter Assigning"
            subtitle="Divide the presentation into chapters and make sure everyone has a turn to speak."
            imageUrl="https://utfs.io/a/dv6kwxfdfm/X7kJqL6j4LDUZ1Pz7hSMLU8bcns5HjGfwFTCaOAdBJQYvp2I"
            alt="Presentation participants"
          />
          <CollabBlock
            title="Speaker Coordination"
            subtitle="Track speaker transitions, chapters, and pacing, ensuring everyone knows exactly where they are in the script."
            imageUrl="https://utfs.io/a/dv6kwxfdfm/X7kJqL6j4LDUjO40IJc0KnfVM2eQlBXcwWOxFPgdhCq8Eoz9"
            alt="Shared progress"
          />
          <CollabBlock
            title="Participants and Visibility"
            subtitle="Invite participants, assign roles and manage visibility, all from the script editor or presentation setup."
            imageUrl="https://utfs.io/a/dv6kwxfdfm/X7kJqL6j4LDUgjGiURIZt6KxnQfhP7DMr0Fa9e1IVuYRXHNT"
            alt="Presentation permissions"
          />
        </div>
      </InViewAnimation>
    </div>
  );
};

interface CollabBlockProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  alt: string;
}

// Update the CollabBlock component function:
const CollabBlock = ({ title, subtitle, imageUrl, alt }: CollabBlockProps) => {
  return (
    <div className="flex flex-col mx-auto w-full max-w-[494px]">
      <div className="transition-all duration-200 ease-in-out hover:-translate-y-2 hover:border-border mb-4 relative bg-background border-[1px] border-stroke py-[15px] px-[17px] rounded-3xl shadow-[0px_4px_35px_0px_rgba(0,0,0,0.25)] min-w-[280px]">
        <div className="aspect-[1983/1500] w-full relative">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1500px) 50vw, 494px"
            unoptimized={true}
          />
        </div>
        <div className="hover:opacity-0 transition-opacity duration-200 ease-in-out absolute left-0 top-0 h-full w-full rounded-3xl bg-gradient-to-tl from-middleground from-0% to-transparent to-100%"></div>
      </div>
      <div className="flex flex-col gap-2.5 px-[17px]">
        <span className="font-bold text-xl md:text-[22px] text-primary">
          {title}
        </span>
        <span className="font-semibold text-sm md:text-[15px] text-secondary">
          {subtitle}
        </span>
      </div>
    </div>
  );
};

export default Collaboration;
