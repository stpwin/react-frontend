import React from "react";
import { useParams } from "react-router-dom";
import VerifyCustomerForm from "../../Customer/VerifyCustomerForm";
import { Container } from "react-bootstrap";

export function VerifyCustomer() {
  let { peaId } = useParams();

  return (
    <Container>
      <h1 className="header-text text-center">ยืนยันสิทธิ์</h1>
      {/* <h3>ID: {peaId}</h3> */}
      <VerifyCustomerForm peaId={peaId} />
    </Container>
  );
}

export default VerifyCustomer;
