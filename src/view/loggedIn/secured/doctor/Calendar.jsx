import { APIURLS, DOCTORSIDEBARMENU} from '../../../../components/Constants';
import SideBarMenu from '../../../../components/SideBarMenu';
import UseSideBarMenu from '../../../../hooks/UseSideBarMenu';

import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa';
import { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { addDays, addMonths, endOfMonth, endOfWeek, format, isAfter, isBefore, isSameDay, parseISO, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import { MdDelete } from 'react-icons/md';
import DoctorsHeader from '../../../partials/DoctorsHeader';
import { FaUserDoctor } from 'react-icons/fa6';
import { formatEvent, formatTime, getOrdinalSuffix, getUserData } from '../../../../components/Helper';

const Calendar = () => {
  // const bannerimg= IMAGE.DefaultImageBanner
const userData= getUserData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
   const [currentMonth, setCurrentMonth] = useState(new Date());
  const [modalEvents, setModalEvents] = useState([]); 
  const [eventDays, setEventDays] = useState([]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const { isSidebarOpen, toggleSidebar } = UseSideBarMenu();

  const apiCalendarSubmit = APIURLS.APIDOCTORCALENDARSUBMIT;
  const token = localStorage.getItem('token'); 

  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    day: '',
    start_time: '',
    end_time: '',
    user_role:'doctor'
  });
  const today = new Date();
  const getDoctorCalendar = async () => {
    setLoading(true); 
    try {
      const response = await fetch(apiCalendarSubmit, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      console.log("Fetched data:", result);

      const filteredEvents = result.data.filter((event) => {
        const eventEndDate = new Date(`${event.day} ${event.end_time}`);
        const now = new Date();
        return eventEndDate > now;
      });
      const sortedEvents = filteredEvents
  
        
        .sort((a, b) => {
          const dateA = new Date(`${a.day} ${a.start_time}`);
          const dateB = new Date(`${b.day} ${b.start_time}`);
          if (dateA.getTime() === dateB.getTime()) {
            // If start times are the same, compare by end time (descending)
            const endA = new Date(`${a.day} ${a.end_time}`).getTime();
            const endB = new Date(`${b.day} ${b.end_time}`).getTime();
            return endB - endA; // Descending order for end time
          }
          return dateA - dateB;
        });

      setModalEvents(sortedEvents);
      setError(null); 
      const eventDates = sortedEvents.map(event => new Date(`${event.day} ${event.start_time}`).toLocaleDateString());
      setEventDays(eventDates);
    } catch (err) {
      console.error("Error fetching doctor calendar:", err);
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false); 
    }
  };

  const deleteModalEvent = async (eventId, index,eventDay, startTime,endTime) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to delete  your availability on ${eventDay} starting at ${startTime} and ending at ${endTime}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${apiCalendarSubmit}/${eventId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete the event");
        }

        const data = await response.json();
        console.log("Delete response:", data);

        setModalEvents((prevEvents) => prevEvents.filter((_, i) => i !== index));

        Swal.fire({
          title: "Deleted!",
          text: "The event has been successfully deleted.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
      } catch (err) {
        console.error("Error deleting event:", err);

        Swal.fire({
          title: "Error!",
          text: "There was an issue deleting the event. Please try again.",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    } else {
      console.log("Deletion canceled by the user.");
    }
  };
 
  useEffect(() => {
    getDoctorCalendar();
  }, []);
  
  
  const submitEvent = async (event) => {
    event.preventDefault();
  
    const selectedDay = new Date(`${newEvent.day} ${newEvent.start_time}`).toLocaleDateString();
  
    if (eventDays.includes(selectedDay)) {
      Swal.fire({
        title: 'Error',
        text: 'The date you selected is already set in your availability.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    } else {
      setIsModalOpen(false);
      Swal.fire({
        title: 'You are setting your availability for',
        html: `<pre>${formatEvent(newEvent)}</pre>`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Proceed',
        cancelButtonText: 'Cancel',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await fetch(apiCalendarSubmit, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify(newEvent),
            });
  
            if (response.ok) {
              setNewEvent({
                day: '',
                start_time: '',
                end_time: '',
                user_role: 'doctor'
              });
  
              setErrorMessage('');
              const [formattedDate, formattedStartTime, formattedCloseTime] = formatEvent(newEvent).split('\n');
  
              Swal.fire('Success', `Availability on ${formattedDate} from ${formattedStartTime} to ${formattedCloseTime} has been set successfully.`, 'success');
              await getDoctorCalendar();

              setEvents((prevEvents) => [...prevEvents, newEvent]);
            } else {
              throw new Error('Failed to save event');
            }
          } catch (error) {
            console.error('Error saving event:', error);
            Swal.fire('Error', 'Error saving the event to the backend.', 'error');
            setErrorMessage('Error saving the event to the backend.');
          }
        } else {
          Swal.fire('Cancelled', 'Submission has been cancelled.', 'error');
        }
      });
    }
  };
 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };
  
const isPastDate = (day) => {
  return isBefore(day, today);
};

const addMinutes = (date, minutes) => {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
};
 
const getSelectableTimes = (isEndTime = false) => {
  const selectableTimes = [];
  const timeOptions = [];
  
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      timeOptions.push(time);
    }
  }

  if (newEvent.day) {
    const selectedDate = parseISO(newEvent.day);
    const isToday = isSameDay(selectedDate, today);

    timeOptions.forEach((time) => {
      const timeDate = new Date(selectedDate);
      const [hours, minutes] = time.split(':');
      timeDate.setHours(hours);
      timeDate.setMinutes(minutes);

      if (isToday) {
        if (isAfter(timeDate, today)) {
          selectableTimes.push(time);
        }
      } else {
        selectableTimes.push(time);
      }
    });
  }

  if (isEndTime && newEvent.start_time) {
    const startTimeDate = new Date();
    const [startHours, startMinutes] = newEvent.start_time.split(':');
    startTimeDate.setHours(startHours);
    startTimeDate.setMinutes(startMinutes);

    return selectableTimes.filter(time => {
      const [hours, minutes] = time.split(':');
      const timeDate = new Date();
      timeDate.setHours(hours);
      timeDate.setMinutes(minutes);
      return isAfter(timeDate, startTimeDate);
    });
  }

  const existingEvents = events.filter(event => event.day === newEvent.day);
  const conflictingTimes = existingEvents.flatMap(event => {
    const times = [];
    let currentTime = event.start_time;

    while (isBefore(parseISO(currentTime), parseISO(event.end_time))) {
      times.push(currentTime);
      currentTime = addMinutes(parseISO(currentTime), 15).toISOString().substr(11, 5);
    }
    return times;
  });

  return selectableTimes.filter(time => !conflictingTimes.includes(time));
};




const getDoctorCalendarEvent = useCallback(async () => {
  try {
    const response = await axios.get(apiCalendarSubmit);
    if (response.status === 200) {
      const eventsData = response.data;
      setModalEvents(eventsData);
      setErrorMessage(''); 
    } else {
      throw new Error("Failed to fetch doctor's calendar from the API");
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    setErrorMessage("");
  }
}, [apiCalendarSubmit]);


useEffect(() => {
  getDoctorCalendarEvent();
}, [getDoctorCalendarEvent]);



const generateCalendarDays = () => {
  let days = [];
  let currentDay = startDate;

  while (currentDay <= endDate) {
    days.push(currentDay);
    currentDay = addDays(currentDay, 1);
  }

  return days;
};

const isEventDay = (day) => {
  return eventDays.some((eventDay) =>
    isSameDay(new Date(eventDay), new Date(day))
  );
};


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBarMenu isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} menuItems={DOCTORSIDEBARMENU} />

      {/* Main Content */}
      <div className={`flex-1 ml-${isSidebarOpen ? '64' : '0 sm:ml-20'} transition-all duration-300`}>
        {/* Topbar */}
        <DoctorsHeader />


        {/* Dashboard Content */}
        <main className="p-4 sm:p-6 bg-gray-100 flex-grow">
          <div className="flex flex-col lg:flex-row justify-between gap-4 mt-4 sm:mt-0">
            {/* Left Section */}
            <div className="w-full lg:w-8/12 space-y-4">
              <div className="shadow-xl rounded-xl p-4 bg-white">
                <div className="flex  flex-row items-center justify-between space-y-4 md:space-y-0 md:py-8 md:px-3">
                  {/* Text Section */}
                  <div className="w-full  flex flex-col items-center text-center">
  <h2 className="text-md md:text-2xl font-semibold text-gray-800 mb-2">
    Set your Availability <span className='hidden md:inline'>for your e-patients to see</span>
  </h2>
  <button
    className="mt-2 px-6 py-2 bg-secondary text-white rounded-lg hover:bg-primary md:mt-3"
    onClick={() => setIsModalOpen(true)}
  >
    Set Now
  </button>
</div>

                   {/* Modal for creating a new schedule */}
        {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Create Availability
      </h2>

      {/* Form starts here */}
      <form onSubmit={submitEvent}>
        {/* Day Input */}
        {errorMessage && <div className="text-red-500 text-center whitespace-nowrap overflow-hidden overflow-ellipsis">{errorMessage}</div>}

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Date</span>
          <input
            type="date"
            name="day"
            // min={format(today, 'yyyy-MM-dd')}
            min={today.toISOString().split('T')[0]}

            value={newEvent.day}
            onChange={handleInputChange}
            className="mt-1 border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            
          />
        </label>

        {/* Start Time Input */}
        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Start Time</span>
          <div className="relative">
            <i className="fas fa-clock absolute left-3 top-3 text-gray-400 pointer-events-none"></i>
            <select 
              name="start_time" 
              value={newEvent.start_time} 
              onChange={handleInputChange}  
              className="border border-gray-300 rounded-lg p-3 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              
            >
              <option value="">Select Start Time</option>
              {getSelectableTimes().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </label>

        {/* End Time Input */}
        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">End Time</span>
          <div className="relative">
            <i className="fas fa-clock absolute left-3 top-3 text-gray-400 pointer-events-none"></i>
            <select 
              name="end_time" 
              value={newEvent.end_time} 
              onChange={handleInputChange} 
              className="border border-gray-300 rounded-lg p-3 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              
            >
              <option value="">Select End Time</option>
              {getSelectableTimes(true).map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </label>

{/* table  */}

            
           

{/*  */}
        {/* Action buttons */}
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg mr-3 hover:bg-gray-300 transition duration-200"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-primary transition duration-200"
          >
            Submit
          </button>
        </div>
      </form>
      
      {/* Form ends here */}
    </div>
  </div>
)}

                  {/* Image Section */}
                  <div className=" w-2/4 md:w-1/4">
                    {/* <img
                      src={bannerimg}
                      alt="Banner"
                      className="w-full h-auto rounded-lg"
                    /> */}
                    <FaUserDoctor  className= "text-primary -mt-4 text-[80px] rounded-lg"/>

                  </div>
                </div>
              </div>

              {/* Calendar Section */}
              <div className="space-y-4">
               

              
  {/* Event Table */}

 <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="font-bold text-gray-800 mb-4 capitalize text-lg ">  <span>Dr.</span> {userData?.data?.fullname 
    ? userData?.data?.fullname.split(' ').length > 1 
      ?userData?.data?.fullname.split(' ')[0].trim()  
      :userData?.data?.fullname 
    : ""}  availabilty table  </h2>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : modalEvents.length === 0 ? (
        <p className="text-gray-500">No events scheduled.</p>
      ) : (
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 font-bold">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Start Time</th>
              <th className="px-4 py-2">End Time</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {modalEvents.map((event, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-3 text-md text-gray-500">
                  {new Date(`${event.day} ${event.start_time}`).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}{" "}
                 
                </td>
                <td className="px-4 py-2 text-md text-gray-600"> {new Date(`${event.day} ${event.start_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td className="px-4 py-2 text-md text-gray-600"> {new Date(`${event.day} ${event.end_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td>
                  <button
                    type="button"
                    className="text-red-600 hover:underline"
                    onClick={() =>  deleteModalEvent(
                      event.id,
                      index,
                      `${new Date(event.day).getDate()}${getOrdinalSuffix(
                        new Date(event.day).getDate()
                      )} ${new Date(event.day).toLocaleString("default", {
                        month: "long",
                      })} ${new Date(event.day).getFullYear()}`,
                      formatTime(event.start_time),
                      formatTime(event.end_time)
                    )
                  }
                  >
                    <MdDelete size={20}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="w-full lg:w-4/12 space-y-4 ">
           
           
               {/* Calendar Header */}
               <div className="hidden md:flex justify-between items-center bg-white p-3 rounded-lg shadow-md border-b-2 border-gray-300">
               
               <div className="flex-grow flex flex-col">
<header className="flex justify-between items-center bg-white shadow-md p-4">
<h1 className="font-bold text-gray-800">Calendar</h1>
 <div className="flex justify-between items-center space-x-4 sm:space-x-0 sm:space-y-4 relative">
   
   <button
     onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
     className="bg-gray-200 p-2 mx-2 rounded-lg primary-color sm:mt-4 z-10"
     style={{ zIndex: 10 }}  
   >
     <FaChevronCircleLeft />
   </button>
   
   <h1 className="text-xl font-bold flex mr-4 sm:block">
     <span className="primary-color">{format(currentMonth, 'MMMM')} </span>
     <span className="font-semibold mr-2 px-2">{format(currentMonth, 'yyyy')}</span>
   </h1>
   
   <button
     onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
     className="bg-gray-200 p-2 rounded-lg mx-2 primary-color z-10"
     style={{ zIndex: 10 }} 
   >
     <FaChevronCircleRight />
   </button>
 </div>
      
     </header>

     {/* Calendar */}
     <main className="flex-grow p-6 bg-gray-100">
       <div className="text-gray-500 text-right mb-4 hidden sm:block">Eastern Time - US & Canada</div>
      
       <div className="grid grid-cols-7 gap-4 text-center text-gray-500 font-medium mb-4">
         {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
           <div key={day}>{day}</div>
         ))}
       </div>

       <div className="grid grid-cols-7 gap-1 sm:gap-2">
{generateCalendarDays().map((day, index) => (
 <div 
   key={index} 
   className={`p-1 sm:p-2 rounded-lg shadow-md text-center border-2 
     ${isEventDay(day) ? 'bg-secondary text-white' : 'bg-white'}`}
 >
   <div className={`text-xl font-semibold mb-2 ${isPastDate(day) ? 'text-gray-500' : ''}`}>
     {format(day, 'd')}
   </div>
   <div className="space-y-1"></div>
 </div>
))}
</div>

     </main>

     {/* Modal for creating a new schedule */}
     {isModalOpen && (
<div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
 <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
   <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
     Create Availability
   </h2>

   {/* Form starts here */}
   <form onSubmit={submitEvent}>
     {/* Date Input */}
     {errorMessage && <div className="text-red-500 text-center whitespace-nowrap overflow-hidden overflow-ellipsis">{errorMessage}</div>}

     <label className="block mb-4">
       <span className="text-sm font-medium text-gray-700">Date</span>
       <input
         type="date"
         name="day"
         // min={format(today, 'yyyy-MM-dd')}
         min={today.toISOString().split('T')[0]}

         value={newEvent.day}
         onChange={handleInputChange}
         className="mt-1 border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
         
       />
     </label>

     {/* Start Time Input */}
     <label className="block mb-4">
       <span className="text-sm font-medium text-gray-700">Start Time</span>
       <div className="relative">
         <i className="fas fa-clock absolute left-3 top-3 text-gray-400 pointer-events-none"></i>
         <select 
           name="start_time" 
           value={newEvent.start_time} 
           onChange={handleInputChange}  
           className="border border-gray-300 rounded-lg p-3 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
           
         >
           <option value="">Select Start Time</option>
           {getSelectableTimes().map((time) => (
             <option key={time} value={time}>
               {time}
             </option>
           ))}
         </select>
       </div>
     </label>

     {/* End Time Input */}
     <label className="block mb-4">
       <span className="text-sm font-medium text-gray-700">End Time</span>
       <div className="relative">
         <i className="fas fa-clock absolute left-3 top-3 text-gray-400 pointer-events-none"></i>
         <select 
           name="end_time" 
           value={newEvent.end_time} 
           onChange={handleInputChange} 
           className="border border-gray-300 rounded-lg p-3 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
           
         >
           <option value="">Select End Time</option>
           {getSelectableTimes(true).map((time) => (
             <option key={time} value={time}>
               {time}
             </option>
           ))}
         </select>
       </div>
     </label>


         
       

{/*  */}
     {/* Action buttons */}
     <div className="flex justify-end mt-6">
       <button
         type="button"
         onClick={() => setIsModalOpen(false)}
         className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg mr-3 hover:bg-gray-300 transition duration-200"
       >
         Cancel
       </button>
       
       <button
         type="submit"
         className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-primary transition duration-200"
       >
         Submit
       </button>
     </div>
   </form>
   
   {/* Form ends here */}
 </div>
</div>
)}


   </div>

             </div>
            
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Calendar;
