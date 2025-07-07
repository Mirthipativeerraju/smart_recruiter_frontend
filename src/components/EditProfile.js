import React, { useState, useEffect } from "react";
import { MdAddCircleOutline, MdClose } from "react-icons/md";
import Select from "react-select"; // Import react-select
import { allCountries } from "country-region-data"; // Use country-region-data for the same data
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import successGif from "./Animation - 1741411058723.gif"; // Ensure this path is correct

function EditProfile() {
  const navigate = useNavigate();

  // Form state
  const [profileData, setProfileData] = useState({
    name: "",
    phone_no: "",
    website: "",
  });
  const [selectedImage, setSelectedImage] = useState(null); // New logo file
  const [logoPreview, setLogoPreview] = useState(null); // URL or path for logo preview
  const [departments, setDepartments] = useState([]);
  const [departmentText, setDepartmentText] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [locations, setLocations] = useState([]);
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

  // Validation regex
  const urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/i;
  const facebookRegex = /^(https?:\/\/)?(www\.)?(facebook|fb)\.com\/.+$/i;
  const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/.+$/i;
  const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/i;
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i;
  const phoneRegex = /^\d{10}$/;

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.userId) {
        setError("Please log in to edit your profile.");
        navigate("/recruiter");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/profiles/by-org/${user.userId}`);
        const profile = response.data.data;

        setProfileData({
          name: profile.name || "",
          phone_no: profile.phone_no || "",
          website: profile.website || "",
        });
        setDepartments(profile.departments || []);
        setLocations(profile.locations || []);
        setSocialDetails({
          facebook_url: profile.facebook_url || "",
          insta_url: profile.insta_url || "",
          linkedin_url: profile.linkedin_url || "",
          yt_url: profile.yt_url || "",
        });
        // Set the logo preview from the backend
        if (profile.logo) {
          setLogoPreview(`http://localhost:5000/${profile.logo}`); // Adjust URL based on your server setup
        }
      } catch (error) {
        setError("Error fetching profile data");
        console.error("Fetch error:", error);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Update logo preview when a new image is selected
  useEffect(() => {
    if (selectedImage) {
      const objectUrl = URL.createObjectURL(selectedImage);
      setLogoPreview(objectUrl);
      // Cleanup the object URL when the component unmounts or a new image is selected
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedImage]);

  // Validation functions
  const validateForm = () => {
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
    if (departments.length === 0) {
      setError("At least one department is required");
      return false;
    }
    if (locations.length === 0) {
      setError("At least one location is required");
      return false;
    }
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
    return true;
  };

  // Handlers
  const handleAddDepartment = (e) => {
    e.preventDefault();
    if (departmentText.trim()) {
      setDepartments([...departments, departmentText]);
      setDepartmentText("");
    }
  };

  const handleRemoveDepartment = (index) => {
    setDepartments(departments.filter((_, i) => i !== index));
  };

  const handleAddLocation = (e) => {
    e.preventDefault();
    if (address.trim() && city.trim() && country.trim() && region.trim()) {
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

  const handleRemoveLocation = (index) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.userId) {
      setError("Please log in to edit your profile.");
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
      const response = await axios.put(`http://localhost:5000/api/profiles/update/${user.userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Profile updated successfully!");
      setShowSuccessModal(true);
    } catch (error) {
      setError(error.response?.data?.message || "Error updating profile");
      console.error("Submission error:", error);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/recruiter/dashboard/home");
  };

  // Define country and region options for react-select using country-region-data
  const countryOptions = allCountries.map((country) => ({
    value: country[0], // country[0] is the country name
    label: country[0],
  }));

  const regionOptions = country
    ? allCountries
        .find((c) => c[0] === country)?.[2] // country[2] is the regions array
        ?.map((region) => ({
          value: region[0], // region[0] is the region name
          label: region[0],
        })) || []
    : [];

  // Custom styles to match form-control and fix region width
  const selectStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "0.25rem",
      border: "1px solid #ced4da",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#ced4da",
      },
      minHeight: "calc(1.5em + 0.75rem + 2px)", // Match input height
    }),
    container: (provided) => ({
      ...provided,
      width: "100%", // Ensure full width within flex container
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999, // Ensure dropdown menu is on top
    }),
  };

  return (
    <div className="bg-background w-full min-vh-100">
      <h2 className="heading2 text-center pt-10 mt-5">Edit Profile</h2>
      <div className="container my-4 mt-5">
        <div className="card mx-auto shadow p-3 p-md-4" style={{ maxWidth: "800px" }}>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && !showSuccessModal && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            {/* Organization Section */}
            <h5 className="fw-bold mb-3">Organization Details</h5>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Organization Name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
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
                  onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Logo</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                />
                {logoPreview && (
                  <div className="mt-2">
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain" }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Office Details Section */}
            <h5 className="fw-bold mt-4 mb-3">Office Details</h5>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold">Departments *</label>
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
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold">Office Location *</label>
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
                    <Select
                      styles={selectStyles} // Apply custom styles
                      options={countryOptions}
                      value={countryOptions.find((option) => option.value === country) || null}
                      onChange={(selectedOption) => setCountry(selectedOption ? selectedOption.value : "")}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Region *</label>
                    <div className="d-flex gap-2">
                      <Select
                        styles={selectStyles} // Apply custom styles
                        options={regionOptions}
                        value={regionOptions.find((option) => option.value === region) || null}
                        onChange={(selectedOption) => setRegion(selectedOption ? selectedOption.value : "")}
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

            {/* Social Links Section */}
            <h5 className="fw-bold mt-4 mb-3">Social Links</h5>
            <div className="row g-3">
              <div className="col-12 col-md-6 d-flex align-items-center gap-2">
                <FaFacebookF className="fs-5 text-info" />
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://facebook.com/..."
                  value={socialDetails.facebook_url}
                  onChange={(e) =>
                    setSocialDetails({ ...socialDetails, facebook_url: e.target.value })
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
                    setSocialDetails({ ...socialDetails, linkedin_url: e.target.value })
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
                    setSocialDetails({ ...socialDetails, insta_url: e.target.value })
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
                    setSocialDetails({ ...socialDetails, yt_url: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary px-5">
                SAVE CHANGES
              </button>
            </div>
          </form>
        </div>
      </div>

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
            <h5
              style={{
                margin: "15px 0",
                color: "#28a745",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Profile Updated Successfully!
            </h5>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProfile;