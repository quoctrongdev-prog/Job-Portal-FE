"use client";
import { Job } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { job_service } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Briefcase, Filter, MapPin, Search, X } from "lucide-react";
import Loading from "@/components/ui/loading";
import JobCard from "@/components/job-card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const locations: string[] = [
  "Việt Nam",
  "Thủ Đức",
  "Cần Thơ",
  "Vũng Tàu",
  "Tân Phú",
  "Tân Bình",
  "Viet Nam",
  "Thu Duc"
];

const JobsPage = () => {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  const token = Cookies.get("token");
  const ref = useRef<HTMLButtonElement>(null);

  async function fetchJob() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${job_service}/api/job/all?title=${title}&location=${location}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setJobs(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  // Thêm hàm xử lý search riêng
const handleSearch = () => {
  fetchJob();
};

const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === "Enter") {
    handleSearch();
  }
};

  useEffect(() => {
    fetchJob();
  }, [title, location]);

  const clickEvent = () => {
    ref.current?.click();
  };

  const clearFilter = () => {
    setTitle("");
    setLocation("");
    fetchJob();
    ref.current?.click();
  };

  const hasActiveFilters = title || location;
  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section  */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Explore <span className="text-red-500">Oppertunities</span>
              </h1>
              <p className="text-base opacity-70">{jobs.length} jobs</p>
            </div>

            
    {/* Cụm Search và Filter */}
<div className="flex items-center gap-2 w-full md:w-auto">
  {/* Ô Search */}
  <div className="relative flex-1 md:w-80">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" size={18} />
    <Input
      placeholder="Search job title..."
      className="pl-10 h-11 bg-white dark:bg-background border-2 "
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && fetchJob()}
    />
  </div>

  {/* Nút Filter với Dropdown xổ xuống */}
  {/* <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button 
        variant={location ? "default" : "outline"} 
        className={`gap-2 h-11 border-2 cursor-pointer ${location ? 'bg-gray-200 hover:bg-gray-400' : ''}`}
      >
        <Filter size={18} />
        <span className="hidden sm:inline">
          {location ? location : "Location"}
        </span>
        {location && <X size={14} className="ml-1 cursor-pointer" onClick={(e) => {
          e.stopPropagation();
          setLocation("");
        }} />}
      </Button>
    </DropdownMenuTrigger>
    
    <DropdownMenuContent className="w-56" align="end">
      <DropdownMenuLabel>Select Location</DropdownMenuLabel>
      <DropdownMenuSeparator />
      
      <DropdownMenuRadioGroup value={location} onValueChange={setLocation}>
        <DropdownMenuRadioItem value="" className="cursor-pointer">
          All Locations
        </DropdownMenuRadioItem>
        {locations.map((loc) => (
          <DropdownMenuRadioItem key={loc} value={loc} className="cursor-pointer">
            {loc}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu> */}
</div>
</div>

  

          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm opacity-70">Active Filters:</span>
              {title && (
                <div
                  className="flex items-center gap-2 px-3 py-1.5
                rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600
                text-sm"
                >
                  <Search size={14} />
                  {title}
                  <button
                    onClick={() => setTitle("")}
                    className="hover:bg-blue-200 dark:bg-blue-800
                  rounded-full p-0.5 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {location && (
                <div
                  className="flex items-center gap-2 px-3 py-1.5
                rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600
                text-sm"
                >
                  <MapPin size={14} />
                  {location}
                  <button
                    onClick={() => setLocation("")}
                    className="hover:bg-blue-200 dark:bg-blue-800
                  rounded-full p-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {loading ? (
            <Loading />
          ) : (
            <>
              {jobs && jobs.length > 0 ? (
                //grid column
                <div
                  className="grid grid-cols-1 md:grid-cols-2 
                    lg:grid-cols-3 gap-6 mb-8"
                >
                  {jobs.map((job) => (
                    <JobCard job={job} key={job.job_id} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 ">
                  <div
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full
                    bg-gray-100 dark:bg-gray-800 mb-4"
                  >
                    <Briefcase size={40} className="opacity-40" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Jobs found</h3>
                </div>
              )}
            </>
          )}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button ref={ref} className="hidden"></Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Filter className="text-blue-600" />
                Filter Jobs
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5 py-4">
              {/* <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium flex items-center
                          gap-2"
                >
                  <Search size={16} />
                  Search by job title
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter company name"
                  className="h-11"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div> */}

              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-sm font-medium flex items-center
                          gap-2"
                >
                  <MapPin size={16} />
                  Location
                </Label>
                <select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-11 px-3 border-2 border-gray-300 rounded-md bg-transparent focus:outline-none
                          focus:ring-2 dark:bg-black"
                >
                  <option value="">All Locations</option>
                  {locations.map((e) => (
                    <option value={e} key={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant={"outline"}
                onClick={clearFilter}
                className="flex-1 cursor-pointer"
              >
                Clear All
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default JobsPage;
