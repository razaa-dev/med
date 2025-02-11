import { useState } from 'react';
import { IoIosCloseCircle, IoIosSearch } from 'react-icons/io';
import PropTypes from 'prop-types';
import { APIURLS, defaultUrl } from './Constants';

const SearchMobile = ({ placeholder, customClassName, searchValue,  }) => {
  const apiForInstitution= APIURLS.INSITUTION_API;
  const apiForDoctor = APIURLS.APIURLPATIENTSFINDDoctorSpecializationSearch
  const [search, setSearch] = useState(searchValue || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const token = localStorage.getItem('token');


  
  

 

  // Cancel and navigate back
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.length >= 1) { 
      console.log(`Searching for: ${value}`); 
      fetchData(value);
    } else {
      setSearchResults([]); 
    }
  };
  
  const clearSearch = () => {
    setSearch('');
    setSearchResults([]);
  };
  
  const fetchData = async (query) => {
    const apiUrlForDoctor = `${apiForDoctor}fullname=${query}&specialization=${query}&gender=${query}`;
    const apiUrlForInstitution = `${apiForInstitution}institution_type=${query}&institution_name=${query}&address=${query}`;
  
    console.log(`Doctor API URL: ${apiUrlForDoctor}`);
    console.log(`Institution API URL: ${apiUrlForInstitution}`);
  
    try {
      // Fetch both APIs simultaneously
      const [doctorResponse, institutionResponse] = await Promise.all([
        fetch(apiUrlForDoctor, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(apiUrlForInstitution, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);
  
      if (!doctorResponse.ok || !institutionResponse.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Parse JSON data
      const doctorData = await doctorResponse.json();
      const institutionData = await institutionResponse.json();
  
      console.log('Doctor API Response:', doctorData);
      console.log('Institution API Response:', institutionData);
  
      let filteredResults = [];
  
      if (doctorData && doctorData.data) {
        filteredResults = [
          ...filteredResults,
          ...doctorData.data.filter((item) =>
            item.fullname.toLowerCase().includes(query.toLowerCase()) ||
            item.specialization.toLowerCase().includes(query.toLowerCase()) ||
            item.gender.toLowerCase().includes(query.toLowerCase())
          )
        ];
      }
  
      if (institutionData && institutionData.data) {
        filteredResults = [
          ...filteredResults,
          ...institutionData.data.filter((item) =>
            item.institution_name.toLowerCase().includes(query.toLowerCase()) ||
            item.institution_type.toLowerCase().includes(query.toLowerCase()) ||  
            item.address.toLowerCase().includes(query.toLowerCase())
          )
        ];
      }
      
     
  
      setSearchResults(filteredResults);
  
      console.log(`the filtered results ${filteredResults}`);
  
    } catch (error) {
      console.error('Error fetching data:', error);
      setSearchResults([]); 
    }
  };
  

  
  
  
  
  return (
    <div className="relative px-4 py-2 dark:border-gray-500">
      <div onClick={() => setIsModalOpen(true)} className="flex items-center border border-gray-300 rounded-full dark:bg-gray-900 dark:border-gray-600 dark:text-white focus-within:ring-[#a5e6e9] focus-within:border-[#a5e6e9] focus-within:bg-[#e8f3f3] cursor-pointer">
        <IoIosSearch className="text-gray-500 dark:text-gray-400 ml-3" size={20} />
        <input
          type="text"
          placeholder={placeholder || "Search.."}
          value={search}
          onChange={handleSearchChange}
          className={` px-3 py-2 border-none rounded-full dark:bg-gray-900 dark:text-white focus:outline-none capitalize ${customClassName}`}          readOnly
        />
      </div>

      {/* Full-Screen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white z-50 p-4 overflow-auto">
          {/* Modal Header */}
          <div className="w-full flex justify-between mb-4 items-center space-x-2">
  {/* Search Input with Clear Icon */}
  <div className="relative w-10/12">
    <input
      type="text"
      placeholder="Search..."
      value={search}
      onChange={handleSearchChange}
      className="w-full border border-primary outline-none px-3 py-2 rounded-full capitalize focus:bg-gray-100 pr-10 relative"
      autoFocus
    />
    {/* Clear Icon inside the input */}
    {search && (
      <IoIosCloseCircle
        onClick={clearSearch}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary text-2xl cursor-pointer"
      />
    )}
  </div>

  {/* Cancel Button */}
  <button
    onClick={handleCancel}
    className="w-2/12 text-secondary text-lg font-semibold"
  >
    Cancel
  </button>
</div>
{/* quick picks */}
<div className="flex flex-col space-y-2 h-[20vh]">

{searchResults.map((item) => (
  <div key={item.id} className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 rounded-sm">
   
    {item.fullname ? (
      // Render doctor info
      <div className="flex items-center">
        <img src={`${defaultUrl}${item.prof_pics}`} alt={item.fullname} className="w-12 h-12 rounded-full" />
        <div className="ml-2">
          <p className="capitalize text-gray-700">{item.fullname}</p>
          <p className="text-sm text-gray-500 capitalize"> {item.specialization.endsWith("s") ? item.specialization.slice(0, -1) : item.specialization}</p>
        </div>
      </div>
    ) : (
      // Render institution info
      <div className="flex items-center">
        <img src={`${defaultUrl}${item.logo}`} alt={item.institution_name} className="w-12 h-12 rounded-full" />
        <div className="ml-2">
          <p className="capitalize text-gray-700">{item.institution_name}</p>
          <p className="text-sm text-gray-500 capitalize" >{item.institution_type}</p>
          {/* <p className="text-sm text-gray-500">{item.address}</p> */}
        </div>
      </div>
    )}
  </div>
))}

  </div>


        
        </div>
      )}
    </div>
  );
};

// Prop Types for validation
SearchMobile.propTypes = {
  placeholder: PropTypes.string,
  customClassName: PropTypes.string,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func,
  onFilterChange: PropTypes.func,
};

export default SearchMobile;
