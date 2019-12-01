import React, { Fragment } from "react";

import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";

import ListCustomer from "../../Customer/ListCustomer";
import AddCustomer from "../../Customer/AddCustomer";
import VerifyCustomer from "../../Customer/VerifyCustomer";
import EditCustomer from "../../Customer/EditCustomer";

export function Customers() {
  const { method, peaId } = useParams();

  return (
    <Container>
      {method === "add" ? (
        <Fragment>
          <h1 className='header-text text-center'>เพิ่มลูกค้า</h1>
          <AddCustomer peaId={peaId} />
        </Fragment>
      ) : method === "edit" ? (
        peaId ? (
          <Fragment>
            <h1 className='header-text text-center'>แก้ไขข้อมูลลูกค้า</h1>
            <EditCustomer peaId={peaId} />
          </Fragment>
        ) : (
          <NoPeaID />
        )
      ) : method === "verify" ? (
        peaId ? (
          <Fragment>
            <h1 className='header-text text-center'>ยืนยันสิทธิ์</h1>
            <VerifyCustomer peaId={peaId} />
          </Fragment>
        ) : (
          <NoPeaID />
        )
      ) : (
        <Fragment>
          <h1 className='header-text text-center'>จัดการข้อมูลลูกค้า</h1>
          <ListCustomer />
        </Fragment>
      )}
    </Container>
  );
}

const NoPeaID = () => {
  return <h3 className='text-center'>กรุณาระบุ peaId</h3>;
};

export default Customers;
