import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { saveJob } from '@/redux/jobSlice'
import { toast } from 'sonner'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'

const Job = ({ job }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { savedJobs = [] } = useSelector(store => store.job);
    const isSaved = savedJobs.some(savedJob => savedJob._id === job._id);

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }

    const handleSaveJob = async () => {
        try {
            const response = await axios.post(
                `${USER_API_END_POINT}/save-job/${job._id}`,
                {},
                { withCredentials: true }
            );
            
            if (response.data.success) {
                dispatch(saveJob(job));
                toast.success("Job saved successfully");
            }
        } catch (error) {
            console.error("Error saving job:", error);
            toast.error(error.response?.data?.message || "Failed to save job");
        }
    };

    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
                <Button variant="outline" className="rounded-full" size="icon"><Bookmark /></Button>
            </div>

            <div className='flex items-center gap-2 my-2'>
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage 
                            src={job?.company?.logo && job?.company?.logo !== "https://res.cloudinary.com/dqgvjqjqj/image/upload/v1710000000/default-company-logo.png" 
                                ? job?.company?.logo 
                                : undefined
                            } 
                        />
                        <AvatarFallback className="bg-[#6A38C2] text-white text-lg font-semibold">
                            {job?.company?.name?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
                <div>
                    <h1 
                        className='font-medium text-lg text-[#6A38C2] hover:underline cursor-pointer'
                        onClick={() => navigate(`/company/${job?.company?._id}`)}
                    >
                        {job?.company?.name}
                    </h1>
                    <p className='text-sm text-gray-500'>India</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}LPA</Badge>
            </div>
            <div className='flex items-center gap-4 mt-4'>
                <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline">Details</Button>
                <Button 
                    onClick={handleSaveJob}
                    className={`${isSaved ? 'bg-gray-600 hover:bg-gray-700' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}
                    disabled={isSaved}
                >
                    {isSaved ? 'Saved' : 'Save For Later'}
                </Button>
            </div>
        </div>
    )
}

export default Job