"use client";

import { AddIcon, XDeleteIcon, TeamIcon, UserIcon } from "@/app/_assets/icons";

const Team = ({ formData, setFormData, error }: any) => {
  const selectedOption = formData.team;

  const handleSelect = (value: boolean | null) => {
    setFormData((prev: any) => ({
      ...prev,
      team: value,
    }));
  };

  const options = [
    {
      text: "Alone, just me",
      Icon: UserIcon,
      value: false,
    },
    {
      text: "With my team",
      Icon: TeamIcon,
      value: true,
    },
  ];

  return (
    <div className="flex flex-col gap-16 w-full">
      <div className="flex items-center gap-3">
        {options.map((item, index) => {
          const isSelected = selectedOption === item.value;
          const Icon = item.Icon;

          return (
            <div
              key={index}
              onClick={() => handleSelect(isSelected ? null : item.value)}
              className={`group aspect-square grow rounded-2xl select-none cursor-pointer flex flex-col justify-between items-center p-4 border-[1px] ${
                isSelected
                  ? "bg-brand/15 border-brand/20 text-brand"
                  : "border-stroke bg-background hover:bg-hover text-placeholder"
              }`}
            >
              <span
                className={`text-sm font-bold my-4 invisible ${
                  isSelected ? "!text-brand" : "!text-primary"
                }`}
              >
                {item.text}
              </span>

              <Icon
                filled={true}
                className={`h-12 -translate-y-1/4 transition-all duration-150 ease-in-out ${
                  isSelected ? "scale-110" : "group-hover:scale-110"
                }`}
              />

              <span
                className={`text-sm font-bold my-4 ${
                  isSelected ? "!text-brand" : "!text-primary"
                }`}
              >
                {item.text}
              </span>
            </div>
          );
        })}
      </div>

      {selectedOption === true && (
        <Contacts contacts={formData.contacts} setFormData={setFormData} />
      )}

      {error?.team && (
        <span className="text-xs text-red-500 font-medium my-4 px-1 block">
          {error.team}
        </span>
      )}
    </div>
  );
};

const Contacts = ({ contacts, setFormData }: any) => {
  const updateEmails = (emails: string[]) =>
    setFormData((prev: any) => ({
      ...prev,
      contacts: emails,
    }));

  const handleChange = (index: number, value: string) => {
    const updated = [...contacts];
    updated[index] = value;
    updateEmails(updated);
  };

  const addEmail = () => updateEmails([...contacts, ""]);
  const removeEmail = (index: number) =>
    updateEmails(contacts.filter((_: any, i: any) => i !== index));

  return (
    <div className="flex flex-col gap-4 items-start w-full">
      <span className="text-primary text-xl font-bold px-3.5 mb-2">
        Invite your team
      </span>

      <div className="flex flex-col gap-3 items-center w-full">
        {contacts.map((email: string, index: number) => (
          <div key={index} className="flex items-center gap-2.5 w-full">
            <input
              value={email}
              onChange={(e) => handleChange(index, e.target.value)}
              type="text"
              className="input-default grow"
              placeholder={`Email address ${index + 1}`}
            />

            {index > 0 ? (
              <span
                className="button-icon shrink-0 !bg-transparent"
                onClick={() => removeEmail(index)}
              >
                <XDeleteIcon className="h-3" />
              </span>
            ) : (
              <span className="invisible button-icon shrink-0" />
            )}
          </div>
        ))}
      </div>

      <span
        onClick={addEmail}
        className="flex items-center gap-1.5 cursor-pointer"
      >
        <AddIcon className="h-3 text-brand" />
        <span className="text-brand font-semibold text-[13px]">
          Add another
        </span>
      </span>
    </div>
  );
};

export default Team;
