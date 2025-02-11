import AuthHeader from '../../partials/AuthHeader';
// import { IMAGE, NAMES } from '../../../components/constants';





import styles from '../../../components/styles';
import {  useState } from 'react';


import { APIURLS } from '../../../components/Constants';
import Swal from 'sweetalert2';
import { IoArrowBackCircle } from 'react-icons/io5';
// import AuthChat from '../../../components/AuthChat';




const ForgotPassword = () => {

    const APIURLPATIENTSFORGOTPASSWORD= APIURLS.APIURLPATIENTSFORGOTPASSWORD;
    const APIURLDOCTORFORGOTPASSWORD= APIURLS.APIURLDOCTORFORGOTPASSWORD;
    const APIURLINSTITUTIONFORGOTPASSWORD= APIURLS.APIURLINSTITUTIONFORGOTPASSWORD;
    const [userType, setUserType] = useState("");
    const [institutionType, setInstitutionType] = useState("");
    const [formData, setFormData]=useState({email:""});
 
  const handleGoBack = () => {
    if (institutionType) {
      setInstitutionType("");
      setFormData({});
    } else {
      setUserType("");
      setFormData({});
    }
  }
  const handleUserTypeChange = (value) => {
    setUserType(value);
  };


  const handleInstitutionChange = (value) => {
    setInstitutionType(value);
    setFormData((prev) => ({ ...prev, institutionType: value }));
  };

const log=(e)=>{
    return console.log(e);
}

const getOTPCode = async (e) => {
    e.preventDefault(); 
   
  

    if (!formData.email ) {
        Swal.fire("Error", "Please provide an email");
        return;
      }
      const institutionTypeValue = userType === "institution" ? institutionType : null;
      if (userType === "institution" && !institutionTypeValue) {
        Swal.fire("Error", "Please select an institution type", "error");
        return;
      }
      let apiUrl;
      let role_id = 0;
      if (userType === "patient") role_id = 1;
      else if (userType === "doctor") role_id = 2;
      else if (userType === "institution") role_id = 3;
    
    switch (role_id) {
      case 1:
        apiUrl = `${APIURLPATIENTSFORGOTPASSWORD}/${encodeURIComponent(formData.email)}`;
        break;
      case 2:
        apiUrl = `${APIURLDOCTORFORGOTPASSWORD}/${encodeURIComponent(formData.email)}`;
        break;
      case 3:
        apiUrl = `${APIURLINSTITUTIONFORGOTPASSWORD}/${encodeURIComponent(formData.email)}`;
        break;
      default:
       console.log( "The User doesn't have a valid role", 'error');
        return;
    }
    console.log('Role ID:', role_id);
    localStorage.setItem('role_id', role_id);
    console.log('API URL:', apiUrl);
   
    try {
        const requestBody = {
            // formData.email,
           
            ...(userType === "institution" && { institution_type: institutionTypeValue }),
          };  
          if (role_id === 3) {
            if (!institutionType) {
              Swal.fire( "Please select an institution type", "error");
              return;
            }
            requestBody.institution_type = institutionType;
          }
      const response = await fetch(apiUrl, {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json(); 

      if (!response.ok) {
        const errorData = await response.json();
        Swal.fire( errorData.message || "Failed to process your request");
        return;
      }

      log("API Response:", data);

      if (data.otp) {
        Swal.fire("Error",  "Unable to send OTP. Please try again.");

      }
       else {

        Swal.fire("Success", data.message || `OTP sent to your email: ${formData.email}`);
        window.location.href = `/reset-code?email=${encodeURIComponent(formData.email)}`; 
      }
      
    } catch (error) {
      console.error("Error:", error);
      Swal.fire( "Network error or server unavailable");
    } 
  };
  


const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
   <div>
{/* header */}
<AuthHeader/>
{/* end header */}
      <main className={styles.mainContainer}>
      <section className={`${styles.mainImage} flex flex-col items-center justify-center h-screen`}>   
         <div className="flex-grow">
         <img src='https://images.pexels.com/photos/5214996/pexels-photo-5214996.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' alt=""className=' inset-0 w-full max-h-full object-cover -mt-[170px]' />
        </div>
        </section>
        <section className={styles.mainRegister}>
          <div className="flex justify-between border-b border-gray-200 sm:max-w-[30rem] mr-7 mb-4 text-primary">
            {!userType && !institutionType ? (
              <h1 className={`text-primary dark:text-secondary font-extrabold ${styles.subHeading}`}>
                Select User Type
              </h1>
            ) : (
            <div className="flex space-x-3"> <button onClick={handleGoBack} className="textprimary hover:text-blue-700">
            <IoArrowBackCircle size={24} className="text-secondary dark:text-secondary mt-5 sm:mt-4" />
          </button>
             <h1
             className={` text-primary dark:text-secondary font-bold ${styles.subHeading} -ml-4`}
           >Forgot Password </h1></div>
            )}
                     
  
          </div>

          <div className="mb-4">
          <label className="block text-center mt-8 font-bold text-primary dark:text-secondary uppercase text-sm md:text-md lg:text-lg">
          Let&apos;s get you back into your Account

</label>

            <select
              value={userType}
              onChange={(e) => handleUserTypeChange(e.target.value)}
              className="block w-full border border-primary dark:border-secondary rounded-lg p-4 text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
            >
              <option value="" disabled>Select account type</option>
              <option value="doctor">Doctor</option>
              <option value="institution">Institution</option>
              <option value="patient">Patient</option>
            </select>
          </div>

          {userType === "institution" &&  (
            <div className="mb-4">
              <label className="block text-center mt-8 font-bold text-primary dark:text-secondary uppercase text-sm md:text-md lg:text-lg">
                Select Institution Type
              </label>
              <select
                value={institutionType}
                onChange={(e) => handleInstitutionChange(e.target.value)}
                className="block w-full border border-primary dark:border-secondary rounded-lg p-4 text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
              >
                <option value="" disabled>Select institution type</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="hospital">Hospital</option>
                <option value="laboratory">Laboratory</option>
              </select>
            </div>
          )}

          {(userType && userType !== "institution") || institutionType ? (
            <form className="space-y-6 sm:max-w-[30rem] mx-auto" autoComplete="off" onSubmit={getOTPCode}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
    type="email"
    id="email"
    name="email"
    required
    value={formData.email}
    onChange={handleChange}
    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"    placeholder="Enter your registered email"
/>

              </div>

           

              <div className="flex justify-center">
                <button
                  type="submit"
                  className={`w-full p-3 text-primary rounded-[20px] bg-secondary border-2 border-primary border-b-[9px]  mt-9  ${styles.buttonClass} hover:text-white hover:bg-primary hover:border-secondary`} 
                >
                  Next
                </button>
               
              </div>
             
            </form>
          ) : null}
          
        </section>
 

    


      </main>
      <div className="relative">
      
      {/* <AuthChat/> */}

    </div>
      </div>
  );
};

export default ForgotPassword;
