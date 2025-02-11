import { useEffect, useRef, useState } from "react";
// import { getUserData } from "./Helper";
import {
  VERSION,
  createClient,
  createCameraVideoTrack,
  createMicrophoneAudioTrack,
  onCameraChanged,
  onMicrophoneChanged,
} from "agora-rtc-sdk-ng/esm";
import PropTypes from "prop-types";
import {  FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { IoIosLock } from "react-icons/io";
import { PiPhoneDisconnectFill } from "react-icons/pi";
import { MdOutlineAttachFile } from "react-icons/md";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import Swal from "sweetalert2";
import { APIURLS } from "./Constants";

console.log("Current SDK VERSION: ", VERSION);

onCameraChanged((device) => {
  console.log("onCameraChanged: ", device);
});
onMicrophoneChanged((device) => {
  console.log("onMicrophoneChanged: ", device);
});

const client = createClient({
  mode: "rtc",
  codec: "vp8",
});

let audioTrack;
let videoTrack;

const VideoCall = ({ img, name }) => {
    // const [isFileActive,setIsFileActive]=useState(true)
    const APIVIDEOCALLFILEUPLOAD= APIURLS.APIVIDEOCALLFILEUPLOAD;
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
const [devices, setDevices] = useState([]);
const fileInputRef = useRef(null);

//   const[ringing,setRinging]=useState(false);
  const [isAudioPubed, setIsAudioPubed] = useState(false);
  const [isVideoPubed, setIsVideoPubed] = useState(false);
  const [isVideoSubed, setIsVideoSubed] = useState(false);
  const [isJoined, setIsJoined] = useState(true);

  const channel = useRef("");
  const appid = useRef("6ab147544dd64f19ba3414be8453c01e");
  const token = useRef("");



  const toggleCall = () => {
    setTimeout(() => {
      window.location.reload(); 
    }, 1000);
  };
  
  const turnOnCamera = async (flag = !isVideoOn) => {
    setIsVideoOn(flag);
    if (videoTrack) {
      return videoTrack.setEnabled(flag);
    }
    const videoConfig = {
      encoderConfig: {
        width: 1280,    
        height: 720,  
        frameRate: 30, 
      },
    };

    videoTrack = await createCameraVideoTrack(videoConfig);
    videoTrack.play("camera-video");
  };

  useEffect(() => {
    if (isVideoOn) {
      turnOnCamera(true);
    }
    return () => {
      if (videoTrack) {
        videoTrack.setEnabled(false);  
      }
    };
  }, []);
  const turnOnMicrophone = async (flag = !isAudioOn) => {
    setIsAudioOn(flag);
    if (audioTrack) {
      return audioTrack.setEnabled(flag);
    }
    audioTrack = await createMicrophoneAudioTrack();
  };

  const joinChannel = async () => {
    if (!channel.current) channel.current = "react-room";
    if (isJoined) await leaveChannel();

    client.on("user-published", onUserPublish);

    await client.join(appid.current, channel.current, token.current || null, null);
    setIsJoined(true);
  };

  const leaveChannel = async () => {
    setIsJoined(false);
    setIsAudioPubed(false);
    setIsVideoPubed(false);
    await client.leave();
  };

  const onUserPublish = async (user, mediaType) => {
    if (mediaType === "video") {
      const remoteTrack = await client.subscribe(user, mediaType);
      remoteTrack.play("remote-video");
      setIsVideoSubed(true);
    }
    if (mediaType === "audio") {
      const remoteTrack = await client.subscribe(user, mediaType);
      remoteTrack.play();
    }
  };

  const publishVideo = async () => {
    await turnOnCamera(true);
    if (!isJoined) await joinChannel();
    await client.publish(videoTrack);
    setIsVideoPubed(true);
  };

  const publishAudio = async () => {
    await turnOnMicrophone(true);
    if (!isJoined) await joinChannel();
    await client.publish(audioTrack);
    setIsAudioPubed(true);
  };


 

  const handleSpeakerToggle = async () => {
    if (!devices.length) {
      const availableDevices = await navigator.mediaDevices.enumerateDevices();
      setDevices(availableDevices.filter((device) => device.kind === "audiooutput"));
    } else {
      setIsSpeakerOn(!isSpeakerOn);
      // Logic to switch audio output (requires WebRTC/Audio API)
      // Example: Use `setSinkId` for changing output to a specific device
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setSelectedFile(file);
  };

  const handleIconClick = () => {
    fileInputRef.current.click(); // Trigger file input click
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Error: User not logged in');
      Swal.fire('Error', 'User not logged in', 'error');
      return;
    }
    console.log('Retrieved Token in file upload:', token);

    if (!selectedFile) {
      console.log('Error: No file selected');
      Swal.fire('Error', 'No file selected', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile); // Append the selected file

    try {
      const response = await fetch(APIVIDEOCALLFILEUPLOAD, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData, // Send the file as FormData
      });

      if (response.ok) {
        const data = await response.json();
        console.log('File uploaded successfully:', data);
        Swal.fire('Success', 'File uploaded successfully', 'success');
      } else {
        console.log('Error uploading file:', response.statusText);
        Swal.fire('Error', 'File upload failed', 'error');
      }
    } catch (error) {
      console.error('Error during file upload:', error);
      Swal.fire('Error', 'An error occurred while uploading the file', 'error');
    }
  };

  return (
    <div
    className="fixed inset-0 bg-gray-800 bg-opacity-95 flex-col overflow-y-auto flex bg-cover bg-center"
   
  >
  
      <div className="flex flex-wrap bg-gray-50 p-6 rounded-lg shadow-lg w-[95%] mx-auto my-auto max-w-full h-[96%] flex-col"  style={{ backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYpr93u5EfmWuLuCa8ISsBP1HtNcvqMh5rEQ&s')" }}>

      <div className="flex justify-between items-center w-full text-gray-400">
  <p className="flex items-center space-x-2 mx-auto">
    <IoIosLock />
    <span className="text-xs ">End-to-end encrypted</span>
  </p>
</div>


       {/* when other paerson has not picked but there is calling and ringing */}
       {isVideoOn && !isVideoSubed && !isJoined && (
  <div>
    <div className="w-full p-4 flex flex-col items-center">
      <img src={img} alt={name} className="rounded-full w-24 h-24" />
      <h3 className="mt-2 text-xl font-bold text-gray-300">{name}</h3>
      <p className="text-gray-400 ">Calling...</p>
    </div>
    <div className="items-center flex justify-center mx-auto mt-9">
      <video id="camera-video" className="w-[420px] mx-auto rounded-xl" hidden={!isVideoOn}></video>
    </div>
    <div className="items-center flex justify-center mx-auto mt-9 bg-black bg-opacity-50 rounded-2xl p-5 space-x-7 w-4/12">
      <MdOutlineAttachFile size={35} className={`rounded-full p-2 bg-gray-700 text-white cursor-pointer `} />
      <div className={`rounded-full p-2 cursor-pointer ${isAudioOn ? "bg-gray-700 text-white" : "bg-white text-black "}`} onClick={() => setIsAudioOn(!isAudioOn)}>
        {isAudioOn ? <FaMicrophoneSlash size={19} /> : <FaMicrophone size={19} />}
      </div>
      <HiMiniSpeakerWave size={35} onClick={handleSpeakerToggle} className={`rounded-full p-2 ${isSpeakerOn ? " bg-gray-700 text-white" : "bg-white text-black"}`} />
      <PiPhoneDisconnectFill size={35}  onClick={toggleCall}className="cursor-pointer rounded-full p-2 text-white bg-red-500" />
    </div>
  </div>
)}

{/* For multiple remote participants */}
<div >

        {isJoined && !isVideoSubed ? (
          <div className="relative">
   
   <div className=" w-[1003px] mt-7  mx-auto">
  {/* Main Camera Video */}
  <video
    id="camera-video"
    className="w-full rounded-xl"
    hidden={!isVideoOn}
  ></video>

  {/* Remote Video (overlay) */}
  <video
    // id="remote-video"
    className={`absolute border-2 bg-black top-3 -right-3 w-[250px] h-[300px] rounded-lg shadow-lg -mt-4`}
    // hidden={isVideoSubed ? false : true}
  ></video>
</div>

    {/* toggle */}
    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-black bg-opacity-80 rounded-2xl p-5 space-x-7 w-4/12 -mt-9">
  {/* File Upload Form */}
  <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
  <input
        type="file"
        name="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange} // Submit when file is selected
      />    <MdOutlineAttachFile 
      size={35} onClick={handleIconClick}
      className="rounded-full p-2 bg-gray-700 text-white cursor-pointer" 
    />
  </form>

  {/* Audio Toggle */}
  <div
    className={`rounded-full p-2 cursor-pointer ${
      isAudioOn ? "bg-gray-700 text-white" : "bg-white text-black"
    }`}
    onClick={() => setIsAudioOn(!isAudioOn)}
  >
    {isAudioOn ? (
      <FaMicrophoneSlash size={19} />
    ) : (
      <FaMicrophone size={19} />
    )}
  </div>

  {/* Speaker Toggle */}
  <HiMiniSpeakerWave
    size={35}
    onClick={handleSpeakerToggle}
    className={`rounded-full p-2 ${
      isSpeakerOn ? "bg-gray-700 text-white" : "bg-white text-black"
    }`}
  />

  {/* End Call Button */}
  <PiPhoneDisconnectFill
    size={35}
    onClick={toggleCall}
    className="cursor-pointer rounded-full p-2 text-white bg-red-500"
  />
</div>

  </div>
        ) : <p>No user has joined</p>}
      </div>

      </div>
    </div>
  );
};
  VideoCall.propTypes={
    img: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  
};

export default VideoCall;
