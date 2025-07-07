import React from "react";

function NavigationTab({
  first_value,
  second_value,
  third_value,
  active,
  text,
}) {
  const circleStyle = (num) => ({
    background: active === num ? "#2687F0" : "#E3F3FF",
    width: "3rem",
    height: "3rem",
    lineHeight: "3rem",
    borderRadius: "50%",
  });

  return (
    <div className="d-flex justify-content-around align-items-center w-100 w-md-75 mx-auto pt-5">
      {/* Step 1 */}
      <div
        className={`text-center ${
          active === 1 ? "d-block" : "d-none d-md-block"
        }`}
      >
        <div style={circleStyle(1)} className="fs-4 text-white">
          {text === 1 ? 1 : null}
        </div>
        <h6 className="mt-2">{first_value}</h6>
      </div>

      {/* Step 2 */}
      <div
        className={`text-center ${
          active === 2 ? "d-block" : "d-none d-md-block"
        }`}
      >
        <div style={circleStyle(2)} className="fs-4 text-white">
          {text === 2 ? 2 : null}
        </div>
        <h6 className="mt-2">{second_value}</h6>
      </div>

      {/* Step 3 */}
      <div
        className={`text-center ${
          active === 3 ? "d-block" : "d-none d-md-block"
        }`}
      >
        <div style={circleStyle(3)} className="fs-4 text-white">
          {text === 3 ? 3 : null}
        </div>
        <h6 className="mt-2">{third_value}</h6>
      </div>


    </div>
  );
}

export default NavigationTab;
