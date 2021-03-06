import { addressToString, toLocalDate } from "../helpers";

const warsType = {
  ภายในประเทศ: "G1",
  เวียดนาม: "G1",
  เกาหลี: "G1",
  เหรียญชัยสมรภูมิ: "G2",
  เอเชียบูรพา: "G2",
  อินโดจีน: "G2",
  ฝรั่งเศส: "G2"
};

export const getWarType = war => {
  return warsType[war];
};

export const translateCustomer = (
  customer,
  fullDate = true,
  shortAddress = false,
  onlyDistrict = false,
  telInAddress = false,
  showNoTitle = false
) => {
  if (!customer) return;

  const privilegeDate =
    customer.privilegeDate && toLocalDate(customer.privilegeDate, fullDate);
  const warType = getWarType(customer.war);
  return {
    seq: `${warType}-${customer.seq || ""}`,
    name: `${customer.title}${customer.firstName}\u00A0\u00A0${customer.lastName}`,
    peaId: customer.peaId,
    address: `${addressToString(
      customer.address,
      shortAddress,
      onlyDistrict,
      showNoTitle
    )}\n${telInAddress && customer.tel ? customer.tel : ""}`,
    tel: customer.tel,
    description: customer.description,
    authorize: customer.authorize,
    soldierNo: customer.soldierNo,
    privilegeDate: privilegeDate,
    war: `${customer.war}`,
    ...getLastVerify(customer, fullDate)
  };
};

const getLastVerify = ({ verifies }, fullDate) => {
  if (verifies && verifies.length > 0) {
    verifies.sort((a, b) => {
      return new Date(b.appearDate) - new Date(a.appearDate);
    });
    const lastVerify = verifies[0];
    return {
      appearDate:
        lastVerify.appearDate && toLocalDate(lastVerify.appearDate, fullDate),
      lastVerifyId: lastVerify._id,
      lastApprovedDate:
        lastVerify.approvedDate &&
        toLocalDate(lastVerify.approvedDate, fullDate),
      lastAppear: lastVerify.appearDate ? true : false,
      lastApproved: lastVerify.approvedDate ? true : false
    };
  }
};
