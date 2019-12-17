import { getWarType, addressToString } from "../helpers";

export const translateCustomer = customer => {
  if (!customer) return;

  // let appearDate;
  const privilegeDate =
    customer.privilegeDate &&
    new Date(customer.privilegeDate).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

  // if (customer.verifies && customer.verifies.length > 0) {
  //   const lastVerify = customer.verifies[0];

  //   appearDate =
  //     lastVerify.appearDate &&
  //     new Date(lastVerify.appearDate).toLocaleDateString("th-TH", {
  //       year: "numeric",
  //       month: "long",
  //       day: "numeric"
  //     });
  // }

  return {
    name: `${customer.title}${customer.firstName}\u00A0\u00A0${customer.lastName}`,
    peaId: customer.peaId,
    address: addressToString(customer.address),
    authorize: customer.authorize,
    soldierNo: customer.soldierNo,
    privilegeDate: privilegeDate,
    war: `${customer.war} ${getWarType(customer.war)}`
    // appearDate: appearDate
  };
};
