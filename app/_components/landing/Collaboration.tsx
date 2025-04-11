import Image from "next/image";
import { Header } from "./Header";

const Collaboration = () => {
  return (
    <div className="bg-middleground w-full min-h-screen flex justify-center items-start py-28">
      <div className="w-[1080px]">
        <Header
          section="collaboration"
          title1="You and your team, "
          title2="on the same wavelength"
          subtitle="From start to finish, ProseBird lets you bring your team to every step of the way."
        />

        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(494px,1fr))] gap-20">
          <CollabBlock
            title="Real time co-editing"
            subtitle="Watch changes appear instantly as teammates refine the script."
          >
            <Image
              width={1983}
              height={1500}
              alt="Collaborative editor"
              className="w-[494px]"
              src="https://utfs.io/a/dv6kwxfdfm/X7kJqL6j4LDU529HWzEFueN1Vm64jTRKMndLzY87IafHqglQ"
            />
          </CollabBlock>
          <CollabBlock
            title="Real time co-editing"
            subtitle="Watch changes appear instantly as teammates refine the script."
          >
            <Image
              width={1983}
              height={1500}
              alt="Presentation participants"
              className="w-[494px]"
              src="https://utfs.io/a/dv6kwxfdfm/X7kJqL6j4LDUMa2y5ISOAHt7p6kwLOf82D1FIbWN4X5SUjYd"
            />
          </CollabBlock>
          <CollabBlock
            title="Real time co-editing"
            subtitle="Watch changes appear instantly as teammates refine the script."
          >
            <Image
              width={1983}
              height={1500}
              alt="Shared progress"
              className="w-[494px]"
              src="https://utfs.io/a/dv6kwxfdfm/X7kJqL6j4LDUiR5AI7pyTpnlWXUqVEumZ32gatIfRKN7Jrkd"
            />
          </CollabBlock>
          <CollabBlock
            title="Real time co-editing"
            subtitle="Watch changes appear instantly as teammates refine the script."
          >
            <Image
              width={1983}
              height={1500}
              alt="Presentation permissions"
              className="w-[494px]"
              src="https://utfs.io/a/dv6kwxfdfm/X7kJqL6j4LDUgjGiURIZt6KxnQfhP7DMr0Fa9e1IVuYRXHNT"
            />
          </CollabBlock>
        </div>
      </div>
    </div>
  );
};

const CollabBlock = ({ children, title, subtitle }: any) => {
  return (
    <div className="">
      <div className="hover:border-border mb-6 relative bg-background border-[1px] border-stroke py-[15px] px-[17px] rounded-3xl shadow-[0px_4px_35px_0px_rgba(0,0,0,0.25)]">
        {children}

        <div className="hover:opacity-0 transition-opacity duration-200 ease-in-out absolute left-0 top-0 h-full w-full rounded-3xl bg-gradient-to-tl from-middleground from-0% to-transparent to-100%"></div>
      </div>

      <div className="flex flex-col gap-2.5">
        <span className="font-bold text-[22px] text-primary">{title}</span>
        <span className="font-semibold text-[15px] text-secondary">
          {subtitle}
        </span>
      </div>
    </div>
  );
};

export default Collaboration;
