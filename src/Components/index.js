let soilMoisture=[];
let evapoTranspiration=[];
let precipitaion=[];
const soilMoistureThreshold = 45;
let cropType = "";
let cropFactor;
if (cropType == "Rice" || cropType == "rice") {
  cropFactor = 1.1;
}
if (cropType == "Wheat" || cropType == "wheat") {
  cropFactor = 1.09;
}
let actualEvapotranspiration = [];
let waterRequired = [];``
let netIrrigationDemand = [];
for(var i=0;i<8;i++){
  actualEvapotranspiration[i] = evapoTranspiration[i] * cropFactor;
  waterRequired[i] = actualEvapotranspiration[i] - precipitaion[i];
  if(soilMoisture[i] < soilMoistureThreshold){
    waterRequired[i] += soilMoistureThreshold-soilMoisture[i];
  }
  netIrrigationDemand[i] = max(0,waterRequired);
}
