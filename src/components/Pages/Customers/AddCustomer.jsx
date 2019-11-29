import React from "react";
import { useParams } from "react-router-dom";
import AddCustomerForm from "../../Customer/AddCustomerForm";
import { Container } from "react-bootstrap";

export function AddCustomer() {
  let { peaId } = useParams();

  return (
    <Container>
      <h1 className="header-text text-center">เพิ่มลูกค้า</h1>
      <AddCustomerForm peaId={peaId} />
    </Container>
  );
}

export default AddCustomer;
