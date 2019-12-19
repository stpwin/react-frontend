import { addressToString, toLocalDate } from "../helpers";

const warsType = {
  ภายในประเทศ: "G1",
  เวียดนาม: "G1",
  เกาหลี: "G1",
  เอเชียบูรพา: "G2",
  อินโดจีน: "G2",
  ฝรั่งเศส: "G2"
};

export const getWarType = war => {
  return warsType[war];
};

export const translateCustomer = customer => {
  if (!customer) return;

  const privilegeDate =
    customer.privilegeDate && toLocalDate(customer.privilegeDate);

  return {
    name: `${customer.title}${customer.firstName}\u00A0\u00A0${customer.lastName}`,
    peaId: customer.peaId,
    address: addressToString(customer.address),
    authorize: customer.authorize,
    soldierNo: customer.soldierNo,
    privilegeDate: privilegeDate,
    war: `${customer.war} ${getWarType(customer.war)}`,
    ...getLastVerify(customer)
  };
};

const getLastVerify = ({ verifies }) => {
  if (verifies && verifies.length > 0) {
    const lastVerify = verifies[0];
    const appearDate =
      lastVerify.appearDate && toLocalDate(lastVerify.appearDate);
    const lastVerifyId = lastVerify._id;
    return {
      appearDate,
      lastVerifyId
    };
  }
};
