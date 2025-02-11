import { DOCTORSIDEBARMENU, patientsData } from '../../../../components/Constants';
import SideBarMenu from '../../../../components/SideBarMenu';
import UseSideBarMenu from '../../../../hooks/UseSideBarMenu';

import { useState } from 'react';
import { IoArrowBackSharp } from 'react-icons/io5';
import useTabs from '../../../../hooks/useTabs';
import { BsHeartPulseFill } from 'react-icons/bs';
import { FaTemperatureHigh } from 'react-icons/fa';
import { GiHealthCapsule } from 'react-icons/gi';
import DoctorsHeader from '../../../partials/DoctorsHeader';

const Patients = () => {
  
  const { isSidebarOpen, toggleSidebar } = UseSideBarMenu();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { activeTab, toggleTab } = useTabs('userRecord'); 
 

  const renderTabContent = () => {
    switch (activeTab) {
      case 'userRecord':
        return (
          <div>
            <h3 className="font-semibold text-lg">Patient Information</h3>
            <p><strong>Name:</strong> {selectedPatient.name}</p>
            <p><strong>Appointment:</strong> {selectedPatient.appointment}</p>
            <p><strong>Counseling:</strong> {selectedPatient.counseling}</p>
          </div>
        );
      case 'labReports':
        return <div>Lab Reports Content</div>;
      case 'prescriptions':
        return <div>Prescriptions Content</div>;
      case 'medication':
        return <div>Medication Content</div>;
      case 'diagnosis':
        return <div>Diagnosis Content</div>;
      default:
        return null;
    }
  };
  
  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
  };

  const handleBackClick = () => {
    setSelectedPatient(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredPatients = patientsData.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBarMenu isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}   menuItems={DOCTORSIDEBARMENU} />

      {/* Main Content */}
      <div className={`flex-1 ml-${isSidebarOpen ? '64' : '0 sm:ml-20'} transition-all duration-300`}>
        {/* Topbar */}
        <DoctorsHeader />


        {/* Dashboard Content */}
        <main className="p-6 bg-gray-100 flex-grow">
          <div className="sm:flex justify-between mb-0">
            {/* Main content */}
            <div className="col-span-12 md:col-span-9">
              {/* Conditionally render Search Input */}
              {!selectedPatient && (
                <div className="flex justify-between items-center mb-4">
                  <input
                    type="text"
                    placeholder="Search patients"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="border p-2 rounded-md w-full md:w-1/2"
                  />
                </div>
              )}

              {/* Patient List or Patient Details */}
              {selectedPatient ? (
                
                <div className="patient-details p-6 bg-white shadow-lg rounded-lg w-full sm:w-[90vw] sm:mx-auto sm:my-6 border-2 border-gray-400">
                <div className="border-b-2 border-gray-400 text-primary flex">
                  <IoArrowBackSharp onClick={handleBackClick} className="text-2xl mr-4 mb-3" />
                  <p className="font-bold text-xl uppercase">Patients Profile</p>
                </div>

                <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    
    {/* Left Column: Patient Info */}
    <div className="lg:col-span-1  flex flex-col items-center">
    <div className='bg-white w-full max-w-sm rounded-lg shadow-md flex flex-col items-center p-6 mx-auto mb-4 h-full'>
  <img
    src="https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" // Placeholder image (replace with actual image source)
    alt="Roger Curtis"
    className="w-32 h-32 rounded-xl mb-4"
  />
  <h2 className="text-lg font-bold">Roger Curtis</h2>
  <p className="text-gray-600">Age: 36</p>
  <p className="text-gray-600">EHR: 208898786</p>

  <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg">Update</button>
</div>

      
<div className='bg-white w-full rounded-lg shadow-md p-6 mx-auto'>
  <ul className="text-gray-700 space-y-6 mt-4 p-6">
  <li><strong>EHR:</strong> 208898786</li>
    <li><strong>Gender:</strong> Male</li>
    <li><strong>Blood Type:</strong> O+ (Positive)</li>
    <li><strong>Allergies:</strong> Milk, Penicillin</li>
    <li><strong>Diseases:</strong> Diabetes, Blood Disorders</li>
    <li><strong>Height:</strong> 1.78m</li>
    <li><strong>Weight:</strong> 65 kg</li>
    <li><strong>Last Visit:</strong> 25th October 2019</li>
  </ul>
</div>

     
      
    </div>

    {/* Right Column: Vital Signs, Test Reports, and Prescriptions */}
    <div className="lg:col-span-2 space-y-6">

      {/* Vital Signs */}
      <div className=" p-6 rounded-lg shadow-md grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="text-center bg-white rounded-2xl shadow-md p-9  mx-3">
        <BsHeartPulseFill size={40} className='mx-auto text-red-500 mb-2' />

          <h3 className="text-xl font-semibold">Heart Rate</h3>
          <p className="text-2xl font-bold text-red-500"><span className='text-4xl'>80</span>bpm</p>
        </div>
        <div className="text-center bg-white rounded-2xl shadow-md p-9  mx-3">
        <FaTemperatureHigh size={40} className='mx-auto text-blue-500 mb-2' />

          <h3 className="text-xl font-semibold">Body Temperature</h3>
          <p className="text-2xl font-bold text-blue-500"><span className='text-4xl'>36.5</span>°C</p>
        </div>
        <div className="text-center bg-white rounded-2xl shadow-md p-9  mx-3">
        <GiHealthCapsule size={40} className='mx-auto text-yellow-500 mb-2' />

          <h3 className="text-xl font-semibold">Glucose</h3>
          <p className="text-2xl font-bold text-yellow-500"><span className='text-4xl'>100</span>mg/dl</p>
        </div>
      
      </div>

      {/* Test Reports */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Test Reports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center">
            <div className="bg-blue-500 p-2 rounded-full text-white mr-4">📄</div>
            <div>
              <p className="font-semibold">CT Scan - Full Body</p>
              <p className="text-gray-500">12th February 2020</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-yellow-500 p-2 rounded-full text-white mr-4">🧪</div>
            <div>
              <p className="font-semibold">Creatine Kinase T</p>
              <p className="text-gray-500">12th February 2020</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-red-500 p-2 rounded-full text-white mr-4">👁️</div>
            <div>
              <p className="font-semibold">Eye Fluorescein Test</p>
              <p className="text-gray-500">12th February 2020</p>
            </div>
          </div>
        </div>
      </div>

      {/* Prescriptions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Prescriptions</h3>
        <div className="border-dashed border-2 border-gray-400 p-4 mb-4 text-center text-green-500 cursor-pointer">+ Add a prescription</div>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Heart Diseases</p>
              <p className="text-gray-500">25th October 2019</p>
            </div>
            <p className="text-gray-600">3 months</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Skin Care</p>
              <p className="text-gray-500">8th August 2019</p>
            </div>
            <p className="text-gray-600">2 months</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="bg-white p-6 rounded-lg shadow-md mt-8">
  <div className="flex justify-around mb-6">
    <button 
      onClick={() => toggleTab('userRecord')} 
      className={`flex-1 p-3 font-semibold rounded-full transition duration-300  mx-3 ease-in-out ${activeTab === 'userRecord' ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
    >
      Record
    </button>
    <button 
      onClick={() => toggleTab('labReports')} 
      className={`flex-1 p-3 font-semibold rounded-full transition duration-300 mx-3 ease-in-out ${activeTab === 'labReports' ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
    >
      Lab
    </button>
    <button 
      onClick={() => toggleTab('diagnosis')} 
      className={`flex-1 p-3 font-semibold rounded-full transition duration-300 mx-3 ease-in-out ${activeTab === 'diagnosis' ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
    >
      Diagnosis
    </button>
    <button 
      onClick={() => toggleTab('medication')} 
      className={`flex-1 p-3 font-semibold hidden sm:block rounded-full transition duration-300 mx-3 ease-in-out ${activeTab === 'medication' ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
    >
      Medication
    </button>
  </div>
  <div className="tab-content mt-4">
    {renderTabContent()}
  </div>
</div>

</div>
              
              </div>
              ) : (
                <div className="grid grid-cols-1 custom-md:grid-cols-2   custom-2xl:grid-cols-3 custom-xl:p-8 custom-md:p-8 gap-4 ">

{filteredPatients.map((patient) => (
  <div
    key={patient.id}
    className="bg-white p-4 m-4 shadow-md rounded-lg cursor-pointer w-full md:w-[300px] lg:w-[350px] xl:w-[400px] flex flex-row lg:flex-row items-center  lg:items-start transition-transform hover:scale-105 hover:shadow-lg lg:space-x-8 lg:px-8 "
    onClick={() => handlePatientClick(patient)}
  >
    {/* Patient Image */}
    <div className="rounded-full mb-4 lg:mb-0 lg:mr-6 ">
      <img src={patient.image} alt={patient.name} className="w-24 h-24 lg:w-16 lg:h-16 rounded-full" />
    </div>

    {/* Patient Info */}
    <div className="text-left lg:text-left ml-[50px]">
      <h3 className="font-semibold text-lg lg:text-xl text-gray-900">{patient.name}</h3>
      <p className="text-sm text-gray-500">{patient.appointment}</p>
      <p className="text-sm text-gray-500">{patient.counseling}</p>
    </div>
  </div>
))}

                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Patients;
