import { useEffect, useState, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import instance from "../../../axios";
import UploadDataComponent from '../../components/uploadDataComponent';
import axios from "axios";
import * as XLSX from 'xlsx';

export function Applications() {
    const [applications, setApplications] = useState([]);
    const [virtualMachine, setVirtualMachine] = useState([]);
    const [topology, setTopology] = useState([]);
    const [technology, setTechnology] = useState([]);
    const [picOld, setPicOld] = useState([]);
    const [picIct, setPicIct] = useState([]);
    const [picUser, setPicUser] = useState([]);
    const [picBackup, setPicBackup] = useState([]);
    const [picFirst, setPicFirst] = useState([]);
    const [applicationSpecified, setApplicationSpecified] = useState([]);

    const [currentData, setCurrentData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 15; // Number of items to display per page

    const [open, setOpen] = useState(false);
    const [id, setId] = useState(0);
    const [load, setLoad] = useState(true);
    const [platform, setPlatform] = useState('all');
    const [category, setCategory] = useState('all');
    const [group, setGroup] = useState('all');
    const [groupArea, setGroupArea] = useState('all');
    const [status, setStatus]= useState('all');

    const handleOpen = async (el) => {
        setOpen(open === true ? false : true);
        setId(el)
        await instance.get(`/applications/${el}`).then((response) => {
            const data = response.data.data;
            setApplicationSpecified(data || [])
            setVirtualMachine(data.virtual_machines || []);
            setTopology(data.topology || []);
            setTechnology(data.technology || []);
            setPicFirst(data.first_pics || []);
            setPicBackup(data.backup_pics || []);
            setPicIct(data.pic_icts || []);
            setPicUser(data.pic_users || []);
            setPicOld(data.old_pics || []);
            console.log('application:', applicationSpecified);
            console.log('total application:', applications);
        })
    };
    //define method 
    
    const fetchDataApplications = async () => {
        //fetch data from API with Axios
        await instance.get("/applications").then((response) => {
            setApplications(response.data.data);
            setLoad(false)
            console.log('application:', applications);
        });
        // await instance.get("/applications").then((response) => {
        //     setVirtualMachine(response.data.data);
        // });
    };

    const deleteApplication = async (id) => {
        await instance.delete(`/applications/${id}`).then((response) => {
            setApplications(
                applications.filter((applications) => {
                    return applications.id !== id;
                })
            )
        });
    };

    const debounce = (func, wait) => {
        let timeout;

        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const debounced = useCallback(
        debounce((value, setterFunction) => {
            setterFunction(value);
        }, 300),
        [] // Dependencies array can be empty because debounce creates a stable function
    );

    const handlePlatformChange = (e) => {
        debounced(e.target.value, setPlatform);
    };
    const handleCategoryChange = (e) => {
        debounced(e.target.value, setCategory);
    };
    const handleGroupChange = (e) => {
        debounced(e.target.value, setGroup);
    };    
    const handleGroupAreaChange = (e) => {
        debounced(e.target.value, setGroupArea);
    };    
    const handleStatusChange = (e) => {
        debounced(e.target.value, setStatus);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }; 

    useEffect(() => {
        const applyFilters = () => {
            // Filter data based on dropdowns and searchTerm, if they are used
            const filtered = applications.filter(application => {
                // Ensure all comparisons are case-insensitive and handle 'all' cases
                const byPlatform = platform === 'all' || application.platform.toLowerCase() === platform.toLowerCase();
                const byCategory = category === 'all' || application.category.toLowerCase() === category.toLowerCase();
                const byGroup = group === 'all' || application.group.toLowerCase() === group.toLowerCase();
                const byGroupArea = groupArea === 'all' || application.group_area.name.toLowerCase() === groupArea.toLowerCase();
                const byStatus = status === 'all' || application.status.toLowerCase() === status.toLowerCase();
                const byName = application.name.toLowerCase().includes(searchTerm.toLowerCase());
    
                // Return true if all conditions are met
                return byPlatform && byCategory && byGroup && byGroupArea && byStatus && byName;
            });
    
            // Update totalPages based on filtered or initial data
            setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    
            // Apply pagination
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            setCurrentData(filtered.slice(startIndex, endIndex));
        };
    
        applyFilters();
    }, [currentPage, applications, platform, category, group, groupArea, status, searchTerm, itemsPerPage]);
    


    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    
    const handleExportData = () => {
        const flattenApplications = applications.map(app => ({
            ...app,
            backup_pics: JSON.stringify(app.backup_pics),
            first_pics: JSON.stringify(app.first_pics),
            pic_icts: JSON.stringify(app.pic_icts),
            pic_users: JSON.stringify(app.pic_users),
            product_by: JSON.stringify(app.product_by),
            reviews: JSON.stringify(app.reviews),
            technology: JSON.stringify(app.technology),
            topology: JSON.stringify(app.topology),
            virtual_machines: JSON.stringify(app.virtual_machines),
        }));

        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(flattenApplications);

        XLSX.utils.book_append_sheet(wb, ws, "MySheet1");

        XLSX.writeFile(wb, "DataAplikasi.xlsx");
    };

    const handleExportDataSpecified = () => {
        // Ensure applicationSpecified is an array and not empty
        if (!Array.isArray(applicationSpecified) || applicationSpecified.length === 0) {
            console.error('applicationSpecified is not valid.');
            return;
        }
    
        // Define the data you want to export
        const data = applicationSpecified;
    
        // Create a new workbook
        const wb = XLSX.utils.book_new();
    
        // Convert the data to a worksheet
        const ws = XLSX.utils.json_to_sheet(data);
    
        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Application Data');
    
        // Save the workbook as an Excel file
        XLSX.writeFile(wb, 'application_data.xlsx');
    };

    const navigate = useNavigate();
    const [loadPage, setLoadPage] = useState(false)

    const fetchData = async () => {

        //fetch user from API
        await instance.get('/user')
            .then((response) => {

                //set response user to state
                (response.data.role !== "admin" ?
                    navigate('/dashboard') : (setLoadPage(true)))

            })
    }



    //run hook useEffect
    useEffect(() => {
        fetchData();
        fetchDataApplications();
    }, []);

    return (
        <>{loadPage ? (
            <section className='flex gap-4'>
                <div className={(open) ? "w-full lg:w-8/12" : "w-full"}>
                    <div className=" p-2">
                        <h1 className='font-bold text-xl p-2'>Applications Table</h1>
                        {load === true ?
                            <div className="flex items-center p-2"><span className="loading loading-infinity loading-md"></span>&emsp;Loading data</div>
                            : <div >
                                <div className='flex justify-between p-2'>
                                    <div className="flex gap-2">
                                        <Link to="add">
                                            <button className='btn btn-success btn-sm'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 animate-bounce">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>Add
                                            </button>
                                        </Link>
                                        <UploadDataComponent />
                                        <button className='btn btn-success btn-sm' onClick={handleExportData}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 animate-bounce">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5" />
                                        </svg>Download
                                        </button>
                                        
                                        </div>

                                        <label className="input input-bordered flex items-center gap-2">
                                        <input  
                                            placeholder="Search" 
                                            value={searchTerm} 
                                            onChange={handleSearch} 
                                            name="searchBox"  
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                                        </label>
                                    {/* <div className='badge badge-outline text-info'>
                                        *click row for detail
                                    </div> */}
                                </div>
                                <table className="w-full table-auto table-xs">
                                    <thead>
                                        <tr>
                                            <th className="px-2 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                                                application
                                            </th>
                                            <th className="px-2 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                                                <div className="flex items-center justify-between">
                                                <select
                                                    value={platform}
                                                    onChange={handlePlatformChange}
                                                    className="form-select rounded-lg p-2"
                                                >
                                                    <option value="all">Platform</option>
                                                    {["Website","Mobile","Dekstop"].map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                    ))
                                                    }
                                                </select>
                                                </div>
                                            </th>
                                            <th className="px-2 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                                                <div className="flex items-center justify-between">
                                                <select
                                                    value={category}
                                                    onChange={handleCategoryChange}
                                                    className="form-select rounded-lg p-2"
                                                >
                                                    <option value="all">Category</option>
                                                    {["SAP","Non SAP","Turunan","OT/IT","Collaboration"].map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                    ))}
                                                </select>
                                                </div>
                                            </th>
                                            <th className="px-2 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                                                <div className="flex items-center justify-between">
                                                <select
                                                    value={group}
                                                    onChange={handleGroupChange}
                                                    className="form-select rounded-lg p-2 "
                                                >
                                                    <option value="all">Group</option>
                                                    {["a","b","s"].map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                    ))}
                                                </select>
                                                </div>
                                            </th>
                                            <th className="px-2 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                                                <div className="flex items-center justify-between">
                                                <select
                                                    value={groupArea}
                                                    onChange={handleGroupAreaChange}
                                                    className="form-select rounded-lg p-2 "
                                                >
                                                    <option value="all">Group Area</option>
                                                    {["SIG","SP","ST","SBI","PTPN","BIOFARMA"].map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                    ))}
                                                </select>
                                                </div>
                                            </th>
                                            <th className="px-2 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                                                <div className="flex items-center justify-between">
                                                <select
                                                    value={status}
                                                    onChange={handleStatusChange}
                                                    className="form-select rounded-lg p-2 "
                                                >
                                                    <option value="all">Status</option>
                                                    {["UP","DOWN","Maintenance","DELETED"].map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                    ))}
                                                </select>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((applications, index) => (
                                            <tr key={applications.id} onClick={() => handleOpen(applications.id)} className="hover:bg-gray-300 hover:shadow-lg">

                                                <td className="px-4 align-middle">
                                                    <div className="flex items-center gap-4">
                                                        {/* <img src="/img/sig.png" alt="sig" className="h-10" /> */}
                                                        {(applications.image == null) ? (<img src="/img/sig.png" alt="Default Image" className="h-12" />
                                                        ) : (
                                                            // <p>{applications.image}</p>
                                                            <img src={applications.image} className="h-12" />
                                                        )}
                                                        <div>
                                                            <p className="font-semibold text-md capitalize "
                                                            >
                                                                {applications.name}
                                                            </p>
                                                            <p className="text-xs italic">
                                                                {applications.url_prod}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td >
                                                    {applications.platform}
                                                </td>
                                                <td >
                                                    {applications.category}
                                                </td>
                                                <td >
                                                    {applications.group}
                                                </td>
                                                <td >
                                                    {applications.group_area.name}
                                                </td>
                                                <td>
                                                    {(applications.status === "up") ? (
                                                        <div className="badge badge-success badge-lg w-24 h-6 p-2 text-xs">UP</div>
                                                    ) : applications.status === "down" ? (
                                                        <div className="badge badge-error badge-lg w-24 h-6 p-2 text-xs">DOWN</div>
                                                    ) : applications.status === "deleted" ?(
                                                        <div className="badge badge-error badge-lg w-24 h-6 p-2 text-xs ">DELETED</div>
                                                    ) :  (
                                                        <div className="badge badge-warning badge-lg w-24 h-6 p-2 text-xs ">MAINTENANCE</div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex items-center justify-between my-4">

                                    <p>Total data {applications.length ? applications.length : 0} entries</p>

                                    {applications.length > 15 && (<div className="join">
                                    <button 
                                        className="join-item btn btn-primary btn-sm p-1 rounded-none" 
                                        onClick={() => handlePageChange(currentPage - 1)} 
                                        disabled={currentPage === 1}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                                        </svg>
                                    </button>

                                    <p className="join-item btn btn-base-100 btn-sm">{`${currentPage} of ${totalPages}`}</p>
                                    <button 
                                        className="join-item btn btn-primary btn-sm p-1 rounded-none" 
                                        onClick={() => handlePageChange(currentPage + 1)} 
                                        disabled={currentPage >= totalPages || totalPages === 0}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </button>
                                    </div>)}

                                </div>
                            </div>}

                    </div>
                </div>


                <div className={(open) ? "hidden md:block lg:w-4/12 shadow-xl px-2 py-4 min-h-screen bg-gray-200" : "hidden"}>
                    <div className="flex justify-between p-2 rounded-xl bg-gray-200">
                        <h1 className='text-2xl font-bold'>Detail</h1>
                        {applicationSpecified.id === id && <div className="flex gap-1">
                            <Link to={`edit/${applicationSpecified.id}`}>
                                <button className="btn btn-warning btn-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 ">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>Edit</button>
                            </Link>
                            <button className="btn btn-error btn-sm p-1" onClick={() => document.getElementById('my_modal_1').showModal()}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 ">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>Delete
                            </button>
                            <button className="btn btn-success btn-sm p-1" onClick={handleExportDataSpecified}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 ">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5" />
                                </svg>Download
                            </button>

                        </div>}

                </div>

                <div role="tablist" className="tabs tabs-boxed mt-4 bg-gray-200 overflow-hidden">
                        <input type="radio" name="my_tabs_2" role="tab" className="tab tab-secondary font-bold" aria-label="Spesifikasi" defaultChecked />
                        <div role="tabpanel" className="tab-content border border-primary px-2">
                            <div className="flex justify-between items-center">
                                {/* <img src="/img/sig.png" alt="sig" className="h-24" /> */}
                                {(applicationSpecified.image === null) ? <img src="/img/sig.png" alt="sig" className="h-28" /> : <img src={applicationSpecified.image} className="h-24" />}
                                <div className="btn btn-info btn-xs  text-white capitalize" onClick={() => document.getElementById('modal-vm').showModal()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 0 0-.12-1.03l-2.268-9.64a3.375 3.375 0 0 0-3.285-2.602H7.923a3.375 3.375 0 0 0-3.285 2.602l-2.268 9.64a4.5 4.5 0 0 0-.12 1.03v.228m19.5 0a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3m19.5 0a3 3 0 0 0-3-3H5.25a3 3 0 0 0-3 3m16.5 0h.008v.008h-.008v-.008Zm-3 0h.008v.008h-.008v-.008Z" />
                                    </svg>
                                    Show VM</div>
                                <div className="btn btn-info btn-xs  text-white capitalize" onClick={() => document.getElementById('modal-documents').showModal()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 0 0-.12-1.03l-2.268-9.64a3.375 3.375 0 0 0-3.285-2.602H7.923a3.375 3.375 0 0 0-3.285 2.602l-2.268 9.64a4.5 4.5 0 0 0-.12 1.03v.228m19.5 0a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3m19.5 0a3 3 0 0 0-3-3H5.25a3 3 0 0 0-3 3m16.5 0h.008v.008h-.008v-.008Zm-3 0h.008v.008h-.008v-.008Z" />
                                    </svg>
                                    Show More Documents</div>
                            </div>
                            
                            <div className=" ">
                                <table className="table table-bordered table-xs">
                                    <thead className="hidden">
                                        <tr>
                                            <th>Field</th>
                                            <th>Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {[[applicationSpecified.url_prod, "url_prod"], [applicationSpecified.url_dev, "url_dev"]].map(
                                            (el) => (
                                                (el[0] &&
                                                    <tr className="my-2" key={el}>
                                                        <td className="font-bold capitalize bg-gray-300">{el[1]}
                                                        </td>
                                                        <td className="border border-gray-300">
                                                            <Link to={"//" + el[0]} target="_blank" className="italic underline text-primary ">
                                                                {el[0]}
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        )}

                                        {[[applicationSpecified.name, "name"], [applicationSpecified.category, "category"], [applicationSpecified.platform, "platform"], [applicationSpecified.user_login, "User Login"],[applicationSpecified.business_process, "business"],[applicationSpecified.group_area?.name || 'Group Area not available', "Group Area"], [applicationSpecified.tier, "Tier"], [applicationSpecified.status, "status"], [applicationSpecified.db_connection_path, "DB Connect"], [applicationSpecified.sap_connection_path, "SAP Connect"]].map(
                                            (el) => (
                                                (el[0] && <tr key={el} >
                                                    <td className="font-bold capitalize bg-gray-300">{el[1]}</td>
                                                    <td className="border border-gray-300">{el[0]} </td>
                                                </tr>)
                                            )
                                        )}

                                        {[[applicationSpecified.description, "description"], [applicationSpecified.user_login, "User Login"], [applicationSpecified.notes, "Notes"]].map(
                                            (el) => (
                                                (el[0] && <tr key={el} >
                                                    <td className="font-bold capitalize bg-gray-300 " colSpan={2}>{el[1]}

                                                        <p className="font-normal text-justify py-2 break-word">{el[0]} </p>
                                                    </td>
                                                </tr>)
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                        <input type="radio" name="my_tabs_2" role="tab" className="tab font-bold " aria-label="Technician" />
                        <div role="tabpanel" className="tab-content ">
                            <div className="join join-vertical w-full">
                                <div className="collapse collapse-plus bg-base-200">
                                <input type="radio" name="my-accordion-3" defaultChecked /> 
                                    <div className="collapse-title text-xl font-medium">
                                    First PIC
                                    </div>
                                <div className="collapse-content"> 
                                <div className="avatar">
                                    <div className="w-24 rounded-full">
                                        {/* Ensure there's a check if picFirst has data and also check if it has a photo */}
                                        <img src={picFirst.length > 0 && picFirst[0].photo ? picFirst[0].photo : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} />
                                    </div>
                                </div>
                                {/* Check if picFirst has data and then access the first item */}
                                    {picFirst.length > 0 && (
                                        <>
                                            <p><b>Name</b> : {picFirst[0].name}</p>
                                            <p><b>Contact</b> : {picFirst[0].contact}</p>
                                            <p><b>Job Description</b> : {picFirst[0].jobdesc}</p>
                                            <p><b>Status</b> : {picFirst[0].status}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        <div className="collapse collapse-plus bg-base-200">
                        <input type="radio" name="my-accordion-3" /> 
                        <div className="collapse-title text-xl font-medium">
                        Backup PIC
                        </div>
                        <div className="collapse-content">
                            <div className="avatar">
                                <div className="w-24 rounded-full">
                                    <img src={picBackup.length > 0 && picBackup[0].photo ? picBackup[0].photo : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} />
                                </div>
                            </div>
                            {picBackup.length > 0 && (
                                <>
                                    <p><b>Name</b> : {picBackup[0].name}</p>
                                    <p><b>Contact</b> : {picBackup[0].contact}</p>
                                    <p><b>Job Description</b> : {picBackup[0].jobdesc}</p>
                                    <p><b>Status</b> : {picBackup[0].status}</p>
                                </>
                            )}
                        </div>
                        </div>

                        <div className="collapse collapse-plus bg-base-200">
                            <input type="radio" name="my-accordion-3" /> 
                            <div className="collapse-title text-xl font-medium">
                            PIC ICT
                            </div>
                            <div className="collapse-content">
                                <div className="avatar">
                                    <div className="w-24 rounded-full">
                                        <img src={picIct.length > 0 && picIct[0].photo ? picIct[0].photo : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} />
                                    </div>
                                </div>
                                {picIct.length > 0 && (
                                    <>
                                        <p><b>Name</b> : {picIct[0].name}</p>
                                        <p><b>Contact</b> : {picIct[0].contact}</p>
                                        <p><b>Job Description</b> : {picIct[0].jobdesc}</p>
                                        <p><b>Status</b> : {picIct[0].status}</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="collapse collapse-plus bg-base-200">
                            <input type="radio" name="my-accordion-3" /> 
                            <div className="collapse-title text-xl font-medium">
                            PIC User
                            </div>
                            <div className="collapse-content">
                                <div className="avatar">
                                    <div className="w-24 rounded-full">
                                        <img src={picUser.length > 0 && picUser[0].photo ? picUser[0].photo : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} />
                                    </div>
                                </div>
                                {picUser.length > 0 && (
                                    <>
                                        <p><b>Name</b> : {picUser[0].name}</p>
                                        <p><b>Contact</b> : {picUser[0].contact}</p>
                                        <p><b>Job Description</b> : {picUser[0].jobdesc}</p>
                                        <p><b>Status</b> : {picUser[0].status}</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="collapse collapse-plus bg-base-200">
                            <input type="radio" name="my-accordion-3" /> 
                            <div className="collapse-title text-xl font-medium">
                            Old PIC
                            </div>
                            <div className="collapse-content">
                                <div className="avatar">
                                        <div className="w-24 rounded-full">
                                            <img src={picOld.length > 0 && picOld[0].photo ? picOld[0].photo : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} />
                                        </div>
                                </div>
                                    {picOld.length > 0 && (
                                        <>
                                            <p><b>Name</b> : {picOld[0].name}</p>
                                            <p><b>Contact</b> : {picOld[0].contact}</p>
                                            <p><b>Job Description</b> : {picOld[0].jobdesc}</p>
                                            <p><b>Status</b> : {picOld[0].status}</p>
                                        </>
                                    )}
                            </div>
                        </div>
                        </div>
                        </div>

                        <input type="radio" name="my_tabs_2" role="tab" className="tab font-bold " aria-label="Technology" />
                        <div role="tabpanel" className="tab-content border border-primary w-full">
                        <div className="join join-vertical w-full">
                            {technology.length > 0 ? (
                                <table className="table table-bordered">
                                    <thead>                                           
                                    <tr className="border border-secondary">
                                        <th>Group</th>
                                        <th>Name </th>
                                        <th>Version</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {technology.map((tech, index) => (
                                        <tr key={index} className="border border-secondary">
                                            <td >{tech.group}</td>
                                            <td >{tech.name}</td>
                                            <td >{tech.version}</td>
                                            {/* <td >{topo.status}</td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                    </table>
                                    ) : (
                                        <p>No technology available for this application.</p>
                                    )}
                        </div>
                        </div>
                        <input type="radio" name="my_tabs_2" role="tab" className="tab font-bold " aria-label="Topology" />
                        <div role="tabpanel" className="tab-content border border-gray-300 p-4 items-center h-64">
                        <div className="flex justify-between items-center">
                        <div className="btn btn-info btn-sm text-white capitalize" onClick={() => document.getElementById('modal-topology').showModal()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 0 0-.12-1.03l-2.268-9.64a3.375 3.375 0 0 0-3.285-2.602H7.923a3.375 3.375 0 0 0-3.285 2.602l-2.268 9.64a4.5 4.5 0 0 0-.12 1.03v.228m19.5 0a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3m19.5 0a3 3 0 0 0-3-3H5.25a3 3 0 0 0-3 3m16.5 0h.008v.008h-.008v-.008Zm-3 0h.008v.008h-.008v-.008Z" />
                                    </svg>
                                    Show Topology</div>
                        </div>
                        </div>
                    
                    </div>
                </div>
                <dialog id="my_modal_1" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Delete</h3>
                        <p className="pt-4">Are you sure to delete the data?</p>
                        <div className="modal-action">
                            <div method="dialog">
                                {/* if there is a button in form, it will close the modal */}

                                <button className="btn btn-success btn-sm mr-2" onClick={() => (deleteApplication(applicationSpecified.id), document.getElementById('my_modal_1').close())} ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                    Yes</button>
                                <button className="btn btn-error btn-sm" onClick={() => document.getElementById('my_modal_1').close()}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                    No</button>
                            </div>
                        </div>
                    </div>
                </dialog>

                <dialog id="my_modal_2" className="modal">
                    <div className="modal-box ">
                        <div className="flex justify-between">
                            <h3 className="font-bold text-2xl">Upload Data</h3>
                            <a href="../../exampleData/test.xlsx" download target='_blank'>
                            <button className="btn btn-info btn-sm"> Download Template </button>
                            </a>
                        </div>
                        <form className="py-6">
                            <div className="">Update data via file Excel</div>
                            <input type="file" className="file-input file-input-sm w-full max-w-xs my-4" />
                            {/* <br/> */}
                            <div className="text-error text-xs w-full">important to download template first before submit</div>
                            <a href="" className="btn btn-success btn-sm mt-2 w-full">Submit</a>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>

                <dialog id="modal-vm" className="modal">
                    <div className="modal-box max-w-6xl w-full">
                        <h3 className="font-bold text-xl mb-2">Virtual Machine</h3>
                        <div className="join join-vertical w-full">
                        {virtualMachine.length > 0 ? (
                                virtualMachine.map((vm, index) => (
                                <div key={index} className="collapse collapse-arrow join-item">
                                    <input type="radio" name="my-accordion-4" />
                                    <div className="collapse-title text-sm font-semibold">
                                        {vm.environment === "production" && (<span className="badge badge-warning font-bold rounded-none p-1">P</span>)}  
                                        {vm.environment === "development" && (<span className="badge badge-accent font-bold rounded-none p-1">D</span>)}
                                        <span> &nbsp;{vm.name}</span>
                                    </div>
                                    <div className="collapse-content text-justify">
                                        <table className="table table-bordered">
                                            <thead>                                           
                                                <tr className="border border-secondary">
                                                <th>Group</th>
                                                <th>IP Address</th>
                                                {/* <th>Environment</th> */}
                                                <th>Description</th>
                                                <th>Notes</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr className="border border-secondary">
                                                <td >{vm.group}</td>
                                                <td >{vm.ip_address}</td>
                                                {/* <td ><span className="badge badge-secondary">{vm.environment}</span></td> */}
                                                <td >{vm.description}</td>
                                                <td >{vm.notes}</td>
                                            </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                </div>

                                ) )) : (
                                    <p>No virtual machines available for this application.</p>
                                )}
                            


                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>

                <dialog id="modal-documents" className="modal">
                    <div className="modal-box max-w-6xl w-full">
                        <h3 className="font-bold text-xl mb-2">More Documents</h3>
                        <div className="join join-vertical w-full">
                            <ul className="flex flex-wrap items-center justify-center">
                                <li>
                                <a href="#" >
                                    <button className="btn btn-secondary me-4 hover:underline md:me-6"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                        Technical Documents
                                    </button>
                                </a>
                                </li>
                                <li>
                                    <a href="#" >
                                        <button className="btn btn-info me-4 hover:underline md:me-6"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                        User Guide
                                        </button>
                                    </a>
                                    
                                </li>
                                <li>
                                <a href="#" >
                                    <button className="btn btn-outline btn-info me-4 hover:underline md:me-6"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                    </svg>
                                        More Documents
                                    </button>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>


                <dialog id="modal-topology" className="modal">
                    <div className="modal-box max-w-6xl w-full">
                        <h3 className="font-bold text-xl mb-2">Topology</h3>
                        {topology.length > 0 ? (
                                <table className="table table-bordered">
                                    <thead>                                           
                                    <tr className="border border-secondary">
                                        <th>Group</th>
                                        <th>Link </th>
                                        <th>Description</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {topology.map((topo, index) => (
                                        <tr key={index} className="border border-secondary">
                                            <td >{topo.group}</td>
                                            <td >{topo.link}</td>
                                            <td >{topo.description}</td>
                                            {/* <td >{topo.status}</td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                    </table>
                                    ) : (
                                        <p>No Topology available for this application.</p>
                                    )}
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                        </form>
                        </dialog>


            </section >) : <div className="flex items-center justify-center min-h-screen bg-base-100 "><span className="loading loading-infinity loading-lg items-center text-primary animate-bounce"></span><span className="animate-bounce text-xl font-bold text-primary capitalize">&nbsp;loading</span></div>}

        </>
    )
}