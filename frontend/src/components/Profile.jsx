import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen, Bookmark, Download, Briefcase } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useNavigate } from "react-router-dom";
import { unsaveJob, setSavedJobs } from "@/redux/jobSlice";
import { Input } from "./ui/input";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import useGetSavedJobs from "@/hooks/useGetSavedJobs";

function Profile() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { savedJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useGetAppliedJobs();
  useGetSavedJobs();

  const skills = user?.profile?.skills || [];
  const hasResume = !!user?.profile?.resume;

  useEffect(() => {
    const refreshUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${USER_API_END_POINT}/profile`, {
          withCredentials: true,
        });

        if (response.data.success && response.data.user) {
          dispatch(setUser(response.data.user));
        }
      } catch (error) {
        console.error("Failed to refresh user data:", error);
      } finally {
        setLoading(false);
      }
    };

    refreshUserData();
  }, [dispatch]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await axios.get(`${USER_API_END_POINT}/saved-jobs`, {
          withCredentials: true,
        });
        if (response.data.success) {
          dispatch(setSavedJobs(response.data.jobs));
        }
      } catch (error) {
        console.error("Failed to fetch saved jobs:", error);
      }
    };

    fetchSavedJobs();
  }, [dispatch]);

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      toast.info("Uploading profile photo...");

      const response = await axios.post(
        `${USER_API_END_POINT}/profile/photo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        dispatch(setUser(response.data.user));
        toast.success("Profile photo updated successfully");
      }
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      toast.error(error.response?.data?.message || "Failed to upload profile photo");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      const response = await axios.delete(`${USER_API_END_POINT}/save-job/${jobId}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        dispatch(unsaveJob(jobId));
        toast.success("Job removed from saved jobs");
      }
    } catch (error) {
      console.error("Error unsaving job:", error);
      toast.error(error.response?.data?.message || "Failed to remove job from saved jobs");
    }
  };

  const handleViewJob = (jobId) => {
    navigate(`/job/description/${jobId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-4">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 relative shadow-sm">
          <Button
            className="absolute top-4 right-4 p-2 hover:bg-[#5b3086] rounded-full bg-[#6A38C2] text-white"
            variant="ghost"
            title="Edit Profile"
            onClick={() => setOpen(true)}
          >
            <Pen className="w-5 h-5" strokeWidth={2.5} />
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="h-24 w-24 ring-4 ring-[#6A38C2]/20">
                  <AvatarImage
                    src={user?.profile?.profilePhoto}
                    alt={user?.fullname?.charAt(0) || "U"}
                  />
                  <AvatarFallback className="bg-[#6A38C2] text-white text-2xl font-semibold">
                    {user?.fullname?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="profile-photo"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Pen className="w-6 h-6 text-white" />
                </label>
                <input
                  type="file"
                  id="profile-photo"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {user?.fullname || "User Name"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {user?.profile?.bio || "No bio provided yet"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">{user?.email || "No email provided"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Contact className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">{user?.phoneNumber || "No phone number provided"}</span>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-[#6A38C2] text-white px-3 py-1 text-sm font-medium rounded-full"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-gray-500 italic">No skills added</span>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resume</h2>
            {hasResume ? (
              <a
                href={`${USER_API_END_POINT}/resume/${user?._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#6A38C2] hover:text-[#5b30a6] transition-colors"
                download={user?.profile?.resumeOriginalName || "resume.pdf"}
              >
                <Download className="w-5 h-5" />
                {user?.profile?.resumeOriginalName || "Download Resume"}
              </a>
            ) : (
              <span className="text-gray-500 italic">Not Available</span>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
          <Tabs defaultValue="applied" className="w-full">
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="applied" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Applied Jobs
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                Saved Jobs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="applied" className="mt-6">
              <AppliedJobTable />
            </TabsContent>

            <TabsContent value="saved" className="mt-6">
              {!savedJobs || savedJobs.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs yet</h3>
                  <p className="text-gray-500 mb-6">Save jobs you're interested in to apply later</p>
                  <Button 
                    onClick={() => navigate("/jobs")}
                    className="bg-[#6A38C2] hover:bg-[#5b30a6] transition-colors"
                  >
                    Browse Jobs
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {savedJobs.map((job) => (
                    <div
                      key={job._id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#6A38C2] transition-colors"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">{job.title}</h3>
                        <p className="text-gray-500">{job.company?.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleViewJob(job._id)}
                          className="hover:bg-gray-100"
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleUnsaveJob(job._id)}
                          className="text-red-500 hover:bg-red-50"
                        >
                          Unsave
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
}

export default Profile;
