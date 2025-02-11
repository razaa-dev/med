import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Preloader from './components/Preloader';
import {AuthRegister,AuthPatientRegister,AuthLogin,Reset,ResetCode,VerifyEmail,  ForgotPassword,Location} from './view/guest/auth';
import {Forbidden,NotFound ,InternalServer} from './view/guest/errorPage';
// Import secured pages

import{Dashboard,Doctors,DoctorsBooking,Schedules,Hospitals,Pharmacies,Laboratories,BlogDetail,Wallet,Activity,Settings,MedicalRecords,PrescriptionReports,PatientOnBoarding,Profile} from './view/loggedIn/secured/patients';

import{DoctorDashboard,DoctorCalendar,DoctorAppointments,DoctorActivities,DoctorPatients,DoctorPayment,DoctorProfile,DoctorSettings,DoctorOnBoarding} from './view/loggedIn/secured/doctor';


import{PharmaciesDashboard,PharmaciesOrder,PharmaciesProfile,PharmaciesWallet,PharmaciesActivity,PharmaciesSettings,PharmaciesOnBoarding} from './view/loggedIn/secured/institution';

import{LaboratoriesDashboard,LaboratoriesOnBoarding,LaboratoriesOrder,LaboratoriesProfile,LaboratoriesWallet,LaboratoriesActivity,LaboratoriesSettings} from './view/loggedIn/secured/institution/Laboratory';


// import for landng pages
import {Home,About,Contact,Faq,Cookies,Privacy,Terms,Testimonal,Services} from './view/guest/pages';

import { NAMES } from './components/Constants';
import useColor from './hooks/useColor';
import PropTypes from 'prop-types';
import ProtectedRoute from './components/ProtectedRoute';
import useInactivityLogout from './hooks/useInactivityLogout';

const siteTitle = NAMES.SITE_TITLE;
const pagesWithPreloader = [
  "/",
 
];
 
const usePageTitle=()=>{
  const location = useLocation();
  
  useEffect(()=>{
const path= location.pathname;
    const pageTitleMap= {
      '/auth-register':'Register',
      '/register': 'Register',
      '/auth-login' :'Login',
      '/reset'  :'Reset',
      '/reset-code':'Reset Code',
      '/verify-email':'Verify Email',
      '/forgot-password':'Forgot Password',
      '/Location':'Location',
      '/403':'403',
      '/404' :'404',
      '/500' :'500',
      '/dashboard':'Dashboard',
      '/doctor/dashboard':`Doctor's Dashboard`,
      '/doctor/calendar':`Doctor's Calendar`,
      '/doctor/appointments':`Doctor's Appointments`,
      '/doctor/activity':`Doctor's Activities`,
      '/doctor/patients':`Doctor's Patients`,
      '/doctor/payment':`Doctor's Payment`,
      '/doctor/profile':`Doctor's Profile`,
      '/doctor/settings':`Doctor's Settings`,
      '/doctor/onboarding' :`Doctor's Profile Completion`,
      '/institution/pharmacy/dashboard':' Dashboard',
      '/institution/pharmacy/order':' Order List',
      '/institution/pharmacy/profile':`pharmacy's Profile`,
      '/institution/pharmacy/wallet':`pharmacy's Wallet`,
      '/institution/pharmacy/activity':`pharmacy's Activity`,
      '/institution/pharmacy/settings':`pharmacy's Settings`,
      '/institution/pharmacy/onboarding':`pharmacy's OnBoarding`,
      '/institution/laboratory/dashboard':' Dashboard',
      'institution/laboratory/onboarding':'OnBoarding',

      'institution/laboratory/order':'Order',

      'institution/laboratory/profile':'Profile',

      'institution/laboratory/wallet':'Wallet',

      'institution/laboratory/activity':'Activity',

      'institution/laboratory/settings':'Settings',


      '/blog':'Blog',
      '/doctors':'Doctors',
      '/DoctorsBooking':"Doctor's Booking",
      '/onboarding' :`Patient's Profile Completion`,
      '/pharmacies':'Pharmacies',
      '/profile': `Patient's Profile`,
      '/laboratories':'Laboratories',
      '/institutions':'Institutions',
      '/schedules':'Schedules',
      '/wallet':'Wallet',
      '/' : 'Home',
      '/about' : 'About Us',
      '/contact':'Contact Us',
      '/faq' :'Frequently Asked Questions',
      '/cookies':'Cookies',
      '/privacy':'Privacy Policy',
      '/terms':'Terms and Conditions',
      '/activity':'Activity History',
      '/medicalrecords':'Medical Records',
      '/settings':'User Settings',
      '/testimonal':'Testimonials',
      '/services':'Services',
      '/prescriptionreports': 'Prescription Reports',
      '/userregistration': 'Complete Registration'

    };
    document.title =`${pageTitleMap[path]} | ${siteTitle}`;

   
  }, [location.pathname])
}

const InactivityProtectedRoute = ({ children }) => {
  useInactivityLogout();
  return <>{children}</>;
};

// Prop types for InactivityProtectedRoute
InactivityProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // children is required
};
function AppRouter({ toggleMode, darkMode }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(false);
   // Call the custom hook to update the page title
   usePageTitle();
  useEffect(() => {
    const path = location.pathname;
    if (pagesWithPreloader.includes(path)) {
      setShowPreloader(true);
      const timer = setTimeout(() => setLoading(false), 2000); 
      return () => clearTimeout(timer);
    } else {
      setShowPreloader(false);
      setLoading(false);
    }
  }, [location.pathname]);

  return (
    <>
      {showPreloader && loading ? (
        <Preloader />
      ) : (
        
        
        <Routes>
        <Route path="/" element={<Home toggleMode={toggleMode} darkMode={darkMode} />} />
        <Route path="/about" element={<About toggleMode={toggleMode} darkMode={darkMode} />} />
        <Route path="/contact" element={<Contact toggleMode={toggleMode} darkMode={darkMode} />} />
        <Route path="/faq" element={<Faq toggleMode={toggleMode} darkMode={darkMode} />} />
        <Route path="/cookies" element={<Cookies toggleMode={toggleMode} darkMode={darkMode} />} />
        <Route path="/terms" element={<Terms toggleMode={toggleMode} darkMode={darkMode} />} />
        <Route path="/testimonal" element={<Testimonal toggleMode={toggleMode} darkMode={darkMode} />} />
        <Route path="/privacy" element={<Privacy toggleMode={toggleMode} darkMode={darkMode} />} />
        <Route path="/services" element={<Services toggleMode={toggleMode} darkMode={darkMode} />} />

        <Route path="/auth-register" element={<AuthRegister />} />
        <Route path="/register" element={<AuthPatientRegister />} />
        <Route path="/auth-login" element={<AuthLogin />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/reset-code" element={<ResetCode />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/location" element={<Location />} />
        <Route path="/403" element={<Forbidden />} />
        <Route path="404" element={<NotFound />} />
        <Route path="500" element={<InternalServer />} />

        {/*  laboratory*/}
        <Route path="/institution/laboratory/dashboard" element={
         <InactivityProtectedRoute>
         <ProtectedRoute component={LaboratoriesDashboard} allowedRoles={[3]} toggleMode={toggleMode} darkMode={darkMode} />
       </InactivityProtectedRoute>
         } />
            <Route path="/institution/laboratory/onboarding" element={
         <InactivityProtectedRoute>
         <ProtectedRoute component={LaboratoriesOnBoarding} allowedRoles={[3]} toggleMode={toggleMode} darkMode={darkMode} />
       </InactivityProtectedRoute>
         } />
           <Route path="/institution/laboratory/order" element={
         <InactivityProtectedRoute>
         <ProtectedRoute component={LaboratoriesOrder} allowedRoles={[3]} toggleMode={toggleMode} darkMode={darkMode} />
       </InactivityProtectedRoute>
         } />
           <Route path="/institution/laboratory/settings" element={
         <InactivityProtectedRoute>
         <ProtectedRoute component={LaboratoriesSettings} allowedRoles={[3]} toggleMode={toggleMode} darkMode={darkMode} />
       </InactivityProtectedRoute>
         } />
           <Route path="/institution/laboratory/profile" element={
         <InactivityProtectedRoute>
         <ProtectedRoute component={LaboratoriesProfile} allowedRoles={[3]} toggleMode={toggleMode} darkMode={darkMode} />
       </InactivityProtectedRoute>
         } />
           <Route path="/institution/laboratory/Wallet" element={
         <InactivityProtectedRoute>
         <ProtectedRoute component={LaboratoriesWallet} allowedRoles={[3]} toggleMode={toggleMode} darkMode={darkMode} />
       </InactivityProtectedRoute>
         } />
           <Route path="/institution/laboratory/activity" element={
         <InactivityProtectedRoute>
         <ProtectedRoute component={LaboratoriesActivity} allowedRoles={[3]} toggleMode={toggleMode} darkMode={darkMode} />
       </InactivityProtectedRoute>
         } />

        
        {/* pharmacy */}
        <Route path="/institution/pharmacy/dashboard" element={
         <InactivityProtectedRoute>
         <ProtectedRoute component={PharmaciesDashboard} allowedRoles={[3]} toggleMode={toggleMode} darkMode={darkMode} />
       </InactivityProtectedRoute>
         } />
  <Route path="/institution/pharmacy/wallet" element={
     <InactivityProtectedRoute>
     <ProtectedRoute component={PharmaciesWallet} allowedRoles={[3]} toggleMode={toggleMode} darkMode={darkMode} />
   </InactivityProtectedRoute>} />

        <Route path="/institution/pharmacy/Order" element={ <InactivityProtectedRoute>
     <ProtectedRoute component={PharmaciesOrder} allowedRoles={[3]} toggleMode={toggleMode} darkMode={darkMode} />
   </InactivityProtectedRoute>
     } />
<Route path="/institution/pharmacy/wallet" element={
  <InactivityProtectedRoute>
  <ProtectedRoute component={PharmaciesWallet} allowedRoles={[3]} toggleMode={toggleMode} darkMode={darkMode} />
</InactivityProtectedRoute>} />
  <Route path="/institution/pharmacy/profile" element={
   <InactivityProtectedRoute>
   <ProtectedRoute component={PharmaciesProfile} allowedRoles={[3]} toggleMode={toggleMode} darkMode={darkMode} />
 </InactivityProtectedRoute>} />
  <Route path="/institution/pharmacy/activity" element={
    <InactivityProtectedRoute>
    <ProtectedRoute component={PharmaciesActivity} allowedRoles={[3]} toggleMode={toggleMode} darkMode={darkMode} />
  </InactivityProtectedRoute>} />
  <Route path="/institution/pharmacy/settings" element={
   <InactivityProtectedRoute>
   <ProtectedRoute component={PharmaciesSettings} allowedRoles={[3]} toggleMode={toggleMode} darkMode={darkMode} />
 </InactivityProtectedRoute>} />
 <Route path="/institution/pharmacy/onboarding" element={
 <InactivityProtectedRoute>
   <ProtectedRoute component={PharmaciesOnBoarding} allowedRoles={[3]} toggleMode={toggleMode} darkMode={darkMode} />
 </InactivityProtectedRoute>} />

 
     {/*  */}
        <Route path="/doctor/dashboard" element={
         <InactivityProtectedRoute>
         <ProtectedRoute component={DoctorDashboard} allowedRoles={[2]} toggleMode={toggleMode} darkMode={darkMode} />
       </InactivityProtectedRoute>
         
        } />
        <Route path="/doctor/calendar" element={
             <InactivityProtectedRoute>
             <ProtectedRoute component={DoctorCalendar} allowedRoles={[2]} toggleMode={toggleMode} darkMode={darkMode} />
           </InactivityProtectedRoute>
        } />
        <Route path="/doctor/appointments" element={
          <InactivityProtectedRoute>
          <ProtectedRoute component={DoctorAppointments} allowedRoles={[2]} toggleMode={toggleMode} darkMode={darkMode} />
        </InactivityProtectedRoute>
        } />
        <Route path="/doctor/activity" element={
            <InactivityProtectedRoute>
            <ProtectedRoute component={DoctorActivities} allowedRoles={[2]} toggleMode={toggleMode} darkMode={darkMode} />
          </InactivityProtectedRoute>
        } />
        <Route path="/doctor/patients" element={
         <InactivityProtectedRoute>
         <ProtectedRoute component={DoctorPatients} allowedRoles={[2]} toggleMode={toggleMode} darkMode={darkMode} />
       </InactivityProtectedRoute>
        } />
        <Route path="/doctor/payment" element={
         <InactivityProtectedRoute>
         <ProtectedRoute component={DoctorPayment} allowedRoles={[2]} toggleMode={toggleMode} darkMode={darkMode} />
       </InactivityProtectedRoute>
        } />
        <Route path="/doctor/profile" element={
          <InactivityProtectedRoute>
          <ProtectedRoute component={DoctorProfile} allowedRoles={[2]} toggleMode={toggleMode} darkMode={darkMode} />
        </InactivityProtectedRoute>
        } />
        <Route path="/doctor/settings" element={
          <InactivityProtectedRoute>
          <ProtectedRoute component={DoctorSettings} allowedRoles={[2]} toggleMode={toggleMode} darkMode={darkMode} />
        </InactivityProtectedRoute>
        } />
        <Route path ='/doctor/onboarding' element={
          <InactivityProtectedRoute>
          <ProtectedRoute component={DoctorOnBoarding} allowedRoles={[2]} toggleMode={toggleMode} darkMode={darkMode} />
        </InactivityProtectedRoute>
        } />
        


{/* <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <InactivityProtectedRoute>
              <Dashboard toggleMode={toggleMode} darkMode={darkMode} />
            </InactivityProtectedRoute>
          </ProtectedRoute>
        } /> */}
        <Route path="/dashboard" element={
         
            <InactivityProtectedRoute>
              <ProtectedRoute component={Dashboard} allowedRoles={[1]} toggleMode={toggleMode} darkMode={darkMode} />
            </InactivityProtectedRoute>
        } 
        />




         <Route path="/wallet" element={
          <InactivityProtectedRoute>
          <ProtectedRoute component={Wallet} allowedRoles={[1]} toggleMode={toggleMode} darkMode={darkMode} />
        </InactivityProtectedRoute>
     } />
        <Route path="/activity" element={
          <InactivityProtectedRoute>
          <ProtectedRoute component={Activity} allowedRoles={[1]} toggleMode={toggleMode} darkMode={darkMode} />
        </InactivityProtectedRoute>
     } />
      <Route path="/settings" element={
          <InactivityProtectedRoute>
            <ProtectedRoute component={Settings} allowedRoles={[1]} toggleMode={toggleMode} darkMode={darkMode} />
          </InactivityProtectedRoute>
      } 
      />

<Route path="/onboarding" element={
          <InactivityProtectedRoute>
            <ProtectedRoute component={PatientOnBoarding} allowedRoles={[1]} toggleMode={toggleMode} darkMode={darkMode} />
          </InactivityProtectedRoute>
      } 
      />
     
     
     <Route path="/prescriptionreports" element={
          <InactivityProtectedRoute>
            <ProtectedRoute component={PrescriptionReports} allowedRoles={[1]} toggleMode={toggleMode} darkMode={darkMode} />
          </InactivityProtectedRoute>
      } 
      />
     
      <Route path="/medicalrecords" element={
                  <InactivityProtectedRoute>
            <ProtectedRoute component={MedicalRecords} allowedRoles={[1]} toggleMode={toggleMode} darkMode={darkMode} />
          </InactivityProtectedRoute>
     } />


<Route path="/profile" element={
                  <InactivityProtectedRoute>
            <ProtectedRoute component={Profile} allowedRoles={[1]} toggleMode={toggleMode} darkMode={darkMode} />
          </InactivityProtectedRoute>
     } />
        
        <Route path="/blog" element={
                  <InactivityProtectedRoute>
            <ProtectedRoute component={BlogDetail} allowedRoles={[1]} toggleMode={toggleMode} darkMode={darkMode} />
          </InactivityProtectedRoute>
     } />        
        
        <Route path="/doctors" element={
                  <InactivityProtectedRoute>
            <ProtectedRoute component={Doctors} allowedRoles={[1]} toggleMode={toggleMode} darkMode={darkMode} />
          </InactivityProtectedRoute>
     } />
       <Route path="/DoctorsBooking" element={
                  <InactivityProtectedRoute>
            <ProtectedRoute component={DoctorsBooking} allowedRoles={[1]} toggleMode={toggleMode} darkMode={darkMode} />
          </InactivityProtectedRoute>
     } />


       <Route path="/pharmacies" element={
                  <InactivityProtectedRoute>
            <ProtectedRoute component={Pharmacies} allowedRoles={[1]} toggleMode={toggleMode} darkMode={darkMode} />
          </InactivityProtectedRoute>
     } />
      <Route path="/laboratories" element={
                  <InactivityProtectedRoute>
            <ProtectedRoute component={Laboratories} allowedRoles={[1]} toggleMode={toggleMode} darkMode={darkMode} />
          </InactivityProtectedRoute>
     } />
       <Route path="/hospitals" element={
                  <InactivityProtectedRoute>
            <ProtectedRoute component={Hospitals} allowedRoles={[1]} toggleMode={toggleMode} darkMode={darkMode} />
          </InactivityProtectedRoute>
     } />
       <Route path="/schedules" element={
                  <InactivityProtectedRoute>
            <ProtectedRoute component={Schedules} allowedRoles={[1]} toggleMode={toggleMode} darkMode={darkMode} />
          </InactivityProtectedRoute>
     } />
        
      </Routes>
      )}
    </>
  );
}

function App() {
  const [toggleMode, darkMode] = useColor();

  return (
    <Router>
<div className={darkMode ? "dark" : "light"}>
        {/* Pass down darkMode and toggleMode to AppRouter */}
        <AppRouter toggleMode={toggleMode} darkMode={darkMode} />
      </div>    </Router>
  );
}
AppRouter.propTypes={
  toggleMode:PropTypes.func.isRequired,
  darkMode:PropTypes.bool.isRequired
}

export default App;
