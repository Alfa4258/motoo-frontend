import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import instance from "../../../axios";

export function UserEdit() {
    const [user, setUser] = useState([]);
    const [load, setLoad] = useState(true);
    //destruct ID
    const { id } = useParams();
    //define method
    const fetchDataUser = async () => {
        await instance.get('/user')
            .then((response) => {
                //set response user to state
                (response.data.role !== "admin" ?
                    navigate('/dashboard') : "")
            })


        //fetch data from API with Axios
        await instance.get(`/users/${id}`).then((response) => {
            setUser(response.data.data);
            setData(response.data.data);
            setLoad(false);
        });
    };

    const renderRoleOptions = () => {
        const allRole = ['admin', 'teknisi', 'reporter', 'client'];  // List all possible groups
        const currentRole = user.role;  // Current group from props or state
    
        // Filter out the current group from the list of options to prevent duplication
        return allRole.filter(role => role !== currentRole).map(role => (
            <option key={role} value={role}>{role}</option>
        ));
    };

    //run hook useEffect
    useEffect(() => {
        //call method "fetchDataPosts"
        fetchDataUser();
    }, []);

    const navigate = useNavigate();
    const [data, setData] = useState({
        // Define the structure of your item
        // You might get this data from an API call or other sources
        id: '',
        name: '',
        email: '',
        role: '',
        job: '',
        team: '',
        phone: '',
        password: '',
    });

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        
            // Make a PUT or PATCH request to update the item
            await instance.patch(`/users/${id}`, data);

            // Handle success (you can redirect or perform other actions)
            console.log('data updated successfully');
            navigate('/dashboard/users');
        } catch (error) {
            // Handle error
            console.log('Error updating data');
        }
    };
    return (
        <>
            <form onSubmit={handleSubmit} className="container mx-auto p-4">
            <div className="font-bold text-lg">Edit User Data</div>
                <div className="grid grid-cols-1 gap-4 py-2">
                    <div >
                        <label className="form-control w-full ">
                            <span className="label-text text-xs font-semibold">Name</span>
                            <input type="text" defaultValue={user.name} onChange={handleChange} name="name" className="input input-bordered input-sm w-full" />
                        </label>
                    </div>


                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                    <div className="md:mt-0 mt-2 w-full">
                        <label className="form-control w-full max-w-lg">
                            <span className="label-text text-xs font-semibold">role</span>
                            <select className="select select-bordered select-sm" name="role" defaultValue={user.role} onChange={handleChange}>
                            <option value={user.role}>{user.role}</option>
                            {renderRoleOptions()} 
                            </select>
                        </label>
                    </div>



                    {[[user.job, "job"], [user.email, "email"], [user.phone, "phone"], [user.team, "team"]].map(
                        (el) => (
                            <div key={el}>
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">{el[1]}</span>
                                    <input type="text" name={el[1]} defaultValue={el[0]} onChange={handleChange} className="input input-bordered input-sm w-full " />
                                </label>
                            </div>
                        )
                    )}
                    <div>
                        <label className="form-control w-full ">
                            <span className="label-text text-xs font-semibold">password</span>
                            <input type="password" name="password" defaultValue={user.password} onChange={handleChange} className="input input-bordered input-sm w-full " />
                        </label>
                    </div>

                </div>

                <div className="flex items-center justify-end my-4 gap-4">

                    <button className="btn btn-success btn-sm" type="submit" value="submit  ">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Submit
                    </button>
                    <Link to={"/dashboard/users"}>
                        <button className="btn btn-error btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>

                            Cancel
                        </button>
                    </Link>
                </div>
            </form>
        </>
    )
}