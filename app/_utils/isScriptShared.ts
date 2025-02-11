export const isScriptShared = (script: any) => {
  const participants = [...script.editors, ...script.viewers].filter(
    (participant: any) => participant !== script.createdBy
  );

  return participants.length ? true : false;
};
