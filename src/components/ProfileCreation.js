import React, { useState, useEffect } from "react";
import NavigationTab from "./NavigationTab";
import { MdAddCircleOutline, MdClose } from "react-icons/md";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import successGif from "./Animation - 1741411058723.gif"; // Ensure this path is correct

function ProfileCreation() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Step 1: Organization (Basic Info)
  const [profileData, setProfileData] = useState({
    name: "",
    phone_no: "",
    website: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  // Step 2: Office Details
  const [departments, setDepartments] = useState([]);
  const [departmentText, setDepartmentText] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [locations, setLocations] = useState([]);

  // Step 3: Social Links
  const [socialDetails, setSocialDetails] = useState({
    facebook_url: "",
    insta_url: "",
    linkedin_url: "",
    yt_url: "",
  });

  // Error, success, and modal state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // URL and phone number validation regex
  const urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/i;
  const facebookRegex = /^(https?:\/\/)?(www\.)?(facebook|fb)\.com\/.+$/i;
  const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/.+$/i;
  const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/i;
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i;
  const phoneRegex = /^\d{10}$/; // Exactly 10 digits

  // Load saved data and set step from URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#office") setStep(2);
    else if (hash === "#social") setStep(3);
    else setStep(1);

    const savedData = localStorage.getItem("profileFormData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setProfileData(parsedData.profileData || { name: "", phone_no: "", website: "" });
      setDepartments(parsedData.departments || []);
      setAddress(parsedData.address || "");
      setCity(parsedData.city || "");
      setCountry(parsedData.country || "");
      setRegion(parsedData.region || "");
      setLocations(parsedData.locations || []);
      setSocialDetails(
        parsedData.socialDetails || {
          facebook_url: "",
          insta_url: "",
          linkedin_url: "",
          yt_url: "",
        }
      );
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage();
  }, [profileData, departments, address, city, country, region, locations, socialDetails]);

  const saveToLocalStorage = () => {
    const formData = {
      profileData,
      departments,
      address,
      city,
      country,
      region,
      locations,
      socialDetails,
    };
    localStorage.setItem("profileFormData", JSON.stringify(formData));
  };

  // Update step and URL hash
  const goToStep = (newStep) => {
    setStep(newStep);
    if (newStep === 1) window.location.hash = "#organization";
    else if (newStep === 2) window.location.hash = "#office";
    else if (newStep === 3) window.location.hash = "#social";
  };

  // Validation functions
  const validateStep1 = () => {
    if (!profileData.name.trim()) {
      setError("Organization Name is required");
      return false;
    }
    if (!profileData.phone_no.trim()) {
      setError("Phone Number is required");
      return false;
    }
    if (!phoneRegex.test(profileData.phone_no)) {
      setError("Phone Number must be exactly 10 digits");
      return false;
    }
    if (profileData.website && !urlRegex.test(profileData.website)) {
      setError("Please enter a valid website URL (e.g., https://example.com)");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (departments.length === 0) {
      setError("At least one department is required");
      return false;
    }
    if (locations.length === 0) {
      setError("At least one location is required");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (socialDetails.facebook_url && !facebookRegex.test(socialDetails.facebook_url)) {
      setError("Please enter a valid Facebook URL (e.g., https://facebook.com/...)");
      return false;
    }
    if (socialDetails.insta_url && !instagramRegex.test(socialDetails.insta_url)) {
      setError("Please enter a valid Instagram URL (e.g., https://instagram.com/...)");
      return false;
    }
    if (socialDetails.linkedin_url && !linkedinRegex.test(socialDetails.linkedin_url)) {
      setError("Please enter a valid LinkedIn URL (e.g., https://linkedin.com/...)");
      return false;
    }
    if (socialDetails.yt_url && !youtubeRegex.test(socialDetails.yt_url)) {
      setError("Please enter a valid YouTube URL (e.g., https://youtube.com/...)");
      return false;
    }
    return true; // Social fields are optional
  };

  // Navigation handlers
  const handleNext = (e) => {
    e.preventDefault();
    setError("");

    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    
    goToStep(step + 1);
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    setError("");
    goToStep(step - 1);
  };

  // Add department handler
  const handleAddDepartment = (e) => {
    e.preventDefault();
    if (departmentText.trim()) {
      setDepartments([...departments, departmentText]);
      setDepartmentText("");
    }
  };

  // Remove department handler
  const handleRemoveDepartment = (index) => {
    setDepartments(departments.filter((_, i) => i !== index));
  };

  // Add location handler
  const handleAddLocation = (e) => {
    e.preventDefault();
    if (
      address.trim() &&
      city.trim() &&
      country.trim() &&
      region.trim()
    ) {
      const locationString = [address, city, country, region].join(", ");
      setLocations([...locations, locationString]);
      setAddress("");
      setCity("");
      setCountry("");
      setRegion("");
      setError("");
    } else {
      setError("Please provide all four fields: Address, City, Country, and Region");
    }
  };

  // Remove location handler
  const handleRemoveLocation = (index) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  // Final submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateStep1() || !validateStep2() || !validateStep3()) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.userId) {
      setError("Please log in to create a profile.");
      navigate("/recruiter");
      return;
    }

    const formData = new FormData();
    formData.append("organizationId", user.userId);
    formData.append("name", profileData.name);
    formData.append("phone_no", profileData.phone_no);
    formData.append("website", profileData.website);
    if (selectedImage) {
      formData.append("logo", selectedImage);
    }
    formData.append("departments", JSON.stringify(departments));
    formData.append("locations", JSON.stringify(locations));
    formData.append("facebook_url", socialDetails.facebook_url);
    formData.append("linkedin_url", socialDetails.linkedin_url);
    formData.append("insta_url", socialDetails.insta_url);
    formData.append("yt_url", socialDetails.yt_url);

    try {
      const response = await axios.post("https://smart-recruiter-backend.onrender.com/api/profiles/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Profile created successfully!");
      setShowSuccessModal(true); // Show the success modal
      localStorage.removeItem("profileFormData");
    } catch (error) {
      setError(error.response?.data?.message || "Error submitting profile");
      console.error("Submission error:", error);
    }
  };

  // Close modal handler
  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/recruiter/dashboard/home"); // Optional: Redirect to home or another page after closing
  };

  // Render steps
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="container my-4 mt-5">
            <div className="card mx-auto shadow p-3 p-md-4" style={{ maxWidth: "800px" }}>
              <NavigationTab
                first_value="Organization"
                second_value="Office Details"
                third_value="Social Links"
                fourth_value=""
                active={1}
                text={1}
              />
              {error && <div className="alert alert-danger">{error}</div>}
              {success && !showSuccessModal && <div className="alert alert-success">{success}</div>}
              <form className="mt-3">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Organization Name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Phone No. *</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="1234567890"
                      value={profileData.phone_no}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 10) {
                          setProfileData({ ...profileData, phone_no: value });
                        }
                      }}
                      maxLength={10}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Website</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://example.com"
                      value={profileData.website}
                      onChange={(e) =>
                        setProfileData({ ...profileData, website: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Logo</label>
                    <div className="d-flex align-items-center gap-2">
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setSelectedImage(e.target.files[0])}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <button type="button" className="btn btn-primary px-5" onClick={handleNext}>
                    NEXT
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="container my-4">
            <div className="card mx-auto shadow p-3 p-md-4" style={{ maxWidth: "800px" }}>
              <NavigationTab
                first_value="Organization"
                second_value="Office Details"
                third_value="Social Links"
                fourth_value=""
                active={2}
                text={2}
              />
              {error && <div className="alert alert-danger">{error}</div>}
              {success && !showSuccessModal && <div className="alert alert-success">{success}</div>}
              <div className="row mt-3">
                <div className="col-12 col-md-6">
                  <h6 className="fw-bold">1-Departments *</h6>
                  <div className="d-flex gap-2 mt-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add Department"
                      value={departmentText}
                      onChange={(e) => setDepartmentText(e.target.value)}
                    />
                    <button className="btn btn-outline-primary" onClick={handleAddDepartment}>
                      <MdAddCircleOutline size={24} />
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {departments.map((dep, i) => (
                      <span
                        key={i}
                        className="badge bg-primary position-relative d-flex align-items-center justify-content-between"
                        style={{ padding: "5px 25px 5px 10px" }}
                      >
                        {dep}
                        <button
                          className="position-absolute"
                          style={{
                            right: "5px",
                            border: "none",
                            background: "transparent",
                            color: "white",
                            cursor: "pointer",
                            padding: 0,
                            lineHeight: 0,
                          }}
                          onClick={() => handleRemoveDepartment(i)}
                        >
                          <MdClose size={16} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-12 col-md-6 mt-4 mt-md-0">
                  <h6 className="fw-bold">2-Office Location *</h6>
                  <div className="mt-2">
                    <label className="form-label">Address *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="F-8/Makraz ISB"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="row g-2 mt-2">
                    <div className="col-12 col-md-6">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Attock"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Country *</label>
                      <CountryDropdown
                        className="form-select"
                        value={country}
                        onChange={(val) => setCountry(val)}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Region *</label>
                      <div className="d-flex gap-2">
                        <RegionDropdown
                          className="form-select"
                          country={country}
                          value={region}
                          onChange={(val) => setRegion(val)}
                        />
                        <button className="btn btn-outline-primary" onClick={handleAddLocation}>
                          <MdAddCircleOutline size={24} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {locations.map((loc, i) => (
                      <span
                        key={i}
                        className="badge bg-primary position-relative d-flex align-items-center justify-content-between"
                        style={{ padding: "5px 25px 5px 10px" }}
                      >
                        {loc}
                        <button
                          className="position-absolute"
                          style={{
                            right: "5px",
                            border: "none",
                            background: "transparent",
                            color: "white",
                            cursor: "pointer",
                            padding: 0,
                            lineHeight: 0,
                          }}
                          onClick={() => handleRemoveLocation(i)}
                        >
                          <MdClose size={16} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-center mt-4 d-flex flex-column flex-md-row justify-content-between">
                <button className="btn btn-primary px-5 mb-3 mb-md-0" onClick={handlePrevious}>
                  Previous
                </button>
                <button className="btn btn-primary px-5" onClick={handleNext}>
                  NEXT
                </button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="container my-4">
            <div className="card mx-auto shadow p-3 p-md-4" style={{ maxWidth: "800px" }}>
              <NavigationTab
                first_value="Organization"
                second_value="Office Details"
                third_value="Social Links"
                fourth_value=""
                active={3}
                text={3}
              />
              {error && <div className="alert alert-danger">{error}</div>}
              {success && !showSuccessModal && <div className="alert alert-success">{success}</div>}
              <div className="mt-3">
                <h6 className="fw-bold text-center mb-3">Add Social Links</h6>
                <div className="row g-3">
                  <div className="col-12 col-md-6 d-flex align-items-center gap-2">
                    <FaFacebookF className="fs-5 text-info" />
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://facebook.com/..."
                      value={socialDetails.facebook_url}
                      onChange={(e) =>
                        setSocialDetails({
                          ...socialDetails,
                          facebook_url: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6 d-flex align-items-center gap-2">
                    <FaLinkedinIn className="fs-5 text-info" />
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://linkedin.com/..."
                      value={socialDetails.linkedin_url}
                      onChange={(e) =>
                        setSocialDetails({
                          ...socialDetails,
                          linkedin_url: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6 d-flex align-items-center gap-2">
                    <FaInstagram className="fs-5 text-info" />
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://instagram.com/..."
                      value={socialDetails.insta_url}
                      onChange={(e) =>
                        setSocialDetails({
                          ...socialDetails,
                          insta_url: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6 d-flex align-items-center gap-2">
                    <FaYoutube className="fs-5 text-info" />
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://youtube.com/..."
                      value={socialDetails.yt_url}
                      onChange={(e) =>
                        setSocialDetails({
                          ...socialDetails,
                          yt_url: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="text-center mt-4 d-flex flex-column flex-md-row justify-content-between">
                <button className="btn btn-primary px-5 mb-3 mb-md-0" onClick={handlePrevious}>
                  Previous
                </button>
                <button className="btn btn-primary px-5" onClick={handleSubmit}>
                  SUBMIT
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-background w-full min-vh-100">
      <h2 className="heading2 text-center pt-10 mt-5">Profile Creation</h2>
      {renderStep()}

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "300px",
              position: "relative",
              textAlign: "center",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            {/* Close Button */}
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                border: "none",
                background: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#666",
              }}
              onClick={handleCloseModal}
            >
              ×
            </button>

            {/* Success GIF */}
            <img
              src={successGif}
              alt="Success Tick"
              style={{
                width: "100px",
                height: "100px",
                margin: "20px auto",
                display: "block",
              }}
            />

            {/* Success Message */}
            <h5 style={{ 
              margin: "15px 0", 
              color: "#28a745",
              fontFamily: "Arial, sans-serif",
            }}>
              Profile Created Successfully!
            </h5>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileCreation;
