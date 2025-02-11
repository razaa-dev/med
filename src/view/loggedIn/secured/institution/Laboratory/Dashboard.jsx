import SideBarMenu from '../../../../../components/SideBarMenu';
import UseSideBarMenu from '../../../../../hooks/UseSideBarMenu';
import { NAMES, LABORATORYSIDEBARMENU, Pharmacytransactions } from '../../../../../components/Constants';
import PropTypes from 'prop-types';
import { GiReceiveMoney } from 'react-icons/gi';
// import { FcSalesPerformance } from 'react-icons/fc';
import { FaFirstOrder, FaUserCheck } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { getUserData } from '../../../../../components/Helper';
import { FcSalesPerformance } from 'react-icons/fc';
import LaboratoryHeader from '../../../../partials/LaboratoryHeader';
import { useEffect } from 'react';

const Dashboard = () => {
  const userData =getUserData();
  const navigate = useNavigate();

  const { isSidebarOpen, toggleSidebar } = UseSideBarMenu();
  const Name = userData?.data?.institution_name ;
  const EHR = userData?.data?.ehr;
  const walletBalance = userData?.data?.acctbal;
const spent =userData?.data?.spent
  const totalSales= userData?.data?.totalSales|| 0;
  const totalOrders= userData?.data?.totalSales|| 0;
  const totalRevenue=spent|| 0.00;

  useEffect(() => {
    const profileUpdated = userData?.data?.profile_updated;
    console.log("Profile Updated:", profileUpdated);
  
    if (profileUpdated !== 1) {
      console.log("Redirecting to onboarding...");
      navigate("/institution/laboratory/onboarding");
    }
  }, [userData]);
  return (


    
    <div className="flex h-screen bg-gray-100 ">
      {/* Sidebar */}
      <SideBarMenu isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} menuItems={LABORATORYSIDEBARMENU} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0 sm:ml-20'}`}>
        {/* Topbar */}
        <LaboratoryHeader />

        {/* Dashboard Content */}
        <main className="p-6 bg-gray-100 flex-grow mt-[65px] md:mt-3 ">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Account Card */}
            <div className="bg-white p-6 rounded-lg shadow-lg col-span-1 md:col-span-2 hidden md:inline-block lg:col-span-2">
              <div className="flex  justify-between items-center ">
                <div className=''>
                  <h2 className="text-gray-500 font-bold capitalize">Main account</h2>
                  <p className="text-xl font-semibold text-primary">{Name}</p>
                  <p className="text-gray-400 mx-1">{EHR}</p>
                </div>
                <div className="text-right ">
                  <p className="text-gray-500">Available funds</p>
                  <h1 className="text-4xl font-bold">{NAMES.NairaSymbol}{Number(walletBalance).toLocaleString()}</h1>
                </div>
              </div>
              <div className="mt-4 flex space-x-4">
                <button className="bg-secondary text-white px-4 py-2 rounded-lg"><a href="/institution/laboratory/wallet">Withdraw money</a></button>
                {/* <button className="bg-primary text-white px-4 py-2 rounded-lg"><a href="/institution/laboratory/wallet">Link accounts</a></button> */}
              </div>
            </div>

            {/* Standing Orders Section */}
            <div className=" bg-primary p-6 rounded-lg shadow-lg text-white">
              <h2 className="text-xl font-bold">View Patient order List</h2>
              <p className="mt-2">You can either scan or write the code prescribed to patient by doctor.</p>
              <Link to={'/institution/laboratory/Order'}>
              <button className="bg-white text-primary px-4 py-2 mt-4 rounded-lg">View Order Note</button>
              </Link>
            </div>
          </div>
          
          {/* Bank Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <PharmacyCard pharmacy="Total Revenue" balance={`${NAMES.NairaSymbol} ${totalRevenue.toLocaleString()}`} icon={<GiReceiveMoney size={40} className="text-primary" />} />
            <PharmacyCard pharmacy="Total Sales" balance={totalSales.toLocaleString()} icon={<FcSalesPerformance size={40} className='text-primary' />} />
            <PharmacyCard pharmacy="Total Orders" balance={totalOrders.toLocaleString()} icon={<FaFirstOrder size={40} className='text-primary' />} />
            <PharmacyCard pharmacy="Total Customers" balance={userData?.data?.no_of_consultations.toLocaleString()} userData icon={<FaUserCheck size={40} className='text-primary'/>} />
          </div>

          {/* Latest Transactions Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg mt-6 hidden md:block">
            <h2 className="text-xl font-bold mb-4 capitalize text-primary">Latest transactions</h2>
            <TransactionList transactions={Pharmacytransactions} /> {/* Ensure prop name matches */}
          </div>
        </main>
      </div>
    </div>
  );
};

const PharmacyCard = ({ pharmacy, balance, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow-lg">
    <div className="flex justify-between items-center">
      {icon}
      <p className="text-lg font-semibold">{balance}</p>
    </div>
    <p className="text-gray-500 mt-2">{pharmacy}</p>
  </div>
);

const TransactionList = ({ transactions }) => ( 
  <div className="space-y-4 hidden md:block">
    <div className="">
      <table className="min-w-full table-auto text-left">
        <thead>
          <tr className="bg-gray-100 text-gray-600">
            <th className="p-3">No</th>
            <th className="p-3">Customers</th>
            <th className="p-3">Order</th>
            <th className="p-3">Cost</th>
            <th className="p-3">Date</th>
          </tr>
        </thead>
        <tbody>
          
          {transactions.map((order, index) => ( 
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="p-3 text-gray-700">{order.id}</td>
              <td className="p-3 flex items-center">
                <img src={order.img} alt="avatar" className="w-8 h-8 rounded-full mr-2" />
                <span>{order.customer}</span>
              </td>
              <td className="p-3 text-primary ">{order.order}</td>
              <td className="p-3 text-gray-700">{NAMES.NairaSymbol}{order.cost}</td>
              <td className="p-3 text-gray-500">{order.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// PropTypes validation
PharmacyCard.propTypes = {
  pharmacy: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};

TransactionList.propTypes = {
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired, // Ensure this matches the prop passed
};

export default Dashboard;
