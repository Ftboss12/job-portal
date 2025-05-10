import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experienceLevel: "",
        position: 0,
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);

    const changeEventHandler = (e) => {
        const newValue = e.target.value;
        console.log(`Changing ${e.target.name} to:`, newValue);
        setInput(prev => {
            const updated = { ...prev, [e.target.name]: newValue };
            console.log("Updated input state:", updated);
            return updated;
        });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value.toLowerCase());
        if (selectedCompany) {
            console.log("Selected company:", selectedCompany);
            setInput({ ...input, companyId: selectedCompany._id });
        }
    };

    const validateForm = () => {
        console.log("Validating form with input:", input);
        if (!input.title) {
            toast.error("Please enter a job title");
            return false;
        }
        if (!input.description) {
            toast.error("Please enter a job description");
            return false;
        }
        if (!input.requirements) {
            toast.error("Please enter job requirements");
            return false;
        }
        if (!input.salary) {
            toast.error("Please enter a salary range");
            return false;
        }
        if (!input.location) {
            toast.error("Please enter a job location");
            return false;
        }
        if (!input.jobType) {
            toast.error("Please enter a job type");
            return false;
        }
        if (!input.experienceLevel || isNaN(input.experienceLevel) || Number(input.experienceLevel) < 0) {
            console.log("Experience level validation failed. Current value:", input.experienceLevel);
            toast.error("Please enter a valid experience level (in years)");
            return false;
        }
        if (!input.position || input.position < 1) {
            toast.error("Please enter a valid number of positions");
            return false;
        }
        if (!input.companyId) {
            toast.error("Please select a company");
            return false;
        }
        return true;
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        console.log("Form submission started. Current input state:", input);
        
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            
            // Create a new object with numeric conversions
            const formData = {
                title: input.title,
                description: input.description,
                requirements: input.requirements,
                salary: Number(input.salary) || 0,
                location: input.location,
                jobType: input.jobType,
                experienceLevel: Number(input.experienceLevel) || 0,
                position: Number(input.position) || 1,
                companyId: input.companyId
            };
            
            console.log("Sending job data to backend:", formData);
            
            const res = await axios.post(`${JOB_API_END_POINT}/post`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            } else {
                toast.error(res.data.message || "Failed to create job");
            }
        } catch (error) {
            console.error("Error creating job:", error);
            console.error("Response data:", error.response?.data);
            console.error("Request data that was sent:", error.config?.data);
            toast.error(error.response?.data?.message || "Failed to create job. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className='max-w-4xl mx-auto px-4 py-8'>
                <form onSubmit={submitHandler} className='bg-white p-8 border border-gray-200 shadow-sm rounded-lg'>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-6">Post a New Job</h1>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                placeholder="e.g. Senior Software Engineer"
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                required
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                placeholder="Brief job description"
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                required
                            />
                        </div>
                        <div>
                            <Label>Requirements</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                placeholder="Required skills and qualifications"
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                required
                            />
                        </div>
                        <div>
                            <Label>Salary</Label>
                            <Input
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                placeholder="e.g. 50,000 - 70,000"
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                required
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                placeholder="Job location"
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                required
                            />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Input
                                type="text"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                                placeholder="e.g. Full-time, Part-time"
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                required
                            />
                        </div>
                        <div>
                            <Label>Experience Level (in years)</Label>
                            <Input
                                type="number"
                                name="experienceLevel"
                                value={input.experienceLevel}
                                onChange={changeEventHandler}
                                placeholder="e.g. 2"
                                min="0"
                                step="0.5"
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                required
                            />
                        </div>
                        <div>
                            <Label>Number of Positions</Label>
                            <Input
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                min="1"
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                required
                            />
                        </div>
                        <div>
                            <Label>Company</Label>
                            {companies.length > 0 ? (
                                <Select onValueChange={selectChangeHandler} required>
                                    <SelectTrigger className="w-full my-1">
                                        <SelectValue placeholder="Select a Company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {companies.map((company) => (
                                                <SelectItem 
                                                    key={company._id} 
                                                    value={company.name.toLowerCase()}
                                                >
                                                    {company.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <p className='text-sm text-red-600 mt-1'>
                                    *Please register a company first
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mt-6">
                        {loading ? (
                            <Button className="w-full" disabled>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please wait
                            </Button>
                        ) : (
                            <Button 
                                type="submit" 
                                className="w-full bg-[#6A38C2] hover:bg-[#5b30a6] transition-colors"
                                disabled={companies.length === 0}
                            >
                                Post New Job
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PostJob