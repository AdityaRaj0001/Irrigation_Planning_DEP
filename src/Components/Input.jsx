import React, { useState, useEffect } from "react";
const API_KEY = "ce04e7c7a028444281ce2a76322f3813";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { ScaleLoader } from "react-spinners";

const Input = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [Data, setData] = useState();
  const [Data2, setData2] = useState();
  const [Data3, setData3] = useState();
  const [Data4, setData4] = useState();
  const [calcDone, setcalcDone] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const response = await fetch(
      `https://api.weatherbit.io/v2.0/forecast/agweather?lat=${latitude}&lon=${longitude}&key=${API_KEY}`
    );
    const { data } = await response.json();

    const soilMoisture = [];
    const evapoTranspiration = [];
    const precipitation = [];

    for (let index = 0; index < data.length; index++) {
      const obj = data[index];
      soilMoisture.push(obj["v_soilm_100_200cm"]);
      evapoTranspiration.push(obj["evapotranspiration"]);
      precipitation.push(obj["precip"]);
    }

    const soilMoistureThreshold = 0.45;
    let cropType = "Wheat";
    let cropFactor;
    if (cropType === "Rice" || cropType === "rice") {
      cropFactor = 1.1;
    }
    if (cropType === "Wheat" || cropType === "wheat") {
      cropFactor = 1.29;
    }
    let actualEvapotranspiration = [];
    let waterRequired = [];
    let netIrrigationDemand = [];
    for (var i = 0; i < 9; i++) {
      actualEvapotranspiration[i] = evapoTranspiration[i] * cropFactor;
      waterRequired[i] = actualEvapotranspiration[i] - precipitation[i];
      if (soilMoisture[i] < soilMoistureThreshold) {
        waterRequired[i] +=
          (soilMoistureThreshold - soilMoisture[i]) *
          actualEvapotranspiration[i];
      }
      netIrrigationDemand[i] = waterRequired[i] < 0 ? 0 : waterRequired[i];
    }

    const fieldCapacity = 366.67;
    const wiltingPoint = 216.67;
    const maxStorage = 50;
    const minStorage = 0.25 * 50;
    let storage = [];
    storage[0] = maxStorage;
    let irrigationdemand = [];
    irrigationdemand[0] = maxStorage;
    const cropFactor2 = 1.2;
    let avgEvapotranspiration = 0;
    for (var i = 0; i <= 7; i++) {
      avgEvapotranspiration += evapoTranspiration[i];
    }
    avgEvapotranspiration = avgEvapotranspiration / 8;
    for (var i = 1; i <= 7; i++) {
      storage[i] = Math.min(
        maxStorage,
        storage[i - 1] +
          0.8 * precipitation[i - 1] -
          cropFactor2 * evapoTranspiration[i - 1]
      );
      if (storage[i] - minStorage < avgEvapotranspiration) {
        irrigationdemand[i] = maxStorage - storage[i];
        storage[i] = maxStorage;
      } else {
        irrigationdemand[i] = 0;
      }
    }

    setcalcDone(true);
    setLoading(false);
    // const graphContainer = document.getElementById("graph");
    // const topPos = graphContainer.offsetTop;

    // // Smoothly scroll to the top position of the graph container
    // window.scrollTo({ top: topPos, behavior: "smooth" });

    const currentDate = new Date(); // Get the current date
    const dayNumber = currentDate.getDate(); // Get the current day of the month
    const monthNumber = currentDate.getMonth(); // Get the current month number (0-indexed)
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthName = monthNames[monthNumber]; // Get the month name corresponding to the month number

    setData({
      labels: [
        `${dayNumber}th ${monthName}`,
        `${dayNumber + 1}th ${monthName}`,
        `${dayNumber + 2}th ${monthName}`,
        `${dayNumber + 3}th ${monthName}`,
        `${dayNumber + 4}th ${monthName}`,
        `${dayNumber + 5}th ${monthName}`,
        `${dayNumber + 6}th ${monthName}`,
        `${dayNumber + 7}th ${monthName}`,
      ],
      datasets: [
        {
          label: "storage (mm)",
          data: storage.map((data) => data),
        },
      ],
    });

    setData2({
      labels: [
        `${dayNumber}th ${monthName}`,
        `${dayNumber + 1}th ${monthName}`,
        `${dayNumber + 2}th ${monthName}`,
        `${dayNumber + 3}th ${monthName}`,
        `${dayNumber + 4}th ${monthName}`,
        `${dayNumber + 5}th ${monthName}`,
        `${dayNumber + 6}th ${monthName}`,
        `${dayNumber + 7}th ${monthName}`,
      ],
      datasets: [
        {
          label: "Irrigation Demand (mm)",
          data: irrigationdemand.map((data) => data),
        },
      ],
    });
    setData3({
      labels: [
        `${dayNumber}th ${monthName}`,
        `${dayNumber + 1}th ${monthName}`,
        `${dayNumber + 2}th ${monthName}`,
        `${dayNumber + 3}th ${monthName}`,
        `${dayNumber + 4}th ${monthName}`,
        `${dayNumber + 5}th ${monthName}`,
        `${dayNumber + 6}th ${monthName}`,
        `${dayNumber + 7}th ${monthName}`,
      ],
      datasets: [
        {
          label: "evapoTranspiration (mm)",
          data: evapoTranspiration.map((data) => data),
        },
      ],
    });
    setData4({
      labels: [
        `${dayNumber}th ${monthName}`,
        `${dayNumber + 1}th ${monthName}`,
        `${dayNumber + 2}th ${monthName}`,
        `${dayNumber + 3}th ${monthName}`,
        `${dayNumber + 4}th ${monthName}`,
        `${dayNumber + 5}th ${monthName}`,
        `${dayNumber + 6}th ${monthName}`,
        `${dayNumber + 7}th ${monthName}`,
      ],
      datasets: [
        {
          label: " precipitation (mm)",
          data: precipitation.map((data) => data),
        },
      ],
    });
  };

  return (
    <div className="h-auto mt-12 w-full flex items-center justify-center flex-col">
      <div className="text-green-500 w-full text-2xl">
        <marquee>
          Please allow location access for the application to work
        </marquee>
      </div>

      <div className="h-[60%] text-white w-full items-center justify-center flex flex-col">
        <p className="w-4/5 uppercase text-4xl font-bold text-center mb-12">
          Irrigation Planning
        </p>
        <div className="flex w-4/5 justify-center gap-4  h-[20%]">
          <div className="h-full w-1/3 flex flex-col">
            <label htmlFor="latitudeInput" className="text-lg font-semibold">
              Latitude:
            </label>
            <input
              id="latitudeInput"
              className="border-2 p-2 text-black font-bold border-black"
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </div>
          <div className="h-full w-1/3 flex flex-col">
            <label htmlFor="longitudeInput" className="text-lg font-semibold">
              Longitude:
            </label>
            <input
              id="longitudeInput"
              className="border-2 p-2 text-black font-bold border-black"
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="w-full h-auto mb-12 pt-12 text-center">
        {loading ? (
          <ScaleLoader
            className="cursor-pointer mt-12"
            width={8}
            height={50}
            color="#42f55d"
          />
        ) : (
          <button
            className="text-black font-bold  trackinwider text-2xl  bg-green-400 p-2 px-8 mb-4 rounded-lg"
            onClick={handleFetch}
          >
            Fetch
          </button>
        )}
      </div>

      {calcDone ? (
        <div
          id="graph"
          className="bg-white flex justify-center items-center h-auto flex-wrap gap-0"
        >
          <div className="w-1/2 flex items-center justify-center h-[30vh]">
            <Line data={Data} />
          </div>
          <div className="w-1/2 flex items-center justify-center h-[30vh]">
            <Line data={Data2} />{" "}
          </div>
          <div className="w-1/2 flex items-center justify-center h-[30vh]">
            <Line data={Data3} />
          </div>
          <div className="w-1/2 flex items-center justify-center h-[30vh]">
            <Line data={Data4} />
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Input;
