import Header from "./Header";

const Collaboration = () => {
  return (
    <div className="py-40">
      <Header
        section="collaboration"
        title1="You and your team, "
        title2="on the same wavelength"
        subtitle="From start to finish, OnQ lets you bring your team to every step of the way."
      />

      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(494px,1fr))] gap-20">
        <CollabBlock
          title="Real time co-editing"
          subtitle="Watch changes appear instantly as teammates refine the script."
        >
          <img className="w-[494px]" src="/landing/collaborationEditor.png" />
        </CollabBlock>
        <CollabBlock
          title="Real time co-editing"
          subtitle="Watch changes appear instantly as teammates refine the script."
        >
          <img
            className="w-[494px]"
            src="/landing/collaborationPresenters.png"
          />
        </CollabBlock>
        <CollabBlock
          title="Real time co-editing"
          subtitle="Watch changes appear instantly as teammates refine the script."
        >
          <img
            className="w-[494px]"
            src="/landing/collaborationPermissions.png"
          />
        </CollabBlock>
        <CollabBlock
          title="Real time co-editing"
          subtitle="Watch changes appear instantly as teammates refine the script."
        >
          <img className="w-[494px]" src="/landing/collaborationEditor.png" />
        </CollabBlock>
      </div>
    </div>
  );
};

const CollabBlock = ({ children, title, subtitle }: any) => {
  return (
    <div className="">
      <div className="mb-6 relative bg-background border-[1px] border-stroke py-[15px] px-[17px] rounded-3xl shadow-[0px_4px_35px_0px_rgba(0,0,0,0.25)]">
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
