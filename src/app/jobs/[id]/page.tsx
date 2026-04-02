"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Loading from "@/components/ui/loading";
import { job_service, useAppData } from "@/context/AppContext";
import { Application, Job } from "@/types";
import axios from "axios";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle,
  CheckCircle2,
  DollarSign,
  MapPin,
  User,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Link from "next/link";

const JobPage = () => {
  const [applied, setApplied] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobApplications, setJobApplications] = useState<Application[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [value, setValue] = useState("");
  // Thay vì: const [value, setValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<{ [key: number]: string }>({});

  const { id } = useParams();
  const { user, isAuth, applyJob, applications, btnLoading } = useAppData();
  const router = useRouter();

  const applyJobHandler = (id: number) => {
    applyJob(id);
  };

  const handleStatusChange = (appId: number, status: string) => {
  setSelectedStatus(prev => ({
    ...prev,
    [appId]: status
  }));
};

  const filteredApplications =
    filterStatus === "All"
      ? jobApplications
      : jobApplications.filter((app) => app.status === filterStatus);

  const token = Cookies.get("token");

  async function fetchJobApplications() {
    try {
      const { data } = await axios.get(
        `${job_service}/api/job/application/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setJobApplications(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchSingleJob() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${job_service}/api/job/${id}`);
      setJob(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const updateApplicationHandler = async (id: number) => {
    const currentStatus = selectedStatus[id]; // Lấy status của riêng dòng này

    if (!currentStatus) return toast.error("Please select a status to update");

    try {
      const { data } = await axios.put(
        `${job_service}/api/job/application/update/${id}`,
        { status: currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(data.message);
      fetchJobApplications();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (applications && id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      applications.forEach((item: any) => {
        if (item.job_id.toString() === id) setApplied(true);
      });
    }
  }, [applications, id]);

  useEffect(() => {
    fetchSingleJob();
  }, [id]);

  useEffect(() => {
    if (user && job && user.user_id === job.posted_by_recruiter_id) {
      fetchJobApplications();
    }
  }, [user, job]);
  return (
    <div className="min-h-screen bg-secondary/30">
      {loading ? (
        <Loading />
      ) : (
        <>
          {job && (
            <div className="max-w-5xl mx-auto px-4 py-8">
              <Button
                variant={"ghost"}
                className="mb-6 gap-2 cursor-pointer"
                onClick={() => router.back()}
              >
                <ArrowRight size={18} /> Back to Jobs
              </Button>

              <Card className="overflow-hidden shadow-lg border-2 mb-6">
                <div className="bg-blue-600 p-8 border-b">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`px-3 py-1.5 rounded-full 
                            text-sm font-medium ${
                              job.is_active
                                ? "bg-green-100 dark:bg-green-900/30 dark:text-green-300 text-green-600"
                                : "bg-red-100 dark:bg-red-900/30 dark:text-red-400 text-red-600"
                            }`}
                        >
                          {job.is_active ? "Open" : "Closed"}
                        </span>
                      </div>

                      <h1
                        className="text-3xl md:text-4xl font-bold mb-4
                      text-white"
                      >
                        {job.title}
                      </h1>
                      <div
                        className="flex items-center gap-2 text-base opacity-70
                      mb-2 text-white"
                      >
                        <Building2 size={18} />
                        <span>Company Name</span>
                      </div>
                    </div>

                    {user && user.role === "jobseeker" && (
                      <div className="shrink-0">
                        {applied ? (
                          <>
                            <div
                              className="flex items-center gap-2 px-6 py-3
                                rounded-lg bg-green-100 dark:bg-gray-900/30
                                text-green-600 font-medium dark:text-green-300"
                            >
                              <CheckCircle2 size={20} /> Already Applied
                            </div>
                          </>
                        ) : (
                          <>
                            {job.is_active && (
                              <Button
                                onClick={() => applyJobHandler(job.job_id)}
                                disabled={btnLoading}
                                className="gap-2 h-12 px-8 cursor-pointer"
                              >
                                <Briefcase size={18} />{" "}
                                {btnLoading ? "Applying..." : "Easy Apply"}
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* details  */}
                <div className="p-8">
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div
                      className="flex items-center gap-3 p-4 rounded-lg border
                        bg-background"
                    >
                      <div
                        className="h-12 w-12 rounded-full bg-blue-100
                            dark:bg-blue-900/30 flex items-center justify-center
                            shrink-0"
                      >
                        <MapPin size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs opacity-70 font-medium mb-1">
                          Location
                        </p>
                        <p className="font-semibold">{job.location}</p>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-3 p-4 rounded-lg border
                        bg-background"
                    >
                      <div
                        className="h-12 w-12 rounded-full bg-blue-100
                            dark:bg-blue-900/30 flex items-center justify-center
                            shrink-0"
                      >
                        <DollarSign size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs opacity-70 font-medium mb-1">
                          Salary
                        </p>
                        <p className="font-semibold">{job.salary}</p>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-3 p-4 rounded-lg border
                        bg-background"
                    >
                      <div
                        className="h-12 w-12 rounded-full bg-blue-100
                            dark:bg-blue-900/30 flex items-center justify-center
                            shrink-0"
                      >
                        <User size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs opacity-70 font-medium mb-1">
                          Role
                        </p>
                        <p className="font-semibold">{job.role}</p>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-3 p-4 rounded-lg border
                        bg-background"
                    >
                      <div
                        className="h-12 w-12 rounded-full bg-blue-100
                            dark:bg-blue-900/30 flex items-center justify-center
                            shrink-0"
                      >
                        <Users size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs opacity-70 font-medium mb-1">
                          Openings
                        </p>
                        <p className="font-semibold">
                          {job.openings} positions
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* job descrition  */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Briefcase size={24} className="text-blue-600" />
                      Job Description
                    </h2>

                    <div className="p-6 rounded-lg bg-secondary border">
                      <p className="text-base leading-relaxed whitespare-pre-line">
                        {job.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </>
      )}

      {user && job && user.user_id === job.posted_by_recruiter_id && (
        <div className="w-[90%] md:w-2/3 container mx-auto mt-8 mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-2xl font-bold">All Applications</h2>
            <div className="flex items-center gap-2">
              <label htmlFor="filter-status" className="text-sm font-medium">
                Filter:
              </label>
              <select
                id="filter-status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-2 border-2
            border-gray-300 rounded-md bg-background"
              >
                <option value="All">All Status</option>
                <option value="Submitted">Submitted</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Show tat ca application va status */}
          {jobApplications && jobApplications.length > 0 ? (
            <>
              <div className="space-y-4">
                {filteredApplications.map((e) => (
                  <div
                    key={e.application_id}
                    className="p-4 rounded-lg border-2 bg-background"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium 
                          ${
                            e.status === "Hired"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                              : e.status === "Rejected"
                                ? "bg-red-100 dark:bg-red-900/30 text-red-600"
                                : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600"
                          }`}
                      >
                        {e.status}
                      </span>
                    </div>

                    <div className="flex gap-3 mb-3">
                      <Link
                        target="_blank"
                        href={e.resume}
                        className="text-blue-500 hover:underline text-sm"
                      >
                        View Resume
                      </Link>

                      <Link
                        target="_blank"
                        href={`/account/${e.applicant_id}`}
                        className="text-blue-500 hover:underline text-sm"
                      >
                        View Profile
                      </Link>
                    </div>

                    {/* Update Status  */}
                    <div className="flex gap-2 pt-3 border-t">
                      <select
                        value={selectedStatus[e.application_id] || ""}
                        onChange={(event) => handleStatusChange(e.application_id, event.target.value)}
                        className="flex-1 p-2 border-2 border-gray-300 rounded-md bg-background"
                      >
                        <option value="">Update Status</option>
                        {/* <option value="Submitted">Submitted</option> */}
                        <option value="Hired">Hired</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <Button
                        className="cursor-pointer"
                        disabled={btnLoading}
                        onClick={() =>
                          updateApplicationHandler(e.application_id)
                        }
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredApplications.length === 0 && (
                <p className="text-center py-8 opacity-70">
                  No application with status {filterStatus}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="text-center py-8 opacity-70">
                No application Yet.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default JobPage;
