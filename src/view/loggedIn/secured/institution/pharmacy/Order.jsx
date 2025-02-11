import {  useEffect, useState } from 'react';
import { APIURLS, NAMES, PHARMACYSIDEBARMENU } from '../../../../../components/Constants';
import SideBarMenu from '../../../../../components/SideBarMenu';
import UseSideBarMenu from '../../../../../hooks/UseSideBarMenu';
import PharmacyHeader from '../../../../partials/PharmacyHeader';
import { FaQrcode, FaBoxOpen, FaTimes, FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { getUserData } from '../../../../../components/Helper';

const Order = () => {
    const userData =getUserData();
    
    const navigate = useNavigate();
  

    const currencySymbol = NAMES.NairaSymbol
  const { isSidebarOpen, toggleSidebar } = UseSideBarMenu();
  const [activeTab, setActiveTab] = useState('scan');
  const [prescribedCode, setPrescribedCode] = useState('');
  const [prescribedMedication, setPrescribedMedication] = useState(null);
  const [medications, setMedications] = useState([{ name: '', qty: 0, price: 0 }]);

  const [noMedicationFound, setNoMedicationFound] = useState(false);

  useEffect(() => {
    const profileUpdated = userData?.data?.profile_updated;
    console.log("Profile Updated:", profileUpdated);
  
    if (profileUpdated !== 1) {
      console.log("Redirecting to onboarding...");
      navigate("/institution/Pharmacy/onboarding");
    }
  }, [userData]);
  const medicationData = {
    '1234': [
      { name: 'Paracetamol', dosage: '500mg', timesPerDay: '3' },
      { name: 'Ibuprofen', dosage: '200mg', timesPerDay: '2' },
    ],
    '5678': [{ name: 'Amoxicillin', dosage: '250mg', timesPerDay: '2' }],
  };

  



  const handleSubmitCode = (code) => {
    if (code && medicationData[code]) {
      setPrescribedMedication(medicationData[code]);
      setNoMedicationFound(false);
    } else {
      setPrescribedMedication(null);
      setNoMedicationFound(true);
    }
  };

  const handleClearInput = () => {
    setPrescribedCode('');
    setPrescribedMedication(null);
    setNoMedicationFound(false);
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...medications];
    if (field === 'qty' || field === 'price') {
        value = parseFloat(value) || 0; 
      }
    updatedMedications[index][field] = value;
    setMedications(updatedMedications);
  };

  const addMoreMedications = () => {
    setMedications([...medications, { name: '', qty: 0, price: 0 }]);
  };

  const calculateTotal = () => {
    return medications.reduce((total, med) => total + (med.qty * med.price), 0);
  };

  const handleSubmit = async () => {
    const invoiceData = medications.map((med) => ({
      name: med.name,
      qty: med.qty,
      price: med.price,
      total: med.qty * med.price,
    }));
  
    // Format invoice data for confirmation dialog
    const formattedInvoiceData = invoiceData
      .map((item) => `${item.name} (Qty: ${item.qty}, Total: $${item.total.toFixed(2)})`)
      .join('\n');
  
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Confirm Submission',
      text: `Are you sure you want to submit this invoice\n\n${formattedInvoiceData}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit',
      cancelButtonText: 'No, cancel',
    });
  
    if (result.isConfirmed) {
      const token = localStorage.getItem('token') || '';
  
      try {
        const response = await fetch(APIURLS.APIURLLABORATORYSENDPRICEORDER, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ invoice: invoiceData }),
        });
  
        if (response.ok) {
          const result = await response.json(); 
          console.log(result); 
          Swal.fire({
            icon:'success',
            title:'Order submitted successfully',
            text:`You have successfully submitted your request to get paid of ${invoiceData.map((item) =>item.total.toFixed(2))}!`
          })
        } else {
          const errorMessage = await response.text();
          Swal.fire('Error', `Failed to submit invoice: ${errorMessage}`, 'error');
        }
      } catch (error) {
        console.error('Error submitting invoice:', error);
        Swal.fire('Error', 'An error occurred while submitting the invoice.', 'error');
      }
    } else {
      Swal.fire('Cancelled', 'Your submission was cancelled.', 'info');
    }
  };
  

  return (
    <div className="flex h-screen bg-gray-100 overflow-x-hidden">
      <SideBarMenu isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} menuItems={PHARMACYSIDEBARMENU} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'sm:ml-20'}`}>
        <PharmacyHeader />
        <main className="p-6 bg-gray-100 flex-grow">
           <Link to={'/institution/pharmacy/Dashboard'} className='underline flex space-x-2 text-secondary my-4 '><FaArrowLeft className='mt-1 text-primary'/>
                   <span>Back to Home</span></Link>
          <div className="flex flex-col md:flex-row bg-gray-100 space-x-5">
            <div className="w-full md:w-1/4 bg-white p-6 shadow-lg rounded-lg mb-6 md:mb-0">
              <ul className="grid grid-cols-2 gap-4 md:grid-cols-1">
                <li
                  onClick={() => setActiveTab('scan')}
                  className={`flex flex-col md:flex-row items-center cursor-pointer p-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ${activeTab === 'scan' ? 'bg-secondary text-white' : 'bg-gray-50 text-primary'}`}
                >
                  <FaQrcode className="text-3xl mr-4" />
                  <span className="text-lg font-semibold hidden md:inline">Scan Prescribed Code</span>
                </li>
                <li
                  onClick={() => setActiveTab('inventory')}
                  className={`flex flex-col md:flex-row items-center cursor-pointer p-4 rounded-lg transition  duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ${activeTab === 'inventory' ? 'bg-secondary text-white' : 'bg-gray-50 text-primary'}`}
                >
                  <FaBoxOpen className="text-3xl mr-4" />
                  <span className="text-lg font-semibold hidden md:inline" >Enter Inventory</span>
                </li>
              </ul>
            </div>

            <div className="flex-1 p-6 bg-white rounded-lg shadow-lg">
              {activeTab === 'scan' ? (
                <div>
                  <h2 className="text-xl font-bold mb-4">Scan Prescribed Code</h2>
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
                      onClick={() => handleSubmitCode(prescribedCode)}
                      className="p-2 bg-primary text-white rounded"
                    >
                      Submit Code
                    </button>

                  
                  </div>

                

                  {noMedicationFound && (
                    <p className="text-red-500">No medication found for the entered code.</p>
                  )}

                  {prescribedMedication && (
                    <div className="mt-4">
                      <h3 className="text-lg font-bold">Prescribed Medication</h3>
                      {prescribedMedication.map((med, index) => (
                        <div key={index} className="p-4 my-2 border border-gray-300 rounded-lg shadow-md">
                          <div className="flex flex-col items-start mb-2">
                           
                            <h4 className="font-semibold text-gray-700">{med.name}</h4>
                            <p className="text-sm text-gray-500">
                              {med.dosage}, {med.timesPerDay} times per day
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
             <div>
  <h2 className="text-xl font-bold mb-4">Enter Inventory</h2>
  
  {/* Table for displaying medications */}
 <div className="overflow-x-auto w-60 custom-xs:w-[250px] custom-sm:w-[280px] custom-pixel:w-[320px] md:w-full ">
  <table className="max-w-full border-collapse border border-gray-300 mb-4">
    <thead>
      <tr className="bg-gray-200">
        <th className="border border-gray-300 p-2 whitespace-nowrap">Medication Name</th>
        <th className="border border-gray-300 p-2 whitespace-nowrap">Quantity</th>
        <th className="border border-gray-300 p-2 whitespace-nowrap">Price</th>
        <th className="border border-gray-300 p-2 whitespace-nowrap">Total Price</th>
      </tr>
    </thead>
    <tbody>
      {medications.map((med, index) => {
        // Calculate totalPrice for each medication
        const totalPrice = (parseFloat(med.qty) || 0) * (parseFloat(med.price) || 0);

        return (
          <tr key={index}>
            <td className="border border-gray-300 p-2">
              <input
                type="text"
                value={med.name}
                onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                placeholder="Medication Name"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </td>
            <td className="border border-gray-300 p-2">
              <input
                type="text"
                value={parseFloat(med.qty)}
                onChange={(e) => handleMedicationChange(index, 'qty', e.target.value)}
                placeholder="Quantity"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </td>
            <td className="border border-gray-300 p-2">
              <input
                type="text"
                value={parseFloat(med.price)}
                onChange={(e) => handleMedicationChange(index, 'price', e.target.value)}
                placeholder="Price"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </td>
            <td className="border border-gray-300 p-2 font-bold">
              <p className="w-full p-2 border border-gray-300 rounded">
                {currencySymbol}{totalPrice.toFixed(2)}
              </p>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>


  <h3 className="font-bold mt-11 flex justify-end">Total: {currencySymbol}{calculateTotal().toFixed(2)}</h3>
  
  {/* Buttons for adding more medications and submitting */}
  <div className="grid grid-cols-1 sm:grid-cols-2 space-x-0 sm:space-x-6 mt-3">
    <button
      onClick={addMoreMedications}
      className="mb-4 p-3 bg-primary rounded-xl text-white hover:bg-secondary hover:text-white"
    >
      Add More Medications
    </button>

    <button
      onClick={handleSubmit}
      className="mb-4 p-3 bg-secondary text-white rounded-xl hover:bg-primary hover:text-white"
    >
      Submit Medications
    </button>
  </div>

  {/* Display Invoice */}
  {/* {invoice.length > 0 && (
    <div className="mt-8 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Invoice</h2>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Medication Name</th>
            <th className="border border-gray-300 p-2">Quantity</th>
            <th className="border border-gray-300 p-2">Price</th>
            <th className="border border-gray-300 p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.map((item, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{item.name}</td>
              <td className="border border-gray-300 p-2">{item.qty}</td>
              <td className="border border-gray-300 p-2">{currencySymbol}{item.price.toFixed(2)}</td>
              <td className="border border-gray-300 p-2">{currencySymbol}{item.total.toFixed(2)}</td>
            </tr>
          ))}
          <tr className="bg-gray-200">
            <td colSpan={3} className="border border-gray-300 p-2 font-bold">Total</td>
            <td className="border border-gray-300 p-2 font-bold">{currencySymbol}{calculateTotal().toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )} */}
</div>

              
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Order;
