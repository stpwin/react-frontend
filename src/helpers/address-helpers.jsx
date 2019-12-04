export function correctPostcode(districtNo) {
  if (
    districtNo === "520102" ||
    districtNo === "520104" ||
    districtNo === "520106" ||
    districtNo === "520108" ||
    districtNo === "520113" ||
    districtNo === "520114" ||
    districtNo === "520115" ||
    districtNo === "520116"
  ) {
    return 52100;
  } else if (districtNo === "520105") {
    return 52220;
  }
  return 52000;
}

export function getDistrictName(districtNo) {
  //   console.log(districtNo);
  switch (districtNo) {
    case "520101":
      return "เวียงเหนือ";
    case "520102":
      return "หัวเวียง";
    case "520103":
      return "สวนดอก";
    case "520104":
      return "สบตุ๋ย";
    case "520105":
      return "พระบาท";
    case "520106":
      return "ชมพู";
    case "520107":
      return "กล้วยแพะ";
    case "520108":
      return "ปงแสนทอง";
    case "520109":
      return "บ้านแลง";
    case "520110":
      return "บ้านเสด็จ";
    case "520111":
      return "พิชัย";
    case "520112":
      return "ทุ่งฝาย";
    case "520113":
      return "บ้านเอื้อม";
    case "520114":
      return "บ้านเป้า";
    case "520115":
      return "บ้านค่า";
    case "520116":
      return "บ่อแฮ้ว";
    case "520117":
      return "ต้นธงชัย";
    case "520118":
      return "นิคมพัฒนา";
    case "520119":
      return "บุญนาคพัฒนา";
    default:
      return "";
  }
}

export function getAddressStringByDistrictNo(districtNo, short = true) {
  return `${short ? "ต." : "ตำบล"}${getDistrictName(districtNo)} ${
    short ? "อ." : "อำเภอ"
  }เมือง ${short ? "จ." : "จังหวัด"}ลำปาง ${correctPostcode(districtNo)}`;
}

export function addressToString(addr, short = true) {
  return `เลขที่ ${addr.houseNo} ${short ? "ม." : "หมู่ "}${
    addr.mooNo
  } ${getAddressStringByDistrictNo(addr.districtNo, short)}`;
}
