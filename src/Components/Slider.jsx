import * as React from "react";

import { Card, CardContent } from "@/ShadCnComponents/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/ShadCnComponents/ui/carousel";
const imageArray = ["./slider1.jpg", "./slider2.jpg", "./slider3.jpg", "slider4.jpg"];


export default function Slideshow() {
  return (
    <div className="w-full  flex justify-center relative">
      <h1 className="text-7xl text-white absolute top-44 uppercase  z-20">Irrigation planning</h1>
      <Carousel className="w-[90%]
">
        <CarouselContent>
          {imageArray.map((src, index) => (
            <CarouselItem key={index}>
              <div className="p-0">
                <Card>
                  <img src={src} className="w-full object-cover object-center md:h-[70vh]" alt={`Slide ${index + 1}`} />
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious size={8} />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
