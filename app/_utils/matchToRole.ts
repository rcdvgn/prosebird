const matchToRole = (script: any, roleFilter: any, user: any) => {
  if (roleFilter === "Author" && script.createdBy === user?.id) return true;
  if (roleFilter === "Editor" && script.editors.includes(user?.id)) return true;
  if (roleFilter === "Viewer" && script.viewers.includes(user?.id)) return true;
  return false;
};
export default matchToRole;
