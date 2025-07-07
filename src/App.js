import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login";

import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import VerifyOTP from "./components/auth/VerifyOTP";
import NewPassword from "./components/auth/NewPassword";
import Dashboard from "./components/layout/Dashboard";
import UserHome from "./components/user/Userhome";
import UserLogin from "./components/user/UserLogin";
import UserRegister from "./components/user/UserRegister";
import Home from "./components/maincontent/Home";
import JobsPage from "./components/maincontent/JobsPage";
import SettingsPage from "./components/maincontent/SettingsPage";
import CandidatesPage from "./components/maincontent/CandidatesPage";
import ProfileCreation from "./components/ProfileCreation";
import SuccessModal from "./components/SuccessModal";
import PostJob from "./components/PostJob";
import EditProfile from "./components/EditProfile";
import FPassword from "./components/user/ForgotPassword";
import VOTP from "./components/user/VerifyOTP";
import NPassword from "./components/user/NewPassword";
import JobPage from "./components/user/JobPage";
import JobDetails from "./components/user/JobDetails";
import ApplyForm from "./components/user/ApplyForm";
import UserProfile from "./components/user/UserProfile";
import SuccessPopup from "./components/Modal";
import TemplateList from './components/templates/TemplateList';
import SendEmail from './components/templates/SendEmail';
import SelectionProcessPage from "./components/maincontent/SelectionProcessPage";
import CandidateDetailsPage from "./components/CandidateDetailsPage";
import AboutUs from "./components/user/AboutUs";
function App() {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<UserHome/>} />
        <Route path="/modal" element={<SuccessPopup/>} />
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/userregister" element={<UserRegister />} />
        <Route path="/userprofile" element={<UserProfile/>}/>
        <Route path="/aboutus" element={<AboutUs/>} />
        <Route path="/userforgotpassword" element={<FPassword />} />
        <Route path="/userverifyotp" element={<VOTP/>} />
        <Route path="/usernewpassword" element={<NPassword/>} />
        <Route path="/jobpage" element={<JobPage/>} />
        <Route path="/job/:id" element={<JobDetails/>} />
        <Route path="/applyform/:id" element={<ApplyForm/>} />
<Route path="/profilesetup/success" element={<SuccessModal/>} />

        {/* Recruiter Routes */}
        <Route path="/recruiter" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/otpverification" element={<VerifyOTP />} />
        <Route path="/newpassword" element={<NewPassword />} />
        <Route path="/recruiter/dashboard" element={<Dashboard/>}>
        <Route path="home" element={<Home/>}/>
        <Route path="candidates-page" element={<CandidatesPage/>}/>
        <Route path="jobs-page" element={<JobsPage/>}/>
        <Route path="settings-page" element={<SettingsPage/>}/>
        <Route path="profilecreation" element={<ProfileCreation/>}/>
        <Route path="postjob" element={<PostJob/>}/>
        <Route path="edit-profile" element={<EditProfile />} />
        <Route path='templates' element={<TemplateList />} />
        <Route path="selection/:jobId" element={<SelectionProcessPage />} />
        <Route path="candidate/:candidateId" element={<CandidateDetailsPage />} />
        <Route path='send-email' element={<SendEmail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
