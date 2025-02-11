import DesktopDashboard from "./DesktopView/DesktopDashboard"
import MobileDashboard from "./MobileView/MobileDashboard"
// import '../secured/Dashboard'

const Dashboard = () => {
  return (
    
      
<div>
      
      <MobileDashboard className="" />
      
      {/* Other components for larger screens */}
      <DesktopDashboard className="" />
    </div>
   
  )
}

export default Dashboard
