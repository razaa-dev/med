import  { useState } from "react";
import { DOCTORSIDEBARMENU, NAMES, TOPBARMENU, APIURLS } from "../../../../components/Constants";
import SideBarMenu from "../../../../components/SideBarMenu";
import UseSideBarMenu from "@hooks/UseSideBarMenu";
import TopBar from "../../../../components/TopBar";
import UseTopMenu from "@hooks/useTopMenu";
import countriesData from '../../../../components/country.json'; 
import Swal from "sweetalert2";
import axios from "axios";
const OnBoarding = () => {
  const userImage = NAMES.userImage;
  const siteTitle = NAMES.SITE_TITLE;
  const APIDoctorOnboarding = APIURLS.APIDoctorOnboarding;
  const { isSidebarOpen, toggleSidebar } = UseSideBarMenu();
  const { profileDropdownOpen, toggleTopbar } = UseTopMenu();
const [currentIndex, setCurrentIndex] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    dob: "",
    gender: "",
    pref_language: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    license_type: "",
    license_no: "",
    issuing_authority: "",
    expiry_date: "",
    accreditations: "",
    services: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  


  const handleNext = () => {
    if (currentIndex < 15) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'No token found',
        text: 'Please log in.',
      });
      return;
    }
   
    for (let field in formData) {
      if ( !formData[field]) {
        Swal.fire({
          icon: 'warning',
          title: 'Missing Fields',
          text: `Please fill in the ${field} field.`,
        });
        return;
      }
    }

    try {
      const response = await axios.put(
        APIDoctorOnboarding,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setErrorMessage('');
      Swal.fire({
        icon: 'success',
        title: 'Profile updated successfully!',
        text: response.data.message || 'Your profile has been updated.',});

        
      console.log(response.data);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Failed to update profile',
        text: 'Please try again.',
      });
    }
  };
  

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBarMenu
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        menuItems={DOCTORSIDEBARMENU}
      />

      {/* Main Content */}
      <div
        className={`flex-1 ml-${isSidebarOpen ? "64" : "0 sm:ml-20"} transition-all duration-300`}
      >
        {/* Topbar */}
        <TopBar
          siteTitle={siteTitle}
          userImage={userImage}
          toggleSidebar={toggleSidebar}
          NAMES={NAMES}
          TOPBARMENU={TOPBARMENU}
          profileDropdownOpen={profileDropdownOpen}
          toggleTopbar={toggleTopbar}
          placeholder="Search for Patients, Invoices, and appointments etc."
        />

        {/* Form Content */}
        <main className="p-6 bg-gray-100 flex-grow">
          <div className="text-center">
            <h4 className="text-2xl md:text-3xl font-[400] font-playwrite-gb-s">
              Help <span className="text-secondary text-xl md:text-3xl font-bold">{siteTitle}</span> know you more!
            </h4>

            <form
              onSubmit={handleSubmit} encType="multipart/form-data"
              className="mt-12 bg-white shadow-md rounded-md w-12/12 md:w-9/12 mx-auto p-8"
            >
                  {errorMessage && <div className="text-red-500 text-center whitespace-nowrap overflow-hidden overflow-ellipsis">{errorMessage}</div>}
              {/* Form Fields */}
            
{currentIndex === 1 && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
                      disabled={currentIndex === 0}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-primary text-white py-2 px-4 rounded-md"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
              {currentIndex === 2 && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="female">female</option>
                    <option value="male">male</option>
                    <option value="other">other</option>
                  </select>
                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
                      disabled={currentIndex === 0}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-primary text-white py-2 px-4 rounded-md"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {currentIndex === 3 && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Preferred Language</label>
                  <select
                    name="pref_language"
                    value={formData.pref_language}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  >
                    <option value="" disabled>Select Language</option>
                    <option value="English">English</option>
                    <option value="Mandarin">Mandarin</option>
                    <option value="French">French</option>
                    <option value="Español">Español</option>
                  </select>
                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
                      disabled={currentIndex === 0}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-primary text-white py-2 px-4 rounded-md"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              
{currentIndex === 4 && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
                    disabled={currentIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-primary text-white py-2 px-4 rounded-md"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
             {currentIndex === 5 && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
                    disabled={currentIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-primary text-white py-2 px-4 rounded-md"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
             {currentIndex === 6 && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
                    disabled={currentIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-primary text-white py-2 px-4 rounded-md"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
             {currentIndex === 7 && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
                    disabled={currentIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-primary text-white py-2 px-4 rounded-md"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            
              {currentIndex === 8 && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  >
                    <option value="" disabled>Select Country</option>
                    {countriesData.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.value}
                      </option>
                    ))}
                  </select>
                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
                      disabled={currentIndex === 0}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-primary text-white py-2 px-4 rounded-md"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
 {currentIndex === 9 && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Zip Code</label>
                <input
                  type="text"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
                    disabled={currentIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-primary text-white py-2 px-4 rounded-md"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {currentIndex === 10 && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">License Type</label>
                <input
                  type="text"
                  name="license_type"
                  value={formData.license_type}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
                    disabled={currentIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-primary text-white py-2 px-4 rounded-md"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {currentIndex === 11 && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">License Number</label>
                <input
                  type="text"
                  name="license_no"
                  value={formData.license_no}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
                    disabled={currentIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-primary text-white py-2 px-4 rounded-md"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {currentIndex === 12 && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Issuing Authority</label>
                <input
                  type="text"
                  name="issuing_authority"
                  value={formData.issuing_authority}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
                    disabled={currentIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-primary text-white py-2 px-4 rounded-md"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {currentIndex === 13 && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Expiry Date</label>
                <input
                  type="date"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
                    disabled={currentIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-primary text-white py-2 px-4 rounded-md"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
              {currentIndex === 14 && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Accreditations</label>
                <input
                  type="text"
                  name="accreditations"
                  value={formData.accreditations}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
                    disabled={currentIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-primary text-white py-2 px-4 rounded-md"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
              {currentIndex === 15 && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Services</label>
                  <input
                    type="text"
                    name="services"
                    value={formData.services}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
                      disabled={currentIndex === 0}
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      className="bg-primary text-white py-2 px-4 rounded-md"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OnBoarding;
