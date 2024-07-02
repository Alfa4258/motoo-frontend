import { useEffect, useState } from "react";
import { Footer } from "../../components/footer";
import instance from "../../../axios";
import ApplicationCard from "../../components/applicationCard";
import { Link } from "react-router-dom";
import { FilterPanel } from "../../components/filterPanel" ;

export default function LandingPage() {
    const [currentData, setCurrentData] = useState([]);
    const [applications, setApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isFiltered, setIsFiltered] = useState(false);
    const [delayTimeout, setDelayTimeout] = useState(null);
    const [platformFilter, setPlatformFilter] = useState('All');
// States for categories, status, and ratings checkboxes
    const [categoriesFilter, setCategoriesFilter] = useState([]);
    const [statusFilter, setStatusFilter] = useState([]);
    const [ratingsFilter, setRatingsFilter] = useState([]);
    const [totalApp, setTotalApp] = useState();

    const itemsPerPage = 8; // Number of items to display per page

    //define method
    const fetchDataApplications = async () => {
        //fetch data from API with Axios
        await instance.get("/applications").then((response) => {
            const data = response.data.data;
            setApplications(data);
            setTotalApp((response.data).length);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
            setCurrentData(data.slice(0, itemsPerPage));
            console.log(applications);
        })

    };

    //run hook useEffect
    useEffect(() => {
        //call method "fetchDataPosts"
        fetchDataApplications();
    }, []);


    useEffect(() => {
        // Call method "fetchDataApplications" or set the total pages based on all applications
        if (searchTerm === '') {
            setTotalPages(Math.ceil(applications.length / itemsPerPage));
        }
    }, [searchTerm, applications]);

    // Define the function to handle search
    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setCurrentPage(1); // Reset current page to 1 when searching
        setIsFiltered(true);
    };
    useEffect(() => {
        if (delayTimeout) {
            clearTimeout(delayTimeout);
        }
    
        const newTimeout = setTimeout(() => {
            // Filter applications based on multiple criteria
            let filteredApplications = applications.filter(application => {
                // Check platform if not 'All', case-insensitive
                const byPlatform = platformFilter === 'All' || applications.platform.toLowerCase() === platformFilter.toLowerCase();
    
                // Check if the application category is in the categoriesFilter array, case-insensitive
                const byCategory = categoriesFilter.length === 0 || categoriesFilter.some(filter => filter.toLowerCase() === application.category.toLowerCase());
    
                // Check if the application status is in the statusFilter array, case-insensitive
                const byStatus = statusFilter.length === 0 || statusFilter.some(filter => filter.toLowerCase() === application.status.toLowerCase());
    
                // Round the total_rating to the nearest integer
                const roundedRating = Math.round(application.total_rating);

                // Check if the rounded application rating is in the ratingsFilter array
                const byRatings = ratingsFilter.length === 0 || ratingsFilter.includes(roundedRating);
    
                // Return true if all conditions are met
                return byPlatform && byCategory && byStatus && byRatings;
            });
    
            // Apply search term filter last, if applicable
            if (searchTerm) {
                filteredApplications = filteredApplications.filter(application => application.short_name.toLowerCase().includes(searchTerm.toLowerCase()));
            }
    
            // Update state to render the filtered and searched applications
            setCurrentData(filteredApplications.slice(0, itemsPerPage));
            setTotalApp(filteredApplications.length);
            setTotalPages(Math.ceil(filteredApplications.length / itemsPerPage));
        }, 500); // Delay of 500ms
    
        setDelayTimeout(newTimeout);
    
        // Cleanup function to clear the timeout when the component unmounts or dependencies change
        return () => {
            clearTimeout(newTimeout);
        };
    }, [searchTerm, platformFilter, categoriesFilter, statusFilter, ratingsFilter, applications]); // Dependency array
    

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        const startIndex = (newPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        let dataToSlice = isFiltered
          ? applications.filter(application =>
              application.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : applications;
      
        const slicedData = dataToSlice.slice(startIndex, endIndex);
        setCurrentData(slicedData);
      };

    return (
        <>
            {/* <section>
                <div className="hero min-h-[600px] ">   
                    <div className="hero-content flex-col lg:flex-row-reverse">
                        <img src="/img/hero.png" className="mx-8 max-w-sm md:max-w-lg" />
                        <div>
                            <h1 className="text-5xl font-bold">Monitoring Tools Office</h1>
                            <p className="py-6">This App to display catalogue and monitoring application in Manage Service <a href="https://tailwindcss.com" className="hover:underline">SISI</a> </p>
                            <a href="#catalog" className="btn btn-primary">See all application</a>
                            <div className="md:flex mt-16 hidden">
                                <div className="max-w-screen-xl mx-auto">
                                    <div className="grid gap-2 md:grid-cols-10">
                                        {['product01.png', 'product02.png', 'product03.png', 'product04.png', 'product05.png', 'product06.png', 'product07.png', 'product08.png', 'product09.png', 'product10.png'].map(
                                            (el) => (
                                                <img src={"img/" + el} key={el} className="w-full hover:p-1" />
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                    </div>
                </div>
            </section> */}
            <div className="p-4 mx-auto bg-gray-100" id="catalog">
                <div className="md:flex justify-between py-4">
                    <div className="p-2">
                        <span className="text-3xl font-bold">All Applications</span>
                        <span className="text-lg"><br />Our Application was managed by Sinergi Informatika Semen Indonesia</span>
                    </div>
                    <div className="flex items-center">
                    <div className="text-right">
                        <div className="font-bold">Total Applications</div>
                        <div className="text-primary text-3xl">{totalApp}</div>
                    </div>
                    <div className="stat-figure text-primary ml-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8">
                        <path fillRule="evenodd" d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v11.25C1.5 17.16 2.34 18 3.375 18H9.75v1.5H6A.75.75 0 006 21h12a.75.75 0 000-1.5h-3.75V18h6.375c1.035 0 1.875-.84 1.875-1.875V4.875C22.5 3.839 21.66 3 20.625 3H3.375zm0 13.5h17.25a.375.375 0 00.375-.375V4.875a.375.375 0 00-.375-.375H3.375A.375.375 0 003 4.875v11.25c0 .207.168.375.375.375z" clipRule="evenodd" />
                        </svg>
                    </div>
                    </div>
                </div>


                <div className="flex">
                    <div className="hidden md:block md:w-4/12 lg:w-2/12 p-2">
                        <div className="sidepanel">
                        <div className="px-2 mb-4 ">
                            <div className="join border-1 border-gray-300 rounded-lg overflow-hidden focus-within:border-red-500 ">
                                <div>
                                    <div>
                                        <input className="input input-bordered w-full max-w-xs join-item input-primary" placeholder="Search" name="searchBox" value={searchTerm} onChange={handleSearch}/>
                                        </div>
                                    </div>
                                        <button className="btn btn-primary join-item"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                        </svg>
                                        </button>
                                </div>
                            </div>
                            <div>
                                <FilterPanel 
                                    platformFilter={platformFilter}
                                    categoriesFilter={categoriesFilter}
                                    statusFilter={statusFilter}
                                    ratingsFilter={ratingsFilter}
                                    setPlatformFilter={setPlatformFilter}
                                    setCategoriesFilter={setCategoriesFilter}
                                    setStatusFilter={setStatusFilter}
                                    setRatingsFilter={setRatingsFilter}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-8/12 lg:w-10/12">
                        {currentData.length > 0 ?
                            <section className="bg-gray-100" >
                                <div>
                                    {/* Render your data here using the currentData array */}
                                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

                                        {currentData.map((applications, index) => (
                                            <ApplicationCard
                                                id={applications.id}
                                                name={applications.short_name}
                                                img={applications.image}
                                                key={index}
                                                status={applications.status}
                                                platform={applications.platform}
                                                category={applications.category}
                                                group_area={applications.group_area.short_name}
                                                rating={applications.total_rating}
                                            />
                                        )
                                        )}
                                    </div>

                                    {applications.length > 8 && (
                                        <div className='mt-8 text-right'>
                                            <div className="join px-2">
                                                <button className="join-item btn btn-primary btn-sm px-1 rounded-none" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                                                </svg>
                                                </button>
                                                <p className="join-item btn btn-base-100 btn-sm ">{`${currentPage} of ${totalPages}`}</p>
                                                <button className="join-item btn btn-primary btn-sm px-1 rounded-none" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                                                </svg>
                                                </button>
                                            </div>

                                        </div>
                                    )}
                                </div>

                            </section> : <></>}

                    </div>

                </div>


            </div>


        </>
    )
}