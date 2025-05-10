import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './shared/Navbar';
import { Button } from './ui/button';
import { ArrowLeft, Globe, MapPin, Mail, Phone } from 'lucide-react';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';

const CompanyProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await axios.get(`${COMPANY_API_END_POINT}/get/${id}`, {
                    withCredentials: true
                });

                if (response.data.success) {
                    setCompany(response.data.company);
                }
            } catch (error) {
                console.error('Error fetching company:', error);
                toast.error('Failed to load company profile');
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, [id]);

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

    if (!company) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-4xl mx-auto p-4">
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold text-gray-900">Company not found</h2>
                        <Button
                            onClick={() => navigate(-1)}
                            className="mt-4"
                            variant="outline"
                        >
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Button
                    onClick={() => navigate(-1)}
                    variant="outline"
                    className="mb-6 flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-start gap-6">
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                            {company.logo && company.logo !== "https://res.cloudinary.com/dqgvjqjqj/image/upload/v1710000000/default-company-logo.png" ? (
                                <img
                                    src={company.logo}
                                    alt={company.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#6A38C2] text-white text-2xl font-semibold">
                                    {company.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                            <p className="text-gray-600 mt-1">{company.description}</p>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Globe className="w-5 h-5 text-gray-500" />
                                <a
                                    href={
                                        company.website?.trim().startsWith('http')
                                            ? company.website.trim()
                                            : `https://${company.website?.trim()}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#6A38C2] hover:underline"
                                >
                                    {company.website?.trim() || 'No website provided'}
                                </a>

                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-gray-500" />
                                <span className="text-gray-700">{company.location || 'No location provided'}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900">Contact Information</h3>
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-gray-500" />
                                <span className="text-gray-700">{company.contact?.email || 'No email provided'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-gray-500" />
                                <span className="text-gray-700">{company.contact?.phone || 'No phone provided'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfile; 