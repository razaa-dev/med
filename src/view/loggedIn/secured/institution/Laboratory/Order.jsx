import {  useEffect, useState } from 'react';
import { NAMES, LABORATORYSIDEBARMENU, APIURLS } from '../../../../../components/Constants';
import SideBarMenu from '../../../../../components/SideBarMenu';
import UseSideBarMenu from '../../../../../hooks/UseSideBarMenu';
import { FaArrowLeft, FaQrcode,  FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import LaboratoryHeader from '../../../../partials/LaboratoryHeader';
import { getUserData } from '../../../../../components/Helper';
// import { QrReader } from 'react-qr-reader';
// import { MdQrCodeScanner } from 'react-icons/md';

const Order = () => {
      
  const userData =getUserData();
    
  const navigate = useNavigate();

    const currencySymbol = NAMES.NairaSymbol
  const { isSidebarOpen, toggleSidebar } = UseSideBarMenu();
  const [activeTab, setActiveTab] = useState('scan');
  const [prescribedCode, setPrescribedCode] = useState('');
  // const [isQrVisible, setIsQrVisible] = useState(false);
  const [prescribedLaboratory, setprescribedLaboratory] = useState(null);

  const [noMedicationFound, setNoMedicationFound] = useState(false);
    
 

  const medicationData = {
    '1234': [
      { name: "A patient has been referred by their doctor to undergo laboratory tests for malaria and typhoid fever. The referral is based on the patient's symptoms, which include fever and fatigue, common indicators of these infections. The malaria test will detect the presence of the Plasmodium parasite, while the typhoid test will check for Salmonella typhi bacteria. These tests are essential for confirming the diagnosis and determining the appropriate treatment plan. The results will be reviewed by the doctor to guide further medical decisions.",patientName:'fkfkf'}
    ],
    '5678': [  { name: "A patient has been referred by their doctor to undergo laboratory tests for malaria and typhoid fever. The referral is based on the patient's symptoms, which include fever and fatigue, common indicators of these infections. The malaria test will detect the presence of the Plasmodium parasite, while the typhoid test will check for Salmonella typhi bacteria. These tests are essential for confirming the diagnosis and determining the appropriate treatment plan. The results will be reviewed by the doctor to guide further medical decisions.",patientName:'Glory'}],
  };

  const handleUserPrescribedCode = (code) => {
    if (code && medicationData[code]) {
      setprescribedLaboratory(medicationData[code]);
      setNoMedicationFound(false);
    } else {
      setprescribedLaboratory(null);
      setNoMedicationFound(true);
    }
  };

  const handleClearInput = () => {
    setPrescribedCode('');
    setprescribedLaboratory(null);
    setNoMedicationFound(false);
  };

  

  const calculateTotal = () => {
    return prescribedLaboratory.reduce((total, med) => total + (med.price || 0), 0);
  };


  useEffect(() => {
      const profileUpdated = userData?.data?.profile_updated;
      console.log("Profile Updated:", profileUpdated);
    
      if (profileUpdated !== 1) {
        console.log("Redirecting to onboarding...");
        navigate("/institution/laboratory/onboarding");
      }
    }, [userData]);

  const handleSubmit = async (patientName) => {
    const token = localStorage.getItem('token');
    const totalPrice = calculateTotal();  
    
    if (totalPrice <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Total Price',
        text: `The total price must be greater than zero.`,
      });
      return; 
    }
  
    const dataToSend = {
      totalPrice,  
    };
  
    try {
      const response = await fetch(APIURLS.APIURLLABORATORYSENDPRICEORDER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (response.ok) {
        const result = await response.json();
        Swal.fire({
          icon: 'success',
          title: 'Order submitted successfully',
          text: `You have successfully submitted your request to get paid of ${currencySymbol}${totalPrice} from ${patientName}`,
        });
        console.log("Order submitted successfully", result);
      } else {
        const error = await response.json();
        console.error("Error submitting order:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error submitting your order',
          text: `The payment of ${currencySymbol}${totalPrice} from ${patientName} failed.`,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Unexpected Error',
        text: 'An unexpected error occurred while submitting your order.',
      });
    }
  };
  
  
    
  


  return (
    <div className="flex h-screen bg-gray-100 overflow-x-hidden">
      <SideBarMenu isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} menuItems={LABORATORYSIDEBARMENU} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'sm:ml-20'}`}>
      <LaboratoryHeader />
        <main className="p-6 bg-gray-100 flex-grow">
          <Link to={'/institution/laboratory/Dashboard'} className='underline flex space-x-2 text-secondary my-4 '><FaArrowLeft className='mt-1 text-primary'/>
         <span>Back to Home</span></Link>
          <div className="flex flex-col md:flex-row bg-gray-100 space-x-5 md:mt-9">
            <div className="hidden md:inline w-full md:w-1/4 bg-white p-6 shadow-lg rounded-lg mb-6 md:mb-0">
              <ul className="grid grid-cols-2 gap-4 md:grid-cols-1">
                <li
                  onClick={() => setActiveTab('scan')}
                  className={`flex flex-col md:flex-row items-center cursor-pointer p-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ${activeTab === 'scan' ? 'bg-secondary text-white' : 'bg-gray-50 text-primary'}`}
                >
                  <FaQrcode className="text-3xl mr-4" />
                  <span className="text-lg font-semibold hidden md:inline">Scan Prescribed Lab Code</span>
                </li>
               
              </ul>
            </div>

            <div className="flex-1 p-6 bg-white rounded-lg shadow-lg">
             
                <div>
                  <h2 className="text-xl font-bold mb-4">Scan Prescribed Lab Code</h2>
                  <div className="mb-6 flex items-center space-x-4">
                    <div className="relative w-full">
                      <input
                        type="text"
                        value={prescribedCode}
                        onChange={(e) => setPrescribedCode(e.target.value)}
                        placeholder="Enter prescribed code"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      {prescribedCode && (
                        <FaTimes
                          className="text-lg absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                          onClick={handleClearInput}
                        />
                      )}
                    </div>

                    <button
                      onClick={() => handleUserPrescribedCode(prescribedCode)}
                      className="p-2 bg-primary text-white rounded"
                    >
                      Submit Code
                    </button>

                    {/* <MdQrCodeScanner
                      onClick={toggleQrScanner}
                      className="text-primary cursor-pointer"
                      size={40}
                      title={isQrVisible ? 'Cancel Scan' : 'Scan QR Code'}
                    /> */}
                  </div>
{/* 
                  {isQrVisible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                      <div className="bg-gray-800 p-5  border border-white rounded-xl shadow-lg">
                        <h3 className="text-lg text-white font-semibold mb-2 text-center">Scan QR Code</h3>
                        <p className="text-yellow-500 mb-4 text-center">Scan Screening...</p>
                        <QrReader delay={300} onError={handleError} onScan={handleScan} style={{ width: '100%' }} />
                        <div className="mt-4 flex justify-center">
                          <FaImage className="text-white mr-2" />
                          <span className="text-white cursor-pointer">Photos</span>
                        </div>
                        <button
                            onClick={() => {
                                setIsQrVisible(false); // Close modal
                                stopCamera(); // Stop the camera explicitly
                              }} 
                              className="mt-4 p-2 bg-red-500 text-white rounded w-full"
                            >
                              Cancel QR Scan
                        </button>
                      </div>
                    </div>
                  )} */}

                  {noMedicationFound && (
                    <p className="text-red-500">No medication found for the entered code.</p>
                  )}
{prescribedLaboratory && (
  <div className="mt-4">
    <h3 className="text-lg font-bold capitalize">Prescribed Laboratory Test</h3>
    <table className="min-w-full table-auto border-collapse mt-4">
      <thead>
        <tr>
          <th className="p-3 text-left border-b capitalize">Laboratory Specification</th>
          <th className="p-3 text-left border-b">Price</th>
        </tr>
      </thead>
      <tbody>
  {prescribedLaboratory.map((med, index) => (
    <tr key={index} className="border-b hover:bg-gray-50">
      <td className="p-3 text-gray-700 border-x-2">{med.name}</td>
      <td className="p-3 border-r text-center">
        <input
          type="number"
          placeholder={`Enter Price in ${currencySymbol}`}
          className="p-2 border rounded w-[20vw] text-center focus:outline-none appearance-none no-arrows"
          onChange={(e) => {
            // Update the price of the corresponding med item
            const newPrice = parseFloat(e.target.value) || 0;
            const updatedPrescribedLaboratory = [...prescribedLaboratory];
            updatedPrescribedLaboratory[index].price = newPrice;
            setprescribedLaboratory(updatedPrescribedLaboratory);
          }}
        />
      </td>
    </tr>
  ))}
 
</tbody>

    </table>
    
    <div className='flex justify-between mt-5'>
    <h3 className="font-bold mt-11 flex justify-end">Total: {currencySymbol}{calculateTotal().toFixed(2)}</h3>
    <button
      onClick={() => handleSubmit(prescribedLaboratory[0].patientName)} 
      className="mb-4 p-3 bg-secondary text-white rounded-xl hover:bg-primary hover:text-white"
    >
      Submit Medications
    </button>
  </div>
  </div>
)}
                </div>
            
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Order;
