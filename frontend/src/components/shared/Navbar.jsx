import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { LogOut, User2, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='bg-white shadow-lg sticky top-0 z-50'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8'>
                <div>
                    <h1 className='text-2xl font-bold'>Job<span className='text-[#F83002]'>Native</span></h1>
                </div>

                {/* Mobile menu button */}
                <div className='md:hidden'>
                    <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                        {isMenuOpen ? <X className="h-6 w-6 text-gray-800" /> : <Menu className="h-6 w-6 text-gray-800" />}
                    </Button>
                </div>

                {/* Desktop menu */}
                <div className='hidden md:flex items-center gap-8'>
                    <ul className='flex font-medium items-center gap-8'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/companies" className="hover:text-[#6A38C2] transition-all">Companies</Link></li>
                                    <li><Link to="/admin/jobs" className="hover:text-[#6A38C2] transition-all">Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/" className="hover:text-[#6A38C2] transition-all">Home</Link></li>
                                    <li><Link to="/jobs" className="hover:text-[#6A38C2] transition-all">Jobs</Link></li>
                                    <li><Link to="/browse" className="hover:text-[#6A38C2] transition-all">Browse</Link></li>
                                </>
                            )
                        }
                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-4'>
                                <Link to="/login"><Button variant="outline" className="hover:bg-gray-100">Login</Button></Link>
                                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6] transition-all">Signup</Button></Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer hover:ring-2 hover:ring-[#6A38C2] transition-all">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="User Avatar" />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                                    <div className='space-y-4'>
                                        <div className='flex gap-3'>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt="User Avatar" />
                                            </Avatar>
                                            <div>
                                                <h4 className='text-lg font-semibold'>{user?.fullname}</h4>
                                                <p className='text-sm text-gray-600'>{user?.profile?.bio}</p>
                                            </div>
                                        </div>
                                        <div className='space-y-2'>
                                            {
                                                user && user.role === 'student' && (
                                                    <div className='flex items-center gap-2 text-gray-700 hover:text-[#6A38C2] cursor-pointer'>
                                                        <User2 />
                                                        <Button variant="link" className="text-sm">
                                                            <Link to="/profile">View Profile</Link>
                                                        </Button>
                                                    </div>
                                                )
                                            }
                                            <div className='flex items-center gap-2 text-gray-700 hover:text-[#6A38C2] cursor-pointer'>
                                                <LogOut />
                                                <Button onClick={logoutHandler} variant="link" className="text-sm">
                                                    Logout
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className='md:hidden bg-white border-t'>
                    <div className='px-4 py-3'>
                        <ul className='space-y-4'>
                            {
                                user && user.role === 'recruiter' ? (
                                    <>
                                        <li><Link to="/admin/companies" className="block hover:text-[#6A38C2] transition-all">Companies</Link></li>
                                        <li><Link to="/admin/jobs" className="block hover:text-[#6A38C2] transition-all">Jobs</Link></li>
                                    </>
                                ) : (
                                    <>
                                        <li><Link to="/" className="block hover:text-[#6A38C2] transition-all">Home</Link></li>
                                        <li><Link to="/jobs" className="block hover:text-[#6A38C2] transition-all">Jobs</Link></li>
                                        <li><Link to="/browse" className="block hover:text-[#6A38C2] transition-all">Browse</Link></li>
                                    </>
                                )
                            }
                        </ul>
                        {!user ? (
                            <div className='flex flex-col gap-4 pt-4'>
                                <Link to="/login"><Button variant="outline" className="w-full hover:bg-gray-100">Login</Button></Link>
                                <Link to="/signup"><Button className="w-full bg-[#6A38C2] hover:bg-[#5b30a6] transition-all">Signup</Button></Link>
                            </div>
                        ) : (
                            <div className='flex flex-col gap-4 pt-4'>
                                {user.role === 'student' && (
                                    <Link to="/profile"><Button variant="outline" className="w-full">View Profile</Button></Link>
                                )}
                                <Button onClick={logoutHandler} variant="outline" className="w-full text-red-500 hover:bg-red-50">Logout</Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar;
