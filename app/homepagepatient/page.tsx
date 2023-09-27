"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { log } from "console";

interface Doctor {
  username: string;
  userId: string;
  price: number;
  specialist: Specialist;
  user: User;
}

interface User {
  image: string;
}

interface Specialist {
  id: string;
  title: string;
  doctors: Doctor;
  createdAt: string;
  updatedAt: string;
}

export default function HomepagePatient() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: string) => console.log(data);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);

  const URL = "http://localhost:3000/api/";

  const getDoctors = async () => {
    try {
      const response = await axios.get(URL + "doctor");
      console.log(response.data.doctors);
      setDoctors(response.data.doctors);
      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSpecialists = async () => {
    try {
      const response = await axios.get(URL + "specialist");
      console.log(response.data.specialist);

      setSpecialists(response.data.specialist);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctors();
    getSpecialists();
  }, []);

  return (
    <div className="flex w-screen justify-center">
      <div className="bg-white w-screen max-w-[425px] h-fit flex flex-col justify-center items-center px-4 py-8 overflow-y-scroll">
        {/* PROFILE */}
        <nav className="flex w-full items-center gap-4 mb-8">
          {/* PICTURE */}
          <div className="w-[70px] h-[70px] rounded-full bg-red-200"></div>
          <div>
            <p className="text-[#858585] text-[14px]">Hi, welcome back</p>
            <span className="text-black font-semibold text-[18px]">
              John Doe William
            </span>
          </div>
        </nav>

        {/* SEARCH */}
        <form onSubmit={handleSubmit(() => onSubmit)} className="w-full mb-8">
          <input
            type="search"
            placeholder="Search a doctor"
            {...register}
            className="bg-[#d9d9d9]/30 border border-[#d9d9d9] w-full h-[60px] rounded-lg px-4 outline-none hover:border-[#ff5757]"
          />
        </form>

        <section className="w-full mb-8">
          <div className="w-full flex justify-between items-center mb-2">
            <h2 className="text-[24px] text-black font-semibold">
              Specialists
            </h2>
            <a href="" className="text-[16px] text-[#858585]">
              See All
            </a>
          </div>
          {/* SPECIALISTS */}
          <div className="flex gap-4 overflow-x-scroll">
            {specialists.map((specialist, index) => (
              <button
                key={index}
                className="border border-[#ff5757] text-[#ff5757] text-[20px] font-semibold bg-none min-w-[150px] h-[80px] rounded-lg"
              >
                {specialist.title}
              </button>
            ))}
          </div>
        </section>

        <section className="w-full">
          <div className="flex justify-between items-center w-full mb-2">
            <h2 className="text-[24px] text-black font-semibold">Doctors</h2>
            <a href="" className="text-[16px] text-[#858585]">
              See All
            </a>
          </div>
          {/* DOCTOR LIST */}
          <div>
            {doctors?.map((doctor, index) => (
              <div
                key={index}
                className="flex gap-4 w-full bg-[#d9d9d9]/30 rounded-lg p-6"
              >
                {/* PICTURE */}
                <div className="w-[85px] h-[85px] rounded-full p-0 bg-white overflow-hidden">
                  <Image
                    width={85}
                    height={85}
                    src={doctor.user?.image}
                    alt=""
                  />
                </div>
                {/* INFORMATIONS */}
                <div>
                  <span className="text-[16px] font-semibold">
                    {doctor?.username}
                  </span>
                  <p className="text-[12px] text-[#858585] mb-3">
                    {doctor?.specialist.title}
                  </p>
                  <b className="text-[#ff5757]">
                    {doctor?.price.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </b>
                  {/* <button className="px-6 py-1 bg-[#ff5757] text-white rounded-full">
                    Book
                  </button> */}
                </div>
              </div>
            ))}

            {/* CARD */}
          </div>
        </section>
      </div>
    </div>
  );
}
