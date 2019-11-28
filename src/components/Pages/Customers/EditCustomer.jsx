import React from "react";
import { useParams } from "react-router-dom";

export function EditCustomer() {
  let { peaId } = useParams();

  return (
    <div>
      <h1>Edit Customer</h1>
      <h3>ID: {peaId}</h3>
    </div>
  );
}

export default EditCustomer;
