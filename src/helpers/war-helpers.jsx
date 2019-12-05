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
