import { useEffect, useState } from "react";
import instance from "../../../axios";
import { NavbarDashboard } from "../../components/navbarDashboard";
import { Link, useNavigate } from "react-router-dom";

export function Users() {
    const [user, setUser] = useState([]);
    const [userSpecified, setUserSpecified] = useState([]);
    const [load, setLoad] = useState(true);

    const fetchDataUser = async () => {
        await instance.get("/users").then((response) => {
            setUser(response.data.data);
            setLoad(false);
        });
    };

    const [open, setOpen] = useState(false);
    const [id, setId] = useState(0);

    const handleOpen = async (el) => {
        setOpen(open === true ? false : true);
        setId(el)
        await instance.get(`/users/${el}`).then((response) => {
            setUserSpecified(response.data.data)
        })

    };

    const deleteUser = async (id) => {
        await instance.delete(`/users/${id}`).then((response) => {
            setUser(
                user.filter((user) => {
                    return user.id !== id;
                })
            )
        });
    };



    const itemsPerPage = 8; // Number of items to display per page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the range of items to display based on the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Slice the data array to get the items for the current page
    const currentData = user.slice(startIndex, endIndex);

    const totalPages = Math.ceil(user.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };


    const navigate = useNavigate();

    const [loadPage, setLoadPage] = useState(false)


    const [seeButton, setSeeButton] = useState(null);
    const fetchData = async () => {

        //fetch user from API
        await instance.get('/user')
            .then((response) => {
                const userRole = response.data.role;

                //set response user to state
                if (userRole === "admin" || userRole === "teknisi") {
                    setLoadPage(true);
                } else {
                    navigate('/dashboard');
                }

                if (userRole === "admin") {
                    setSeeButton(true);
                    setLoadPage(true);
                }
            })
    }
    useEffect(() => {
        fetchData();
        fetchDataUser();
    }, []);

    return (
        <>{loadPage ?
            <section className='flex gap-4'>
                <div className={(open) ? "w-full lg:w-9/12" : "w-full"}>
                    <div className="p-2">
                    <h1 className='font-bold text-xl p-2'>Users Table</h1>
                        {load === true ?
                            <div className="flex items-center p-2"><span className="loading loading-infinity loading-md"></span>&emsp;Loading data</div>
                            : <>
                                <div className='flex justify-between p-2'>
                                {seeButton &&(
                                    <>
                                    <Link to="add">
                                        <button className='btn btn-success btn-sm'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>Add
                                        </button>
                                    </Link>
                                    </>)}
                                    <div className='badge badge-outline text-error'>
                                        *click row for detail
                                    </div>
                                </div>
                                <table className="w-full table-auto my-4 table-xs">
                                    <thead>
                                        <tr>
                                            {["name", "role", "email", "phone"].map(
                                                (el) => (
                                                    <td key={el}
                                                        className="text-left font-semibold capitalize text-sm border-b border-neutral py-2">
                                                        {el}
                                                    </td>
                                                )
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((user, index) => (
                                            <tr key={index} onClick={() => handleOpen(user.id)} className="hover:bg-gray-300 hover:shadow-lg">
                                                <td className="px-4 align-middle">
                                                    <div className="flex items-center gap-4">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                                                        </svg>

                                                        <div>
                                                            <p className="font-semibold"
                                                            >
                                                                {user.name}
                                                            </p>
                                                            <p className="italic hidden md:flex">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td >
                                                    {user.role === "admin" && (<div className="badge badge-error w-24 h-6 p-2 text-xs">{user.role}</div>)}
                                                    {user.role === "client" && (<div className="badge badge-info w-24 h-6 p-2 text-xs">{user.role}</div>)}
                                                    {user.role === "teknisi" && (<div className="badge badge-warning w-24 h-6 p-2 text-xs">{user.role}</div>)}
                                                    {user.role === "reporter" && (<div className="badge badge-success w-24 h-6 p-2 text-xs">{user.role}</div>)}
                                                </td>
                                                <td >
                                                    {user.email}
                                                </td>

                                                <td >
                                                    {user.phone}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex items-center justify-between my-4">

                                    <p>Total data {user.length ? user.length : 0} entries</p>

                                    {user.length > 10 && (<div className="join">
                                        <button className="join-item btn btn-primary btn-sm p-1 rounded-none" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                                        </svg>
                                        </button>
                                        <p className="join-item btn btn-base-100 btn-sm">{`${currentPage} of ${totalPages}`}</p>
                                        <button className="join-item btn btn-primary btn-sm p-1 rounded-none" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                                        </svg>
                                        </button>
                                    </div>)}

                                </div>
                            </>}

                    </div>
                </div>
                <div className={(open) ? "hidden md:block lg:w-3/12 shadow-xl px-2 py-4 min-h-screen bg-gray-200" : "hidden"}>
                    <div className="flex justify-between p-2 bg-gray-200">
                        <span className='text-2xl font-bold'>Detail</span>
                        {seeButton &&(
                        <>
                        {userSpecified.id === id && <div className="flex gap-1">
                            <Link to={`edit/${userSpecified.id}`}>
                                <button className="btn btn-warning btn-sm p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>Edit </button>
                            </Link>
                            <button className="btn btn-primary btn-sm p-1" onClick={() => document.getElementById('my_modal_1').showModal()}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>Delete
                            </button>

                        </div>}
                        </>)}

                    </div>

                    <div role="tablist" className="tabs tabs-boxed mt-4 bg-gray-200">
                        <input type="radio" name="my_tabs_2" role="tab" className="tab font-bold " aria-label="Spesifikasi" defaultChecked />
                        <div role="tabpanel" className="tab-content px-2">
                            <div className="flex justify-between items-center p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-1/5">
                                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                                </svg>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="table table-bordered">
                                    <thead className="hidden">
                                        <tr>
                                            <th >Field</th>
                                            <th> value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[[userSpecified.name, "name"], [userSpecified.email, "email"], [userSpecified.role, "role"], [userSpecified.phone, "phone"]].map(
                                            (el) => (
                                                (el[0] && <tr key={el}>
                                                    <td className="text-sm capitalize font-semibold bg-gray-300">
                                                        {el[1]}
                                                    </td>
                                                    <td className="border border-gray-200">
                                                        {el[0]}
                                                    </td>
                                                </tr>
                                                )
                                            )
                                        )}


                                    </tbody>
                                </table>

                            </div>

                        </div>

                        {/* <input type="radio" name="my_tabs_2" role="tab" className="tab font-bold" aria-label="More" />
                    <div role="tabpanel" className="tab-content bg-base-100 ">
                    </div> */}

                    </div>
                </div>
                <dialog id="my_modal_1" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Delete</h3>
                        <p className="pt-4">Are you sure to delete the data?</p>
                        <div className="modal-action">
                            <div method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn btn-success btn-sm mr-2" onClick={() => (deleteUser(userSpecified.id), document.getElementById('my_modal_1').close())} ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
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
            </section > : <div className="flex items-center justify-center min-h-screen bg-base-100"><span className="loading loading-infinity loading-lg items-center text-primary animate-bounce"></span><span className="text-2xl font-bold text-primary animate-bounce">&nbsp;Loading</span></div>
        }

        </>
    )
}