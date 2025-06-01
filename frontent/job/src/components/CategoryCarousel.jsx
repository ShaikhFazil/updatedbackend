import React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";

const category = [
    "FRONTEND DEVELOPER",
    "BACKEND DEVELOPER",
    "REACT JS",
    "NEXT JS",
    "FULL STACK WEB DEVELOPER",
    "MERN STACK DEVELOPER",
];


const CategoryCarousel = () => {


    const disaptch = useDispatch()

    const navigate = useNavigate()

    const searchJobHandler = (query) =>{
        disaptch(setSearchedQuery(query))
        navigate('/browse')
        }
    return (
        <div className="w-full max-w-3xl mx-auto my-20">
            <Carousel>
                {/* Fix: Ensure full width */}
                <CarouselContent className="w-full flex gap-4">
                    {category.map((cat, index) => (
                        <CarouselItem
                            key={index}
                            className="min-w-[200px] md:min-w-[250px] flex justify-center"
                        >
                            <Button variant="outline" onClick={()=>searchJobHandler(cat)} className="rounded-full px-6">
                                {cat}
                            </Button>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
};

export default CategoryCarousel;
