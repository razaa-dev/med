import {  IoMdEye,IoMdEyeOff } from 'react-icons/io'
import { useEffect, useState } from 'react'
import Notification from '../../../../../components/Notification'
import MobileMenu from '../../../../../components/MobileMenu'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import _ from 'lodash';


import NotificationIcon from '../../../../../components/NotificationIcon'
import { getUserData, logout } from '../../../../../components/Helper'
import { useNotification } from '../../../../../hooks/useNotification';
import { NAMES } from '../../../../../components/Constants';
import Greet from '../../../../../components/Greet';
import { CgMenuRound } from 'react-icons/cg';
// import NotificationItem from '../../components/NotificationItem'

const MobileSecuredHeader = () => {
  const { notifications } = useNotification();
  const userData=getUserData();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isEidVisible, setIsEidVisible] = useState(false);  
  const [showNotification, setShowNotification] = useState(false);
  
  const totalNotifications = _.size(notifications);
  console.log(`the total ${totalNotifications}`)
 

  // Step 2: Toggle notification visibility
  const handleNotificationClick = () => {
    setShowNotification(!showNotification);
  };

  
  const handleCloseNotification = () => {
    setShowNotification(false);
  };
  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };
 


  const renderValue = () => {
    // if (isEidVisible) {
    //   return isBalanceVisible
    //     ? `EHR Number: ${userData?.data?.ehr }`
    //     : `EHR Number: ${'*'.repeat(String(userData?.data?.ehr).length)}`;
    // }
    return isBalanceVisible
      ? `Wallet Balance: ${NAMES.NairaSymbol}${NAMES.WALLETBALANCE.toLocaleString()}`
      : `Wallet Balance: ${'*'.repeat(String(userData?.data?.walletbalance).length)}`;
  };
 
  useEffect(() => {
    const interval = setInterval(() => {
      setIsEidVisible((prev) => !prev);
    }, 6000); 

    return () => clearInterval(interval); 
  }, []);
  return (
    <>
  <div className="flex justify-between mt-4 overflow-y-auto scrollbar-thin">
    <div className="flex justify-between"> 
      <div>
        {/* menu */}
        <MobileMenu/>
      </div>

<div className="ml-3" ><div className="flex">
<p className="font-bold text-primary dark:text-secondary flex space-x-1 mb-1">
  <Greet/> <span className='capitalize'>{userData? userData?.data?.fullname.split(' ')[0].trim():"User" }!</span>
</p>

      </div>
        

 <div className={`flex swipe-up-animation ${isEidVisible ? 'show-eid' : 'show-balance'}`}>
        <p className="-mt-1 text-gray-500 dark:text-gray-300">
        {renderValue()}
        </p>
        <p className='-mt-1'>{isBalanceVisible ? (
          <IoMdEye
            className="mt-1 text-gray-500 dark:text-white  ml-1 cursor-pointer"
            size={16}
            onClick={toggleBalanceVisibility}
          />
        ) : (
          <IoMdEyeOff
            className="mt-1 text-gray-500 dark:text-white ml-1 cursor-pointer"
            size={16}
            onClick={toggleBalanceVisibility}
          />
        )}</p>
      </div>
      </div>
</div>

 <div className='flex'>
 < div className="flex justify-between  relative mr- mt-1">
 {/* <div className=''>
  <FaLocationDot size={20} className='mt-[2px] text-primary'/>
  </div> */}
 {/* Notification Icon */}
 <NotificationIcon  BadgeClassName={` mx-3 mt-[3px] `}
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
          />

          {/* Conditional rendering of the Notification component */}
          {showNotification && <Notification onClose={handleCloseNotification}   showNotification={showNotification} className={` fixed inset-y-0 right-0 w-full bg-white dark:bg-gray-800 shadow-lg z-50 transition-transform duration-1000 ease-in- overflow-y-scroll scrollbar-thin`} />}
          
</div>
{/* Logout Item */}
    <button onClick={toggleDropdown}>
               <CgMenuRound size={24} className={` -mt-4 mr-4 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
             </button>
              {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute top-14 right-4 bg-white dark:bg-gray-800 text-black dark:text-white rounded shadow-md p-2 z-50 sm:hidden">
          <ul>
            <li className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">Profile</li>
            <li className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">Settings</li>
            <li className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-secondary"><button onClick={logout}>Logout</button></li>
          </ul>
        </div>
      )}

</div>
  </div>



 <div>
 </div>
 <div></div>
    </>
  )
}

export default MobileSecuredHeader