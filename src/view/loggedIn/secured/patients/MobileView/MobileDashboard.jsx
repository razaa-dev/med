import CardSlider from "../../../../../components/Cards"
// import Carousel from "../../../../../components/Carousel"
// import { CAROUSEL } from "../../../../../components/constants"
import SearchMobile from "../../../../../components/SearchMobile"
import MobileSecuredHeader from "./MobileSecuredPatientsHeader"
// import Info from "../../../../../components/Info"
import ServicesMenu from "./ServicesMenu"
import TopSpecialists from "./TopSpecialists"
import Banner from "../../../../../components/Banner"
// import { FaChevronRight } from "react-icons/fa"
import NearbyInstitution from "./NearbyInstitution"
// import { Link } from "react-router-dom"

const MobileDashboard = () => {
  const handleFilterChange = () => {
    // Your filter change logic here
}
  return (
    <div className="block sm:hidden overflow-hidden">
        <MobileSecuredHeader/>
        <SearchMobile 
        placeholder="Search for doctors, pharmacies, hospitals, medications, articles..."
        searchValue=""
        onSearchChange={() => {}}
        customClassName="w-[90vw]"
        onFilterChange={handleFilterChange}

      />
       <div className="-mt-3">
       {/* <div className='flex justify-between mt-3 mx-3 text-primary dark:text-secondary -mb-3'>
       <p className='font-semibold text-md flex items-center'>
  Upcoming Schedule 
  <span className="bg-primary dark:bg-secondary text-white px-1 py-0.5 text-xs rounded-full ml-2">
    8
  </span>
</p>

    <Link to={'/schedules'}>
    <div className=' flex mx-3 font-[400]'><p>See All </p><FaChevronRight className='mt-[7px] ml-1' size={12} /></div>
    </Link>
  
    </div> */}
    <Banner/>

       </div>





        {/*  carousel */}
        {/* <div className="flex justify-center w-[97%] mx-auto">
  <Carousel items={CAROUSEL} className="rounded-xl" />
</div> */}


    {/* info */}
    {/* <Info PclassName={` custom-xs:w-[290px] custom-sm:w-[330px]  `}/> */}
      {/* ServicesMenu */}

<ServicesMenu />
{/* end ofServicesMenu */}

{/* top specialists */}
<TopSpecialists/>
{/* end of top specialists*/}
<div><CardSlider />
</div>
 {/* end of specialists */}
 {/* articles */}
 <NearbyInstitution/>

 {/* end of articles */}
    </div>

  
     
  )
}

export default MobileDashboard