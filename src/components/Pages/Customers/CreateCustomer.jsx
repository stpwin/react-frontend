import React from "react";
import { useParams } from "react-router-dom";

export function CreateCustomer() {
  let { peaId } = useParams();

  return (
    <div>
      <h1>Create Customer</h1>
      <h3>ID: {peaId}</h3>
    </div>
  );
}

export default CreateCustomer;
