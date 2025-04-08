const Header = ({ section, title1, title2, subtitle }: any) => {
  return (
    <div className="mb-14 flex justify-center">
      <div className="w-[650px] text-center">
        <div className="mb-4">
          <span className="font-extrabold text-sm text-brand block uppercase py-2">
            {section}
          </span>
          <div className="flex flex-col gap-4 font-bold text-5xl">
            <span className="block text-secondary">{title1}</span>
            <span className="block text-primary">{title2}</span>
          </div>
        </div>

        <p className="font-semibold text-base text-secondary my-1">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default Header;
