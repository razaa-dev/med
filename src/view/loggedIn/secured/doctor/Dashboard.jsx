import  { useState } from 'react';
import {FaCalendarAlt,FaUsers,FaArrowUp,FaArrowDown,FaVideo, FaArrowRight, FaClock, FaChevronRight,
  
} from 'react-icons/fa';
import { HiDotsHorizontal } from "react-icons/hi";
import { SiTicktick } from "react-icons/si";

import { defaultUrl, DOCTORSIDEBARMENU, NAMES,IMAGE } from '../../../../components/Constants';
import Greet from '../../../../components/Greet';
// import { LuArrowUpRightFromCircle } from "react-icons/lu";
import UseSideBarMenu from '../../../../hooks/UseSideBarMenu';
import SideBarMenu from '../../../../components/SideBarMenu';
import {  currentDate, currentTime,  formatDateWithOrdinalSuffix, getUserData,formatTime, statusMap } from '../../../../components/Helper';
import DoctorsHeader from '../../../partials/DoctorsHeader';
import { useAppointments } from './DoctorApiForm';
import { MdAccountBalanceWallet,MdCancel } from 'react-icons/md';
import { HiBanknotes } from 'react-icons/hi2';
import { useNavigate,Link } from 'react-router-dom';
import { format } from 'date-fns';

const Dashboard = () => {
  const siteName= NAMES.SITE_TITLE;
  const currencySymbol =NAMES.NairaSymbol
  const navigate=useNavigate();
  const userData=getUserData();
  const userProfile= userData?.data
  const availableBalance =userProfile?.acctbal || 0;
const withdrawnAmount =userProfile?.spent || 0;
const totalIncome = parseFloat(availableBalance) + parseFloat(withdrawnAmount);
const { enrichedAppointmentData,loading,completedAppointmentsCount,upcomingAppointents,pendingAppointments,    mostRecentUpcomingAppointment,upcomingAppointmentssIn24Hrs,completedAppointmentssIn24Hrs,
  cancelledAppointmentssIn24Hrs,
}= useAppointments();

const upcomingAppointentsCount= upcomingAppointents.length

const recentAppointmentDate = mostRecentUpcomingAppointment ? mostRecentUpcomingAppointment.date: format(new Date(), 'eee, d MMM');
const formattedDate = `${new Date(recentAppointmentDate).getFullYear()}-${(new Date(recentAppointmentDate).getMonth() + 1).toString().padStart(2, '0')}-${new Date(recentAppointmentDate).getDate().toString().padStart(2, '0')}`;



const todayAppointment = [
  ...upcomingAppointmentssIn24Hrs,
  ...completedAppointmentssIn24Hrs,
  ...cancelledAppointmentssIn24Hrs
];

console.log("Today's Appointments:", todayAppointment);

  const { isSidebarOpen, toggleSidebar } = UseSideBarMenu();
  
  const [toggle, setToggle] = useState(false);


  const PatientWaitingCount = upcomingAppointentsCount;

  const getPatientWaitingCount=(patient)=>{
    if(patient < 2){
      return `patient`
    }else{
      return`patients`
    }
  }
  // 

 



 const cardTopData = [

 
  {
    title: "Total Available Balance",
    count: `${NAMES.NairaSymbol} ${(Number(availableBalance) || 0).toLocaleString()}`,
    description: "Your sum Total Balance",
    icon: <MdAccountBalanceWallet size={24} />,
    iconData: <HiDotsHorizontal  />,
    iconArrowUp: <FaArrowUp />,
    textCount: 'Sum total Balance made',
    color: 'primary'

  }, 
 
  {
    title: "Total Amount withdrawn",
    count: `${NAMES.NairaSymbol} ${(Number(withdrawnAmount) || 0).toLocaleString()}`, 
    description: "Money withdrawn from wallet ",
    icon: <HiBanknotes size={24} />,
    iconData: <HiDotsHorizontal  />,
    iconArrowUp: <FaArrowDown />,
    textCount: 'Sum total Withdrawn',
    color: 'secondary'

  },
  {
    title: "Total Patients Count",
    count: completedAppointmentsCount, 
    description: "Total of patients attended to",
    icon: <FaUsers size={24} />,
    iconData: <HiDotsHorizontal  />,
    iconArrowUp: <FaArrowUp />,
    textCount: 'List of patients count',
    color: 'primary'

  },
 
];



  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBarMenu isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}   menuItems={DOCTORSIDEBARMENU}/>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-0 sm:ml-20'}  transition-all duration-300`}>

        {/* Topbar */}
        <DoctorsHeader/>

        {/* Dashboard Content */}
        <main className="p-2 sm:p-6 bg-gray-100 flex-grow">
          <div className='  sm:flex justify-between mb-0'>
            <div className=' mb-4'>
              <div className='font-bold text-[24px] italic capitalize flex ml-2'><Greet className="hidden sm:block" /><span className='hidden sm:block'>,</span> 
                <p className='ml-2 hidden sm:block'>  <span>Dr.</span> {userData?.data?.fullname 
    ? userData?.data?.fullname.split(' ').length > 1 
      ?userData?.data?.fullname.split(' ')[0].trim() + "!" 
      :userData?.data?.fullname 
    : ""} </p>             
              </div>
              <p className='ml-2 mt-[70px]  md:mt-4 text-gray-600 block sm:flex text-center sm:ml-2'>
  How are you doing today? <p><span className='hidden sm:inline'>You have </span> 
  <span className='font-bold primary-color  '>
    {PatientWaitingCount}  {getPatientWaitingCount(PatientWaitingCount)} 
  </span> 
   <span> waiting for you.</span></p>
</p>


            </div>
             
          </div>
          <div className="grid grid-cols-1 gap-4">
            {/* Statistics */}
            <div className="grid grid-cols-1  lg:grid-cols-3 gap-4 p-4 sm:p-0 ">
 {
  cardTopData.map((data,index)=>(
     <div key={index} className={` lg:w-full bg-white p-6 rounded-lg shadow-md border-l-4 border-${data.color}`}>
    <div className='flex justify-between items-start'>
      {/* Left Section */}
      <div className='flex items-center'>
        <div className={`bg-${data.color} p-2 rounded-full text-center text-white`}>
         {data.icon}
        </div>
        <div className='ml-3'>
          <p className='capitalize mt-1 font-bold text-md'>{data.title}</p>
          <p className='text-gray-500 text-ellipsis whitespace-nowrap overflow-hidden'>{data.description}</p>
        </div>
      </div>

      {/* Dot Icon Section */}
    <div className={`shadow-md px-2 -py-1 border-${data.color} rounded-md flex justify-center items-center`}>
      <p className={`text-${data.color}`}>{data.iconData }     
      </p>
 </div>
    </div>

    {/* Patient Count */}
    <h3 className="text-2xl font-bold mt-4">{data.count.toLocaleString()}</h3>

    {/* Growth Indicator */}
    <div className='flex items-center mt-2'>
      <div className={`bg-${data.color} text-white px-2 rounded-md flex items-center`}>
        {data.iconArrowUp}
        {/* <p className='ml-1'>{data.growth}</p> */}
      </div>
      <p className='ml-3 text-gray-500'>{data.textCount}</p>
    </div>
  </div>
  ))
 }
  
{/* dhgdhjdsjfj */}
</div>


            {/* Patient Status Chart and Best Doctor Profile */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* appointment request */}
              <div className="p-3 rounded-lg shadow-md bg-white">
      {/* Header */}
      <div className="border-b border-gray-400 flex justify-between mb-4">
        <h3 className="font-bold uppercase">Appointment Requests</h3>
        <p className="text-primary cursor-pointer"onClick={()=>navigate('/doctor/appointments')}>See All</p>
      </div>

      {/* Appointment List */}
      <div className="flex flex-col">
      <ul className="space-y-4">
  {pendingAppointments.slice(0, 6).map((appointment) => (
    <li
      key={appointment.id}
      className="space-x-4 md:spacee.x-1 flex items-center border-b border-gray-200 pb-4 w-full flex-wrap md:flex-nowrap"
    >
      {/* Profile Picture and Name */}
      <div className="flex items-center space-x-4 w-2/4">
        <img
          src={appointment ? `${defaultUrl}${appointment.prof_pics}` : null}
          alt={appointment ? appointment.fullname : null}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold capitalize">
            {appointment?.fullname
              ? appointment.fullname.split(' ').length > 1
                ? appointment.fullname.split(' ')[0].trim()
                : appointment.fullname
              : userData?.data?.fullname}
          </p>
        </div>
      </div>

      {/* Purpose */}
      <p className="text-sm text-gray-500 capitalize w-1/4 md:w-1/4 text-center md:text-left md:mt-0">
        {appointment ? appointment.purpose : null}
      </p>

      {/* Appointment Date */}
      <div className="text-sm text-gray-500 w-1/4 md:w-1/4 text-center capitalize mt-2 md:mt-0">
        {formatDateWithOrdinalSuffix(appointment.date)}
      </div>

      {/* Status / View User Button */}
      <div className="w-full md:w-1/4 flex justify-between md:justify-end items-center text-center mt-1 md:mt-0">
        {appointment.status === '1' ? (
          <span className="text-green-600 font-bold">Accepted</span>
        ) : appointment.status === '0' ? (
          <span className="text-red-600 font-bold">Declined</span>
        ) : (
          <button
            className="hidden md:block bg-secondary px-2 py-1 rounded-xl text-white"
            onClick={() => navigate('/doctor/appointments')}
          >
            View User
          </button>
        )}
      </div>
    </li>
  ))}
</ul>

      </div>
    </div>
              {/*today's Appointment  */}
              <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="border-b border-gray-200 flex justify-between">
        <h3 className="font-bold uppercase mb-2">today&apos;s appointment</h3>
        <p className="primary-color cursor-pointer">see all</p>
      </div>

      <div className="mt-3">
        {loading ? (
          // Loading Skeleton
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center animate-pulse space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : todayAppointment.length === 0 ? (
          // No Appointments
          <p className="text-center text-gray-500 font-semibold">No appointments today.</p>
        ) : (
          // Display Appointments
          todayAppointment.map((data, index) => (
            <div key={index} className="w-full rounded-lg flex items-center justify-between p-4 hover:bg-gray-50 transition">
              <div className="flex-shrink-0">
                <img
                  src={data.prof_pics || 'https://via.placeholder.com/48'}
                  alt="Patient"
                  className="w-12 h-12 rounded-full"
                />
              </div>
              <div className="flex-grow ml-4">
                <p className="font-semibold capitalize">{data.fullname}</p>
                <p className="text-gray-600">{data.healthConditionTitle || 'General Checkup'}</p>
              </div>
              <div className="flex-shrink-0">
                <p className={`p-2 rounded-xl bg-${data.statusColor || 'gray-200'} text-sm font-medium`}>
                  {data.status === 1 ? 'Confirmed' : data.status === 3 ? 'Pending' : 'Unknown'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
              
              {/* Doctor Info */}
                <div className="bg-white p-6 rounded-lg shadow-md">
               {/* Header */}
               <div className="border-b border-gray-300 mb-4 flex justify-between">
                 <h3 className="font-bold uppercase mb-2 text-primary dark:text-secondary">
                   {loading ? (
                     <div className="text-center flex justify-center items-center">
                       <div className="space-y-4 w-full">
                         {Array.from({ length: 1 }).map((_, index) => (  
                           <div key={index} className="skeleton h-6 w-2/3 mx-auto animate-pulse"></div>  
                         ))}
                       </div>
                     </div>
                   ) : mostRecentUpcomingAppointment ? "Upcoming Appointment" : "No Upcoming Appointment"}
                 </h3>
                 <Link to="/doctors" className="flex text-primary dark:text-secondary">
                   <span className="mr-2 cursor-pointer">
                   </span>
                 </Link>
               </div>
             
               {/* Content Section */}
               {loading ? (
                 <div className="space-y-4">
                   {Array.from({ length: 20 }).map((_, index) => (  
                     <div key={index} className="skeleton h-4 w-full mx-auto animate-pulse"></div>  
                   ))}
                 </div>
               ) : (
                 <>
                   <div className="flex justify-between items-center mb-4">
                     <h4 className="font-semibold uppercase">
                     {`You have ${upcomingAppointentsCount === 1 ? '1 Appointment' : upcomingAppointentsCount > 1 ? `${upcomingAppointentsCount} Appointments` : 'No Appointment'}`}
                     </h4>
             
                   {mostRecentUpcomingAppointment?  <div className="flex items-center text-secondary">
                       <span className="  rounded-full p-2 font-bold cursor-pointer"onClick={()=>navigate('/doctor/appointments')}> See More</span>

                         <FaArrowRight />
                       
                     </div>:""}
                   </div>
             
                   {/* Patient Image */}
                   <div className="flex justify-center mb-4 h-72">
                   <img
               src={mostRecentUpcomingAppointment 
                 ? `${defaultUrl}${mostRecentUpcomingAppointment.prof_pics}` 
                 : IMAGE.DefaultImageBanner
               }
               alt={mostRecentUpcomingAppointment ? mostRecentUpcomingAppointment.fullname : "No Image"}
               className="w-full h-full object-cover rounded-xl"
               style={{
                 objectPosition: 'top' 
               }}
             />
             
                   </div>
                   <h4 className="font-bold">
               {mostRecentUpcomingAppointment ? (
                 <div className="flex justify-between">
                   <p>{mostRecentUpcomingAppointment.fullname}</p> 
                   <p>
               {mostRecentUpcomingAppointment?.specialization
                 ? mostRecentUpcomingAppointment.specialization.endsWith("s")
                   ? mostRecentUpcomingAppointment.specialization.slice(0, -1)
                   : mostRecentUpcomingAppointment.specialization
                 : "No Specialization"}
             </p>
                 </div>
                 
               ) : (
                 ''
               )}
             </h4>
             
                   <p className="text-gray-600 mb-4">
                     {mostRecentUpcomingAppointment ?`Medical Attention: ${mostRecentUpcomingAppointment.purpose}`
             : " Status: No Upcoming Appointment Today"}
                   </p>
             
                   <div className="flex items-center justify-between mb-4">
                     <div className="flex">
                       
                       <FaCalendarAlt size={24} className="mr-2 text-primary dark:text-secondary" />
                       <span>{mostRecentUpcomingAppointment
                   ? `Session Date: ${formatDateWithOrdinalSuffix(mostRecentUpcomingAppointment.date)}`
                   : `Today's Date: ${format(new Date(), 'eee, d MMM')}`}
               </span>
                     </div>
                     <div className="flex space-x-1">
                       <FaClock size={20} className="text-primary dark:text-secondary mt-1 rotate" />
                       <p>{mostRecentUpcomingAppointment ?`Time:${formatTime ( mostRecentUpcomingAppointment.start_time)}` :` Time: ${ format(new Date(), 'hh:mm a')}`}</p>
                     </div>
                   </div>
             
                   <div className="mt-[50px]">
                       <button className={`w-full flex text-center text-white rounded-md px-4 py-2 ${
  mostRecentUpcomingAppointment
    ? currentDate === formattedDate
      ? currentTime > mostRecentUpcomingAppointment.end_time
        ? "bg-gray-500 cursor-not-allowed"
        : currentTime < mostRecentUpcomingAppointment.start_time
        ? "bg-secondary hover:bg-primary cursor-pointer"
        : "bg-primary hover:bg-secondary cursor-pointer animate-wiggle"
      : "bg-gray-500 cursor-not-allowed"
    : "-mt-4"
}`}>
                        {currentDate === formattedDate
                          ? currentTime > mostRecentUpcomingAppointment.end_time 
                            ? <p className="flex items-center justify-center  space-x-2 mx-auto" ><SiTicktick size={20} className="mr-2 text-white" /> Finished Video Call with {mostRecentUpcomingAppointment ? mostRecentUpcomingAppointment.fullname : null}</p>
                            : currentTime < mostRecentUpcomingAppointment.start_time 
                              ?   <a  href="/doctor/appointments"  className="flex items-center justify-center  space-x-2 mx-auto"><MdCancel size={20} className="mr-2 text-white" /> Cancel appointment with {mostRecentUpcomingAppointment ? mostRecentUpcomingAppointment.fullname : null} </a>
                              : (
                               <a  href="/doctor/appointments"  className="flex items-center justify-center animate-bounce space-x-2 mx-auto">
                               <FaVideo size={20} className="text-white" />
                               <span className="text-white">
                                 Join Video Call with {mostRecentUpcomingAppointment ? mostRecentUpcomingAppointment.fullname : null}
                               </span>
                             </a>
                             
                                  
                              )
                          : null}
                        
                      
                       </button>
                   </div>
                 </>
               )}
             </div>

            </div>
            
          </div>

          {/* payment history and recent patients */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
 {/* Recent Patients */}
 <div className="bg-white p-6 rounded-lg shadow-md">
  {/* Header */}
  {loading ? (
    <div className="text-center flex justify-center items-center">
      <div className="space-y-4 w-full">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="skeleton h-4 w-full mx-auto"></div>
        ))}
      </div>
    </div>
  ) : enrichedAppointmentData.length > 0 ? (
    <div>
      {/* Header for Appointments */}
      <div className="border-b border-gray-200 flex justify-between items-center pb-4">
        <h3 className="font-bold uppercase text-primary dark:text-secondary">Appointments</h3>
        <Link to={`/doctor/appointments`} className="flex items-center text-primary dark:text-secondary">
          <p>See all</p>
          <FaChevronRight className="ml-1" size={12} />
        </Link>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-5 font-semibold text-gray-600 border-b pb-2 mt-4 text-left">
        <span className="border-r border-gray-200 px-2">Patients</span>
        <span className="border-r border-gray-200 px-2">EHR No</span>
        <span className="border-r border-gray-200 px-2">Date</span>
        <span className="border-r border-gray-200 px-2">Purpose</span>
        <span className="px-2 text-center">Status</span>
      </div>
    

      {/* Table Data */}
      <ul className="mt-4 space-y-4">
        {enrichedAppointmentData.slice(0, 2).map((patient, index) => (
          <li key={index} className="grid grid-cols-5 items-center border-b border-gray-200 pb-4 text-left">
            {/* patient Name & Image */}
            <div className="flex items-center space-x-4 border-r border-gray-200 px-2">
              <img
                src={`${defaultUrl}${patient.prof_pics}`}
                alt="patientImg"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-sm font-medium">{patient.fullname}</div>
            </div>

            {/* Specialization Title */}
            <div className="text-sm text-gray-500 border-r border-gray-200 px-2">
              {patient.ehr}
            </div>

            {/* Date */}
            <div className="text-sm text-gray-500 border-r border-gray-200 px-2">
              {formatDateWithOrdinalSuffix(patient.date)}
            </div>

            {/* Purpose */}
            <div className="text-sm text-gray-500 border-r border-gray-200 px-2">
              {patient.purpose || 'N/A'}
            </div>

            {/* Status with Icon */}
            <div className="text-sm font-semibold flex items-center justify-center space-x-2 px-2">
              {statusMap[patient.status]?.icon}
              <span>{statusMap[patient.status]?.label}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <div className="text-center flex justify-center items-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spinSlow"></div>
    </div>
  )}
</div>


<div className="bg-white p-6 rounded-lg shadow-md">
      {/* Header with dropdown */}
      <div className="border-b border-gray-200 flex justify-between items-center mb-4">
        <h3 className="font-bold uppercase">Wallet Overview</h3>
      

      </div>

      {/* Income Amount Display */}
      <div className="flex flex-col p-4 rounded-lg mb-4 bg-gray-50">
        <div className='flex justify-between'>
          <div>
            <p className="text-2xl font-bold">{currencySymbol}{totalIncome.toLocaleString()}</p>
            <p className='hidden md:block'>Total Income</p>
          </div>
          <div className="text-right">
            {/* <p className='bg-primary inline-block rounded-full px-4 py-1 text-sm text-white'>
              {lastMonthIncome}%
            </p> */}
            <p className="text-gray-500 hidden md:block">Total Money made in {siteName}</p>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <div className="flex items-center mb-4 bg-gray-100 p-2 rounded justify-between">
        <label className="mr-2 ">Total Money made in {siteName}</label>
        <div className="flex items-center cursor-pointer" onClick={() => setToggle(!toggle)}>
          {/* {toggle ? (
            <FaToggleOn className="text-primary" size={40} />
          ) : (
            <FaToggleOff className="text-secondary" size={40} />
          )} */}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 justify-between">
      {['See Wallet', 'Withdrawal History'].map((action) => (
        <button
          key={action}
          onClick={() => navigate(action === 'See Wallet' ? '/doctor/wallet' : '/doctor/wallet')}
          className={`py-2 px-4 rounded ${
            action === 'See Wallet'
              ? 'bg-primary text-white'
              : 'bg-secondary text-white'
          }`}
        >
          {action}
        </button>
      ))}
      </div>
    </div>

     
    </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
