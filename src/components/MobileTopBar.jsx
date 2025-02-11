import { useState } from 'react';
import MobileMenu from './MobileMenu';
import { CgMenuRound } from "react-icons/cg";

import { NAMES } from './Constants';
import { logout } from './Helper';
import NotificationIcon from './NotificationIcon';
import Notification from './Notification';
import { useNotification } from '../hooks/useNotification';
import _ from 'lodash';
import PropTypes from 'prop-types';

const MobileTopBar = ({menuItems}) => {
      const { notifications } = useNotification();
     const [showNotification, setShowNotification] = useState(false);
      
    
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const logo= NAMES.LOGO;

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const totalNotifications = _.size(notifications);
      console.log(`the total ${totalNotifications}`)
     
    
      // Step 2: Toggle notification visibility
      const handleNotificationClick = () => {
        setShowNotification(!showNotification);
      };
    
      
      const handleCloseNotification = () => {
        setShowNotification(false);
      };
  return (
    <>
      {/* TopBar - Visible on Mobile Only */}
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-secondary text-primary p-4 flex items-center justify-between shadow-md z-50 sm:hidden">
        
        {/* Sidebar Toggle Button */}
        <MobileMenu menuItems={menuItems} />


        {/* Logo */}
        <img
              src={logo}
              alt="Logo"
              className="h-8 w-full "
            />
        {/* Info Icon & Dropdown */}
        <div className="flex ">
 < div className="flex justify-between  relative  mt-1">

 <NotificationIcon 
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
            BadgeClassName={` mr-9 -mt-[8px] `}
          />

          {/* Conditional rendering of the Notification component */}
      {showNotification && (
          <div
            className="absolute right-0 bg-white dark:bg-gray-800 shadow-lg z-50 transition-transform duration-1000 ease-in-out overflow-y-auto scrollbar-thin top-[40px] w-[350px] h-[500px] mx-auto rounded-xl"
           
          >
            <Notification
              onClose={handleCloseNotification}
              showNotification={showNotification}
            />
          </div>
        )}
          
</div>          <button onClick={toggleDropdown}>
            <CgMenuRound size={25} className={`-ml-5  transform -mt-[8px] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

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

      {/* MobileMenu (Your Sidebar) */}
    </>
  );
};
MobileTopBar.propTypes = {
  menuItems: PropTypes.array.isRequired,
}
export default MobileTopBar;
