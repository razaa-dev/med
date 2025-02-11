import { Link } from "react-router-dom"
import { SERVICES } from "../../../../../components/Constants"

const ServicesMenu = () => {
  return (
    <div> 
    <div className='flex justify-between mt-3 mx-3 text-primary dark:text-secondary'>
    <p className=' font-semibold text-lg'>Services</p>
   
  
    </div>
    <div className='grid grid-cols-4 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 mr-5'>
  {SERVICES.map((service, index) => (
    <Link 
      key={index} 
      to={service.link} // Link to navigate to
      className='text-center flex flex-col items-center mb-6 mx-2'
    >
      <div className={`p-[8px] rounded-full shadow-xl flex justify-center items-center text-white dark:text-white  border border-gray-200 dark:bg-secondary bg-primary mx-4 ${service.pt}`}>
        {service.icon}
      </div>
      <p className='text-sm text-primary dark:text-secondary text-center font-bold mt-2 shadow-sm rounded-full'>
        {service.name}
      </p>
    </Link>
  ))}
</div>

  </div>
  )
}

export default ServicesMenu