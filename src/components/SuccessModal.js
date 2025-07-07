import React from "react";
import { AiFillCheckCircle } from "react-icons/ai";

function SuccessModal() {
  return (
    <div className="text-center mt-5">
      <AiFillCheckCircle size={100} className="text-success" />
      <h2 className="mt-3">Profile Created Successfully!</h2>
      <p>Your organization profile has been created successfully.</p>
      <a href="/" className="btn btn-primary mt-4">
        Go to Dashboard
      </a>
    </div>
  );
}

export default SuccessModal;
