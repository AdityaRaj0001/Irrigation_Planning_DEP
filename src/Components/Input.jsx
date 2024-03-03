import React, { useState, useEffect } from "react";
const API_KEY = "43ae40678e104154ac9807dda3a3da82";

const Input = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    // Fetching user's location using the window object
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleFetch = async () => {
    const response= await fetch(`https://api.weatherbit.io/v2.0/forecast/agweather?lat=${latitude}&lon=${longitude}&key=${API_KEY}`)
    const {data}=await response.json()
    console.log(data);
  };

  return (
    <div className="h-[100vh] w-full">
      <div className="text-red-500 text-2xl">
        <marquee>
          Please allow location access for the application to work
        </marquee>
      </div>

      <div className="h-[60%] w-full items-center justify-center flex flex-col">
        <p className="w-4/5 uppercase text-4xl text-center mb-12">
          Irrigation Planning
        </p>
       <div className="flex w-4/5 justify-center gap-4  h-[20%]">
        <div className="h-full w-1/3 flex flex-col">
        <label htmlFor="latitudeInput" className="text-lg">
          Latitude:
        </label>
        <input
          id="latitudeInput"
          className="border-2 border-black"
          type="number"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          
        />
        </div>
        <div className="h-full w-1/3 flex flex-col">
        <label htmlFor="longitudeInput" className="text-lg">
          Longitude:
        </label>
        <input
          id="longitudeInput"
          className="border-2 border-black"
          type="number"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
        </div>
       </div>
      </div>
      <div className="w-full h-[10vh] text-center">
        <button
          className="text-black  bg-gray-300 p-2 px-8  rounded-lg"
          onClick={handleFetch}
        >
          Fetch
        </button>
      </div>
    </div>
  );
};

export default Input;
