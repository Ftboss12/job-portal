import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux'; 

// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];

const LatestJobs = () => {
    const {allJobs} = useSelector(store=>store.job);
   
    return (
        <div className='max-w-7xl mx-auto my-20'>
            <h1 className='text-4xl font-bold'>
                <span className='text-[#4F46E5]'>Featured</span> Job Opportunities
            </h1>
            <p className='text-gray-600 mt-2 mb-8'>Explore our handpicked selection of top job openings from leading companies</p>
            <div className='grid grid-cols-3 gap-4 my-5'>
                {
                    allJobs.length <= 0 ? (
                        <div className="col-span-3 text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">No jobs available at the moment</p>
                        </div>
                    ) : (
                        allJobs?.slice(0,6).map((job) => (
                            <LatestJobCards key={job._id} job={job}/>
                        ))
                    )
                }
            </div>
        </div>
    )
}

export default LatestJobs