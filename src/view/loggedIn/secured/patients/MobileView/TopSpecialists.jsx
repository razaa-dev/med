import { FaChevronRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const TopSpecialists = () => {
  return (
<div>
<div className='flex justify-between mt-3 mx-3 my-4  text-primary dark:text-secondary'>
  <p className=' font-semibold text-lg'>Top E-Specialists</p>
  <div className=' flex mx-3 font-[400]'><Link to={'/doctors'}>See all </Link><FaChevronRight className='mt-[7px] ml-1' size={12} /></div>

  </div>
</div>  )
}

export default TopSpecialists