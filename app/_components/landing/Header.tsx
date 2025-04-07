const Header = ({ section, title1, title2, subtitle }: any) => {
  return (
    <div className="mb-14">
      <div className="mb-4">
        <span className="font-bold text-sm text-brand block uppercase py-2">
          {section}
        </span>
        <div className="font-bold text-5xl">
          <span className="block text-secondary">{title1}</span>
          <span className="block text-primary">{title2}</span>
        </div>
      </div>

      <p className="font-semibold text-base text-secondary my-1">{subtitle}</p>
    </div>
  );
};

export default Header;
