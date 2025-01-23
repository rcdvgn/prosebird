"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/_contexts/AuthContext";
import { useRouter } from "next/navigation";
import SplitView from "@/app/_components/SplitView";
import {
  AcademicIcon,
  CheckIcon,
  ChevronIcon,
  CircledCheckIcon,
  PersonalIcon,
  ProfessionalIcon,
} from "@/app/_assets/icons";
import OutsideClickHandler from "@/app/_components/utils/OutsideClickHandler";
import { plans } from "@/app/_lib/plans";
import { onboardUser } from "@/app/_services/client";

const OcuppationPicker = ({
  title,
  subtitle,
  icon,
  occupation,
  setOccupation,
  targetOccupation,
  activity,
  setActivity,
}: any) => {
  const isSelected = occupation === targetOccupation;

  const handleOccupationClick = () => {
    if (!occupation.length) {
      setOccupation(targetOccupation);
    } else {
      if (!isSelected) {
        setOccupation(targetOccupation);
        activity ? setActivity(null) : "";
      } else {
        setOccupation("");
      }
    }
    // isSelected ? setOccupation("") : setOccupation(targetOccupation);
  };

  return (
    <div
      onClick={handleOccupationClick}
      className={`group w-full rounded-xl border-border border-[1px] px-3.5 py-3 flex gap-6 items-center justify-start cursor-pointer ${
        isSelected ? "border-brand" : "hover:bg-hover hover:border-transparent"
      }`}
    >
      <div
        className={`rounded-[10px] border-border border-[1px] grid place-items-center h-[50px] aspect-square group-hover:border-transparent group-hover:bg-brand ${
          isSelected ? "border-transparent bg-brand" : ""
        }`}
      >
        {icon}
      </div>

      <div className="flex flex-col gap-2 grow">
        <div className="flex items-center justify-between">
          <span className="block text-primary text-sm font-bold">{title}</span>
          {isSelected && (
            <CircledCheckIcon className="text-primary h-4 fill-brand" />
          )}
        </div>
        <span className="block text-secondary text-[13px] font-semibold">
          {subtitle}
        </span>
      </div>
    </div>
  );
};

const Selector = ({ activity, setActivity, options }: any) => {
  const [isExpanded, setIsExpanded] = useState<any>(false);

  const handleOutsideClick = () => {
    isExpanded ? setIsExpanded(false) : "";
  };

  const handleOptionClick = (selectedActivity: any) => {
    setActivity(selectedActivity);

    handleOutsideClick();
  };

  return (
    <OutsideClickHandler onOutsideClick={handleOutsideClick} exceptionRefs={[]}>
      <div className="flex flex-col gap-1">
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-[44px] py-2.5 px-[14px] cursor-pointer text-primary text-sm font-medium rounded-lg outline-1 border-[1px] border-border"
        >
          {activity ? activity : "Select an option"}
        </div>

        <div
          className={`flex flex-col gap-1 w-full p-2 bg-middleground rounded-lg border-border border-[1px] max-h-64 overflow-y-scroll ${
            isExpanded ? "block" : "hidden"
          }`}
        >
          {options &&
            options.map((item: any, index: any) => {
              return (
                <span
                  key={index}
                  onClick={() => handleOptionClick(item)}
                  className="rounded-lg hover:bg-hover w-full py-2.5 px-4 h-[42px] text-primary font-semibold text-sm cursor-pointer flex justify-start items-center"
                >
                  {item}
                </span>
              );
            })}
        </div>
      </div>
    </OutsideClickHandler>
  );
};

const PersonalInfo = ({
  firstName,
  lastName,
  setFirstName,
  setLastName,
  occupation,
  setOccupation,
  activity,
  setActivity,
  handleForward,
  handlePrevious,
}: any) => {
  const professions = [
    "Academic librarian",
    "Accountant",
    "Accounting technician",
    "Actuary",
    "Adult nurse",
    "Advertising account executive",
    "Advertising account planner",
    "Advertising copywriter",
    "Advice worker",
    "Advocate (Scotland)",
    "Aeronautical engineer",
    "Agricultural consultant",
    "Agricultural manager",
    "Aid worker/humanitarian worker",
    "Air traffic controller",
    "Airline cabin crew",
    "Amenity horticulturist",
    "Analytical chemist",
    "Animal nutritionist",
    "Animator",
    "Archaeologist",
    "Architect",
    "Architectural technologist",
    "Archivist",
    "Armed forces officer",
    "Aromatherapist",
    "Art therapist",
    "Arts administrator",
    "Auditor",
    "Automotive engineer",
    "Barrister",
    "Barrister’s clerk",
    "Bilingual secretary",
    "Biomedical engineer",
    "Biomedical scientist",
    "Biotechnologist",
    "Brand manager",
    "Broadcasting presenter",
    "Building control officer/surveyor",
    "Building services engineer",
    "Building surveyor",
    "Camera operator",
    "Careers adviser (higher education)",
    "Careers adviser",
    "Careers consultant",
    "Cartographer",
    "Catering manager",
    "Charities administrator",
    "Charities fundraiser",
    "Chemical (process) engineer",
    "Child psychotherapist",
    "Children's nurse",
    "Chiropractor",
    "Civil engineer",
    "Civil Service administrator",
    "Clinical biochemist",
    "Clinical cytogeneticist",
    "Clinical microbiologist",
    "Clinical molecular geneticist",
    "Clinical research associate",
    "Clinical scientist - tissue typing",
    "Clothing and textile technologist",
    "Colour technologist",
    "Commercial horticulturist",
    "Commercial/residential/rural surveyor",
    "Commissioning editor",
    "Commissioning engineer",
    "Commodity broker",
    "Communications engineer",
    "Community arts worker",
    "Community education officer",
    "Community worker",
    "Company secretary",
    "Computer sales support",
    "Computer scientist",
    "Conference organiser",
    "Consultant",
    "Consumer rights adviser",
    "Control and instrumentation engineer",
    "Corporate banker",
    "Corporate treasurer",
    "Counsellor",
    "Courier/tour guide",
    "Court reporter/verbatim reporter",
    "Credit analyst",
    "Crown Prosecution Service lawyer",
    "Crystallographer",
    "Curator",
    "Customs officer",
    "Cyber security specialist",
    "Dance movement therapist",
    "Data analyst",
    "Data scientist",
    "Data visualisation analyst",
    "Database administrator",
    "Debt/finance adviser",
    "Dental hygienist",
    "Dentist",
    "Design engineer",
    "Dietitian",
    "Diplomatic service",
    "Doctor (general practitioner, GP)",
    "Doctor (hospital)",
    "Dramatherapist",
    "Economist",
    "Editorial assistant",
    "Education administrator",
    "Electrical engineer",
    "Electronics engineer",
    "Employment advice worker",
    "Energy conservation officer",
    "Engineering geologist",
    "Environmental education officer",
    "Environmental health officer",
    "Environmental manager",
    "Environmental scientist",
    "Equal opportunities officer",
    "Equality and diversity officer",
    "Ergonomist",
    "Estate agent",
    "European Commission administrators",
    "Exhibition display designer",
    "Exhibition organiser",
    "Exploration geologist",
    "Facilities manager",
    "Field trials officer",
    "Financial manager",
    "Firefighter",
    "Fisheries officer",
    "Fitness centre manager",
    "Food scientist",
    "Food technologist",
    "Forensic scientist",
    "Geneticist",
    "Geographical information systems manager",
    "Geomatics/land surveyor",
    "Government lawyer",
    "Government research officer",
    "Graphic designer",
    "Health and safety adviser",
    "Health and safety inspector",
    "Health promotion specialist",
    "Health service manager",
    "Health visitor",
    "Herbalist",
    "Heritage manager",
    "Higher education administrator",
    "Higher education advice worker",
    "Homeless worker",
    "Horticultural consultant",
    "Hotel manager",
    "Housing adviser",
    "Human resources officer",
    "Hydrologist",
    "Illustrator",
    "Immigration officer",
    "Immunologist",
    "Industrial/product designer",
    "Information scientist",
    "Information systems manager",
    "Information technology/software trainers",
    "Insurance broker",
    "Insurance claims inspector",
    "Insurance risk surveyor",
    "Insurance underwriter",
    "Interpreter",
    "Investment analyst",
    "Investment banker - corporate finance",
    "Investment banker – operations",
    "Investment fund manager",
    "IT consultant",
    "IT support analyst",
    "Journalist",
    "Laboratory technician",
    "Land-based engineer",
    "Landscape architect",
    "Learning disability nurse",
    "Learning mentor",
    "Lecturer (adult education)",
    "Lecturer (further education)",
    "Lecturer (higher education)",
    "Legal executive",
    "Leisure centre manager",
    "Licensed conveyancer",
    "Local government administrator",
    "Local government lawyer",
    "Logistics/distribution manager",
    "Magazine features editor",
    "Magazine journalist",
    "Maintenance engineer",
    "Management accountant",
    "Manufacturing engineer",
    "Manufacturing machine operator",
    "Manufacturing toolmaker",
    "Marine scientist",
    "Market research analyst",
    "Market research executive",
    "Marketing account manager",
    "Marketing assistant",
    "Marketing executive",
    "Marketing manager (social media)",
    "Materials engineer",
    "Materials specialist",
    "Mechanical engineer",
    "Media analyst",
    "Media buyer",
    "Media planner",
    "Medical physicist",
    "Medical representative",
    "Mental health nurse",
    "Metallurgist",
    "Meteorologist",
    "Microbiologist",
    "Midwife",
    "Mining engineer",
    "Mobile developer",
    "Multimedia programmer",
    "Multimedia specialists",
    "Museum education officer",
    "Museum/gallery exhibition officer",
    "Music therapist",
    "Nanoscientist",
    "Nature conservation officer",
    "Naval architect",
    "Network administrator",
    "Nurse",
    "Nutritional therapist",
    "Nutritionist",
    "Occupational therapist",
    "Oceanographer",
    "Office manager",
    "Operational researcher",
    "Orthoptist",
    "Outdoor pursuits manager",
    "Packaging technologist",
    "Paediatric nurse",
    "Paramedic",
    "Patent attorney",
    "Patent examiner",
    "Pension scheme manager",
    "Personal assistant",
    "Petroleum engineer",
    "Pharmacist",
    "Pharmacologist",
    "Pharmacovigilance officer",
    "Photographer",
    "Physiotherapist",
    "Picture researcher",
    "Planning and development surveyor",
    "Planning technician",
    "Plant breeder",
    "Police officer",
    "Political party agent",
    "Political party research officer",
    "Practice nurse",
    "Press photographer",
    "Press sub-editor",
    "Prison officer",
    "Private music teacher",
    "Probation officer",
    "Product development scientist",
    "Production manager",
    "Programme researcher",
    "Project manager",
    "Psychologist (clinical)",
    "Psychologist (educational)",
    "Psychotherapist",
    "Public affairs consultant (lobbyist)",
    "Public affairs consultant (research)",
    "Public house manager",
    "Public librarian",
    "Public relations (PR) officer",
    "QA analyst",
    "Quality assurance manager",
    "Quantity surveyor",
    "Records manager",
    "Recruitment consultant",
    "Recycling officer",
    "Regulatory affairs officer",
    "Research chemist",
    "Research scientist",
    "Restaurant manager",
    "Retail banker",
    "Retail buyer",
    "Retail manager",
    "Retail merchandiser",
    "Retail pharmacist",
    "Sales executive",
    "Sales manager",
    "Scene of crime officer",
    "Secretary",
    "Seismic interpreter",
    "Site engineer",
    "Site manager",
    "Social researcher",
    "Social worker",
    "Software developer",
    "Soil scientist",
    "Solicitor",
    "Speech and language therapist",
    "Sports coach",
    "Sports development officer",
    "Sports therapist",
    "Statistician",
    "Stockbroker",
    "Structural engineer",
    "Systems analyst",
    "Systems developer",
    "Tax inspector",
    "Teacher (nursery/early years)",
    "Teacher (primary)",
    "Teacher (secondary)",
    "Teacher (special educational needs)",
    "Teaching/classroom assistant",
    "Technical author",
    "Technical sales engineer",
    "TEFL/TESL teacher",
    "Television production assistant",
    "Test automation developer",
    "Tour operator",
    "Tourism officer",
    "Tourist information manager",
    "Town and country planner",
    "Toxicologist",
    "Trade union research officer",
    "Trader",
    "Trading standards officer",
    "Training and development officer",
    "Translator",
    "Transportation planner",
    "Travel agent",
    "TV/film/theatre set designer",
    "UX designer",
    "Validation engineer",
    "Veterinary nurse",
    "Veterinary surgeon",
    "Video game designer",
    "Video game developer",
    "Volunteer work organiser",
    "Warehouse manager",
    "Waste disposal officer",
    "Water conservation officer",
    "Water engineer",
    "Web designer",
    "Web developer",
    "Welfare rights adviser",
    "Writer",
    "Youth worker",
  ];
  const educationLevels = [
    "Primary School",
    "Middle School",
    "High School",
    "Vocational Training",
    "Associate's Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate (Ph.D.)",
    "Postdoctoral Research",
  ];

  const activities: any = {
    student: educationLevels,
    professional: professions,
  };

  return (
    <>
      <div className="w-[480px] flex justify-center items-start">
        <div className="flex flex-col gap-12 w-full">
          <div className="flex gap-3.5">
            <div className="flex flex-col gap-4 grow">
              <label className="text-primary text-sm font-semibold">
                First name*
              </label>
              <input
                type="text"
                value={firstName}
                placeholder="E.g. Gabriella"
                className="input-default w-full"
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-4 grow">
              <label className="text-primary text-sm font-semibold">
                Last name*
              </label>
              <input
                type="text"
                value={lastName}
                placeholder="E.g. Molina"
                className="input-default w-full"
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 grow">
            <label className="text-primary text-sm font-semibold">
              How are you going to use Cyrus?
            </label>

            <div className="flex flex-col gap-5">
              <OcuppationPicker
                title="I’m a student"
                subtitle="Use Cyrus for school activities, group projects, or presentations"
                icon={<AcademicIcon className="text-primary h-4" />}
                occupation={occupation}
                setOccupation={setOccupation}
                targetOccupation="student"
                activity={activity}
                setActivity={setActivity}
              />

              <OcuppationPicker
                title="I’m a professional"
                subtitle="For work meetings, webinars, and professional events"
                icon={<ProfessionalIcon className="text-primary h-4" />}
                occupation={occupation}
                setOccupation={setOccupation}
                targetOccupation="professional"
                activity={activity}
                setActivity={setActivity}
              />

              <OcuppationPicker
                title="I’ll use it personally"
                subtitle="Perfect for personal projects and creative pursuits"
                icon={<PersonalIcon className="text-primary h-4" />}
                occupation={occupation}
                setOccupation={setOccupation}
                targetOccupation="personal"
                activity={activity}
                setActivity={setActivity}
              />
            </div>
          </div>
          {(occupation === "student" || occupation === "professional") && (
            <div className="flex flex-col gap-4">
              <label className="text-primary text-sm font-semibold">
                Tell more
              </label>

              <Selector
                activity={activity}
                setActivity={setActivity}
                options={activities[occupation]}
              />
            </div>
          )}
        </div>
      </div>
      <Controls handleForward={handleForward} handlePrevious={handlePrevious} />
    </>
  );
};

const PlanSelection = ({
  pricingFormat,
  setPricingFormat,
  selectedPlan,
  setSelectedPlan,
  user,
  userData,
}: any) => {
  const handleSelectPlan = (plan: any) => {
    if (selectedPlan === plan) {
      setSelectedPlan("");
    } else {
      setSelectedPlan(plan);
    }
  };

  const dummyPlans = [
    {
      name: "free",
      description:
        "Ideal for those who’ve already got their website up and running and are seeking assistance to enhance and update it further",
      price: { monthly: "0.00", yearly: "0.00" },
      priceId: "price_1QOZ8TGC0DoVg5C56oYPrTUD",
    },
    {
      name: "standard",
      description:
        "Ideal for those who’ve already got their website up and running and are seeking assistance to enhance and update it further",
      price: { monthly: "12.99", yearly: "9.99" },
      priceId: "price_1QOZ8TGC0DoVg5C56oYPrTUD",
    },
    {
      name: "enterprise",
      description:
        "Ideal for those who’ve already got their website up and running and are seeking assistance to enhance and update it further",
      price: null,
      priceId: "price_1QOZ8TGC0DoVg5C56oYPrTUD",
    },
  ];

  const handlePlanSelection = async (planName: any) => {
    if (planName !== "standard") return;

    await onboardUser(user.id, userData);

    window.open(
      `${plans[pricingFormat].link}?prefilled_email=${user.email}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleSubscribe = async (priceId: any) => {
    await onboardUser(user.id, userData);

    const response = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      body: JSON.stringify({
        userId: user?.id,
        customerId: user?.customerId || null,
        customerEmail: user?.email,
        priceId: priceId,
      }),
    });
    const { url } = await response.json();

    window.location.href = url; // Redirect to Stripe Checkout
  };

  return (
    <div className="w-[480px] flex justify-center items-start">
      <div className="w-full">
        <div className="flex justify-center my-8">
          <span
            onClick={() => setPricingFormat("monthly")}
            className={`cursor-pointer text-xs font-bold text-brand rounded-full py-2.5 px-3 ${
              pricingFormat === "monthly"
                ? "bg-brand/15 text-brand"
                : "text-inactive hover:text-primary"
            }`}
          >
            Monthly
          </span>
          <span
            onClick={() => setPricingFormat("yearly")}
            className={`cursor-pointer text-xs font-bold text-brand rounded-full py-2.5 px-3 ${
              pricingFormat === "yearly"
                ? "bg-brand/15 text-brand"
                : "text-inactive hover:text-primary"
            }`}
          >
            Yearly
          </span>
        </div>

        <div className="flex flex-col gap-3.5">
          {plans.map((plan: any, index: any) => {
            return (
              <div
                key={index}
                onClick={() => handleSelectPlan(plan.name)}
                className="group cursor-pointer hover:bg-hover rounded-[14px] bg-foreground border-border border-[1px] py-3.5 px-5"
              >
                <div className="flex items-center justify-between py-[5px]">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-primary">
                      {plan.name.charAt(0).toUpperCase() +
                        String(plan.name).slice(1)}
                    </span>
                    {plan.name === "standard" && (
                      <span className="bg-money-green/15 rounded-[5px] py-1 px-1.5 text-money-green font-bold text-[10px]">
                        Save 15%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-5">
                    <span className="flex items-center gap-1">
                      <span className="text-sm font-bold text-primary">
                        {plan[pricingFormat].priceInUSD
                          ? "$" + plan[pricingFormat].priceInUSD
                          : ""}
                      </span>
                      <span className="text-xs font-semibold text-secondary">
                        {plan.name !== "enterprise" ? "/mo" : ""}
                      </span>
                    </span>

                    <ChevronIcon
                      className={`transtion-all ease-in-out duration-100 text-inactive h-2 ${
                        selectedPlan === plan.name
                          ? "rotate-90"
                          : "group-hover:translate-x-0.5"
                      }`}
                    />
                  </div>
                </div>

                <div
                  className={`${
                    selectedPlan === plan.name ? "block" : "hidden"
                  }`}
                >
                  <div className="pb-5 pt-3.5 border-b-2 border-border">
                    <span className="font-semibold text-[13px] text-secondary leading-[22px]">
                      {plan.description}
                    </span>
                  </div>

                  <div className="flex flex-col gap-5 py-6">
                    {Array.from({ length: 5 }).map((_: any, index: any) => {
                      return (
                        <div key={index} className="flex items-center gap-3">
                          <CheckIcon className="text-success-green w-2.5" />
                          <span className="font-medium text-sm text-primary">
                            Everything included in the free tier
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handleSubscribe(plan[pricingFormat].priceId)}
                    className="btn-1-lg w-full"
                  >
                    {plan.name === "enterprise"
                      ? "Contact sales"
                      : "Get started"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Controls = ({ handleForward, handlePrevious }: any) => {
  return (
    <div className="sticky bottom-[-1px] p-4 flex justify-between items-center mt-auto w-full">
      <button onClick={handlePrevious} className="btn-1-md">
        Go back
      </button>

      <button onClick={handleForward} className="btn-1-md">
        Continue
      </button>
    </div>
  );
};

export default function Onboarding() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState<any>("");
  const [lastName, setLastName] = useState<any>("");
  const [occupation, setOccupation] = useState<any>("");
  const [activity, setActivity] = useState<any>(null);
  const [pricingFormat, setPricingFormat] = useState<any>("monthly");
  const [selectedPlan, setSelectedPlan] = useState<any>("monthly");

  const [progress, setProgress] = useState<any>(0);

  const handleForward = () => {
    if (progress < Object.keys(screens).length - 1) {
      setProgress((currProgress: any) => currProgress + 1);
    }
  };

  const handlePrevious = () => {
    if (progress > 0) {
      setProgress((currProgress: any) => currProgress - 1);
    }
  };

  const handleSubmit = () => {
    console.log({
      firstName,
      lastName,
    });
  };

  const screens: any = {
    0: (
      <PersonalInfo
        setFirstName={setFirstName}
        setLastName={setLastName}
        firstName={firstName}
        lastName={lastName}
        occupation={occupation}
        setOccupation={setOccupation}
        activity={activity}
        setActivity={setActivity}
        handleForward={handleForward}
        handlePrevious={handlePrevious}
      />
    ),

    1: (
      <PlanSelection
        pricingFormat={pricingFormat}
        setPricingFormat={setPricingFormat}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        user={user}
        userData={{ firstName, lastName, occupation, activity }}
      />
    ),
  };

  useEffect(() => {
    if (user) {
      if (user.firstName) {
        router.push("/files");
      }
    } else {
      router.push("/");
    }
  }, [user]);

  // useEffect(() => {
  //   return () => {
  //     logout();
  //   };
  // }, []);

  return user && !user.firstName ? (
    <SplitView options={{ side: "left", containerWidth: "fit" }}>
      <div className="relative overflow-y-scroll w-[700px] h-full flex flex-col justify-between items-center px-4 pt-4">
        {screens[progress]}
      </div>
    </SplitView>
  ) : null;
}
