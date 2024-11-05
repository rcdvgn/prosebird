const Hashkit = require("hashkit");
const hashkit = new Hashkit();

export const encode = (firestoreId: any) => {
  return hashkit.decode(firestoreId);
};

export const decode = (encodedId: any) => {
  return hashkit.encode(encodedId);
};
