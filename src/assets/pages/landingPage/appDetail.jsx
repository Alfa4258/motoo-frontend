import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import instance from "../../../axios";
import { PICCard } from "../../components/picCard";
import Star from "../../components/stars";
import LoadingAnimation from "../../components/loadingAnimation";

export function AppDetail() {
    const [applications, setApplications] = useState([]);
    const [picOld, setPicOld] = useState([]);
    const [picIct, setPicIct] = useState([]);
    const [picBackup, setPicBackup] = useState([]);
    const [picFirst, setPicFirst] = useState([]);
    const [picUser, setPicUser] = useState([]);
    const [review, setReview] = useState([]);
    const [topology, setTopology] = useState([]);
    const [technology, setTechnology] = useState([]);
    const { id } = useParams();
    const [loadPage, setLoadPage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [data, setData] = useState({
        review_text: '',
        reviewer_name: '',
        rating: '',
        review_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        app_id: id,
        review_id: null,
    });

    const fetchDataApplications = async () => {
        try {
            const appResponse = await instance.get(`/applications/${id}`);
            const appData = appResponse.data.data;

            setApplications(appData || []);
            setLoadPage(true);
            setPicOld(appData.old_pics || []);
            setPicIct(appData.pic_icts || []);
            setPicBackup(appData.backup_pics || []);
            setPicFirst(appData.first_pics || []);
            setPicUser(appData.pic_users || []);
            setTopology(appData.topology || []);
            setTechnology(appData.technology || []);
            setReview(appData.reviews || []);       
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    const token = localStorage.getItem("token");
    const [user, setUser] = useState([]);

    const [seeData, setSeeData] = useState(null);
    const [seeTechnician, setSeeTechnician] = useState(false);
    const [seeTechnology, setSeeTechnology] = useState(false);
    const [seeTopology, setSeeTopology] = useState(false);

    const fetchData = async () => {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await instance.get('/user')
            .then((response) => {
                setUser(response.data);
                const userRole = response.data.role;
                if (userRole === "admin" || userRole === "teknisi") {
                    setSeeData(true);
                    setSeeTechnician(true);
                    setSeeTechnology(true);
                    setSeeTopology(true);
                    setLoadPage(true);
                } else if (userRole === "reporter") {
                    setSeeData(true);
                    setSeeTechnician(true);
                    setSeeTechnology(false);
                    setSeeTopology(false);
                    setLoadPage(true);
                } else {
                    setSeeData(false);
                    setSeeTechnician(false);
                    setSeeTechnology(false);
                    setSeeTopology(false);
                }
            })
            .catch((error) => {
                console.error("Error fetching user data", error);
                setSeeData(false);
                setSeeTechnician(false);
                setSeeTechnology(false);
                setSeeTopology(false);
            });
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (!token) {
            alert("You need to log in first to submit a review.");
            window.location.href = "/login";
            setIsLoading(false);
            return;
        }

        try {
            if (data.review_id) {
                const response = await instance.put(`/reviews/${data.review_id}`, data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                console.log('Review updated successfully', response.data);
            } else {
                const response = await instance.post('/reviews', data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                console.log('Review added successfully', response.data);
            }
        } catch (error) {
            console.log('Error adding/updating review', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderStars = (rating) => {
        const totalStars = 5;
        let stars = [];
        for (let i = 1; i <= totalStars; i++) {
            stars.push(<Star key={i} color={i <= rating ? "filled" : "none"} />);
        }
        return stars;
    };

    const [selectedPicData, setSelectedPicData] = useState(null);
    const [modalTitle, setModalTitle] = useState('');

    const handleViewDetail = (data, title) => {
        setSelectedPicData(data);
        setModalTitle(title);
        document.getElementById('modal-pic').showModal();
    };

    useEffect(() => {
        fetchDataApplications();
        fetchData();
    }, []);

    return (
        <>{loadPage ? (
            <div>
                {applications && (
                    <section className="container mx-auto my-8">
                        <Link to={"/"} className="btn btn-primary btn-outline btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                            </svg>
                        </Link>
                        <div className="block md:flex md:p-4 p-2">
                            <div className="w-full md:w-4/12">
                                <div className="flex items-center justify-center">
                                    {(applications.image === null) ? (
                                        <img src="/img/sig.png" alt="Default Image" className="w-4/5 p-4" />
                                    ) : (
                                        <img src={applications.image} className="w-1/2 md:w-4/5 p-2 md:p-4" />
                                    )}
                                </div>
                            </div>
                            <div className="w-full md:w-8/12 px-4">
                                <h1 className="p-2 font-bold text-3xl">{applications.short_name}</h1>
                                <div className="p-2 flex gap-2">
                                    {(applications.status === "up") ? (
                                        <div className="badge badge-success badge-lg w-24 h-6 p-2 text-xs">UP</div>
                                    ) : applications.status === "down" ? (
                                        <div className="badge badge-error badge-lg w-24 h-6 p-2 text-xs">DOWN</div>
                                    ) : applications.status === "deleted" ? (
                                        <div className="badge badge-error badge-lg w-24 h-6 p-2 text-xs ">DELETED</div>
                                    ) : (
                                        <div className="badge badge-warning badge-lg w-24 h-6 p-2 text-xs ">MAINTENANCE</div>
                                    )}
                                    {applications.platform && <div className="badge badge-lg bg-[#fecdd3] text-primary font-bold uppercase">{applications.platform}</div>}
                                    {applications.category && <div className="badge badge-lg bg-[#d1d5db] text-neutral font-bold uppercase">{applications.category}</div>}
                                </div>
                                <div className="p-2">
                                    <h3 className="font-semibold">Descriptions</h3>
                                    <p>{applications.description}</p>
                                </div>
                                <div className="px-2 py-4 border-gray-300 border-b border-t">   
                                    <button 
                                        onClick={() => window.open(`${applications.technical_doc}`, '_blank')} 
                                        className="btn btn-secondary btn-sm"
                                    > 
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                        </svg>
                                        Technical Documents
                                    </button>
                                    <button className="btn btn-info btn-sm m-2"
                                        onClick={() => window.open(`${applications.user_doc}`, '_blank')} 
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                        </svg>
                                        User Guide
                                    </button>
                                    <button className="btn btn-outline btn-info btn-sm"
                                        onClick={() => window.open(`${applications.other_doc}`, '_blank')} 
                                    > 
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                        </svg>
                                        More Documents
                                    </button>
                                </div>
                                <div className="px-2 py-6">
                                    <Link to={"//" + applications.url_prod} target="_blank" rel="noreferrer">
                                        <div className="tooltip mr-2" data-tip={applications.url_prod}>
                                            <button className="btn btn-primary btn-md">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                                                </svg>
                                                Open Applications
                                            </button>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <div role="tablist" className="tabs tabs-lifted tabs-lg">
                                <input type="radio" name="my_tabs_2" role="tab" className="tab text-md font-bold [--tab-border-color:#e11d48] " aria-label="Information" defaultChecked />
                                <div role="tabpanel" className="tab-content bg-base-100 border-primary rounded-box p-6">
                                    {applications && (
                                        <div className="overflow-x-auto">
                                            <table className="table">
                                                <thead>
                                                    <tr className="font-bold capitalize text-md">
                                                        <th>Field</th>
                                                        <th>Value</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[[applications.short_name, "short name"],
                                                    [applications.long_name, "long name"], 
                                                    [applications.category, "category"], 
                                                    [applications.platform, "platform"], 
                                                    [applications.group_area?.short_name || 'Group Area not available', "Group Area"], 
                                                    [applications.tier, "Tier"], 
                                                    [applications.business_process, "business"],
                                                    [applications.user_login, "User Login"],
                                                    [applications.db_connection_path, "DB Connect"], 
                                                    [applications.sap_connection_path, "SAP Connect"]].map((el) => (
                                                        (el[0] && (
                                                            <tr key={el}>
                                                                <td className="font-semibold capitalize">
                                                                    {el[1]}
                                                                </td>
                                                                <td >
                                                                    {el[0]}
                                                                </td>
                                                            </tr>))
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                <input type="radio" name="my_tabs_2" role="tab" className="tab text-md font-semibold [--tab-border-color:#e11d48]" aria-label="Reviews" />
                                <div role="tabpanel" className="tab-content bg-base-100 border-primary rounded-box p-6">
                                    <div className="block md:flex gap-4">
                                        <div className="block w-full lg:w-4/12 ">
                                            <div className="bg-base-100 py-6 shadow-xl mb-4">
                                                <div className="flex items-center p-4 gap-4">
                                                    <div>
                                                        <span className="font-bold text-2xl">{applications.total_rating}</span>
                                                        <span className="text-md"> / 5.0 </span>
                                                    </div>
                                                    <div className="rating rating-md">
                                                        <input type="radio" name={"ratingTotal"} value={1} className="mask mask-star-2 bg-orange-400" />
                                                        <input type="radio" name={"ratingTotal"} value={2} className="mask mask-star-2 bg-orange-400" />
                                                        <input type="radio" name={"ratingTotal"} value={3} className="mask mask-star-2 bg-orange-400" />
                                                        <input type="radio" name={"ratingTotal"} value={4} className="mask mask-star-2 bg-orange-400" />
                                                        <input type="radio" name={"ratingTotal"} value={5} className="mask mask-star-2 bg-orange-400" />
                                                    </div>
                                                    <div className=""> ({applications.total_review} reviews) </div>
                                                </div>
                                                <div className="flex items-center gap-2 px-4">
                                                    <div className="rating rating-4">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <progress className="progress progress-primary w-full" value="100" max="100"></progress>
                                                    <div className="text-sm">(32)</div>
                                                </div>
                                                <div className="flex items-center gap-2 px-4">
                                                    <div className="rating rating-4">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <progress className="progress progress-primary w-full" value="0" max="100"></progress>
                                                    <div className="text-sm">(0)</div>
                                                </div>
                                                <div className="flex items-center gap-2 px-4">
                                                    <div className="rating rating-3">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                        </svg>
                                                    </div>
                                                    <progress className="progress progress-primary w-full" value="0" max="100"></progress>
                                                    <div className="text-sm">(0)</div>
                                                </div>
                                                <div className="flex items-center gap-2 px-4">
                                                    <div className="rating rating-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                        </svg>
                                                    </div>
                                                    <progress className="progress progress-primary w-full" value="0" max="100"></progress>
                                                    <div className="text-sm">(0)</div>
                                                </div>
                                                <div className="flex items-center gap-2 px-4">
                                                    <div className="rating rating-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-400">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 md:mt-0 block w-full lg:w-8/12 overflow-y-auto max-h-screen">
                                            <LoadingAnimation isLoading={isLoading} />
                                            {!isLoading && (
                                                <>
                                                    {review.map((el, index) => (
                                                        <div key={index} className="mb-2 rounded-2xl border border-gray-300 shadow-xl">
                                                            <div className="p-6 text-left">
                                                                <div className="flex justify-between border-b border-neutral py-2">
                                                                    <div className="w-full">
                                                                        <div className="text-lg">{el.review_text}</div>
                                                                        <div className="badge mt-2">{el.created_at}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2 mt-2">
                                                                    <div className="badge badge-primary text-md font-semibold">
                                                                        {el.reviewer.name}
                                                                    </div>
                                                                    <div className="badge text-xs">
                                                                        {renderStars(el.rating)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {seeData && (
                                    <>
                                        {seeTechnician && (
                                            <>
                                                <input type="radio" name="my_tabs_2" role="tab" className="tab text-md font-semibold [--tab-border-color:#e11d48]" aria-label="Technician" />
                                                <div role="tabpanel" className="tab-content bg-base-100 border-primary rounded-box p-6">
                                                    <div className="block md:flex gap-4">
                                                        <PICCard picData={picFirst} title="First PIC" className="" onViewDetail={handleViewDetail} />
                                                        <PICCard picData={picIct} title="ICT PIC" className="" onViewDetail={handleViewDetail} />
                                                        <PICCard picData={picBackup} title="Backup PIC" className="" onViewDetail={handleViewDetail}/>
                                                        <PICCard picData={picUser} title="User PIC" className="" onViewDetail={handleViewDetail}/>
                                                        <PICCard picData={picOld} title="Old PIC" className="grayscale" onViewDetail={handleViewDetail}/>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {seeTechnology && (
                                            <>
                                                <input type="radio" name="my_tabs_2" role="tab" className="tab text-md font-semibold [--tab-border-color:#e11d48]" aria-label="Technology" />
                                                <div role="tabpanel" className="tab-content bg-base-100 border-primary rounded-box p-6">
                                                    <div className="join join-vertical w-full">
                                                        {technology.length > 0 ? (
                                                            <table className="table table-bordered">
                                                                <thead>
                                                                    <tr className="border border-secondary">
                                                                        <th>Group</th>
                                                                        <th>Name</th>
                                                                        <th>Version</th>
                                                                        <th>Status</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {technology.map((tech, index) => (
                                                                        <tr key={index} className="border border-secondary">
                                                                            <td>{tech.group}</td>
                                                                            <td>{tech.name}</td>
                                                                            <td>{tech.version}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        ) : (
                                                            <p>No technology available for this application.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {seeTopology && (
                                            <>
                                                <input type="radio" name="my_tabs_2" role="tab" className="tab text-md font-semibold [--tab-border-color:#e11d48]" aria-label="Topology" />
                                                <div role="tabpanel" className="tab-content bg-base-100 border-primary rounded-box p-6">
                                                    {topology.length > 0 ? (
                                                        <table className="table table-bordered">
                                                            <thead>
                                                                <tr className="border border-secondary">
                                                                    <th>Group</th>
                                                                    <th>Link</th>
                                                                    <th>Description</th>
                                                                    <th>Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {topology.map((topo, index) => (
                                                                    <tr key={index} className="border border-secondary">
                                                                        <td>{topo.group}</td>
                                                                        <td>{topo.link}</td>
                                                                        <td>{topo.description}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        <p>No Topology available for this application.</p>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </section>
                )}
                <dialog id="modal-pic" className="modal">
                    <div className="modal-box max-w-6xl w-full">
                        <h3 className="font-bold text-xl mb-2">Detail {modalTitle}</h3>
                        {selectedPicData ? (
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <td className="font-semibold capitalize">Nama</td>
                                        <td>{selectedPicData.name}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold capitalize">Contact</td>
                                        <td>{selectedPicData.contact}</td>
                                    </tr>
                                </tbody>
                                <tbody>
                                    {selectedPicData.applications && selectedPicData.applications.length > 0 ? (
                                        selectedPicData.applications.map((app, index) => (
                                            <tr key={index}>
                                                <td className="font-semibold capitalize">{app.name}</td>
                                                <td>
                                                    {app.image ? (
                                                        <Link to={`/application/${app.id}`}>
                                                            <img
                                                                src={app.image}
                                                                className="w-16 h-16 object-cover"
                                                                alt={app.name}
                                                            />
                                                        </Link>
                                                    ) : (
                                                        "N/A"
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2">No Connected Apps</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <p>No data available for this PIC.</p>
                        )}
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>Close</button>
                    </form>
                </dialog>
            </div>
        ) : 
        <div className="flex items-center justify-center min-h-screen bg-base-100">
            <span className="loading loading-infinity loading-lg items-center text-primary animate-bounce"></span>
            <span className="text-2xl font-bold animate-bounce text-primary">&nbsp;Loading</span>
        </div>}
        </>
    );
}

export default AppDetail;
