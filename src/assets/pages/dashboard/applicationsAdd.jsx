import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import instance from "../../../axios";
import { Applications } from "./applications";
import { VirtualMachine } from "./virtualMachine";

export function ApplicationsAdd() {

    const [loadPage, setLoadPage] = useState(false);
    const [virtualMachine, setVirtualMachine] = useState([]);
    const [groupAreas, setGroupAreas] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [pic, setPIC] = useState([]);
    const [topology, setTopology] = useState([]);
    const [technology, setTechnology] = useState([]);

    const fetchData = async () => {
        //fetch user from API
        await instance.get('/user')
            .then((response) => {
                //set response user to state
                (response.data.role !== "admin" ?
                    navigate('/dashboard') : setLoadPage(true))
            })
    }

    const fetchAppsData = async () => {
        //fetch data from API with Axios
        await instance.get("/virtual_machines").then((response) => {
            setVirtualMachine(response.data.data);
        });
        await instance.get("/topologies").then((response) => {
            setTopology(response.data.data);
        });
        await instance.get("/technologies").then((response) => {
            setTechnology(response.data.data);
        });
        await instance.get("/pics").then((response) => {
            setPIC(response.data.data);
        });
        await instance.get("/group_areas").then((response) => {
            setGroupAreas(response.data.data);
        });
        await instance.get("/companies").then((response) => {
            setCompanies(response.data.data);
        });
    };
    useEffect(() => {
        fetchData();
        fetchAppsData();
    }, []);

    const [data, setData] = useState({
        // Define the fields you want to add
        name: '', // required
        description: '', // required
        business_process: '', // required
        platform: 'website', // required, with specific enumerated options
        status: 'up', // required, with specific enumerated options, assuming default 'up'
        tier: '', // required, default set to '1', assuming the lowest level
        category: '', // required, need to select a valid category
        group_area: '', // integer
        product_by: '', // integer
        image: '', // image file, handle as needed in your form logic
        db_connection_path: '', // required
        ad_connection_path: '', // assuming required, not listed but seems necessary
        sap_connection_path: '', // required
        technical_doc: '', // required
        user_doc: '', // required
        other_doc: '', // required
        information: '', // required, not listed in your snippet but seems important
        vm_prod: '', // required
        vm_dev: '', // required
        url_prod: '', // required
        url_dev: '', // required
        environment: '',
        virtual_machines: [],
        first_pic: '',
        backup_pic: [],
        pic_ict: [],
        pic_user: [],
        old_pic: [],
        topologies: [],
        technologies: [],
        
    });

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handledata = (e) => {
        const valueArray = Array.from(e.target.selectedOptions, option => option.value);
    setData({ ...data, [e.target.name]: valueArray });
    };

    const handleFileChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.files[0] });

    }
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
    
        Object.keys(data).forEach(key => {
            if (Array.isArray(data[key])) {
                // Append each item in the array separately
                data[key].forEach(item => formData.append(`${key}[]`, item));
            } else {
                formData.append(key, data[key]);
            }
        });
    
        console.log('FormData:', ...formData); // Log FormData for debugging
    
        try {
            const response = await instance.post('/applications', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate('/dashboard/applications');
        } catch (error) {
            console.log('Error adding data', error);
        }
    };
    


    return (
        <>
            {loadPage ? (<form onSubmit={handleSubmit} className="container mx-auto p-4" >
            <div className="font-bold text-lg">Add Application Data</div>
                <div className="grid grid-cols-1 gap-4 py-2">
                    <div >
                        <label className="form-control w-full ">
                            <span className="label-text text-xs font-semibold">Name</span>
                            <input type="text" value={data.name} onChange={handleChange} name="name" className="input input-bordered input-sm w-full" autoComplete="off" />
                        </label>
                    </div>


                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2" >
                    <div >
                        <label className="form-control w-full ">
                            <span className="label-text text-xs font-semibold">Application Image</span>
                            <input type="file" className="file-input file-input-sm file-input-bordered w-full " aria-describedby="file_input_help" name="image" onChange={handleFileChange} />
                        </label>
                    </div>

                    <div>
                        <label className="form-control w-full ">
                            <span className="label-text text-xs font-semibold">Platform</span>
                            <select className="select select-bordered select-sm" name="platform" value={data.platform} onChange={handleChange}>

                                <option value="website">Website</option>
                                <option value="mobile">Mobile</option>
                                <option value="dekstop">Dekstop</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label className="form-control w-full max-w-lg">
                            <span className="label-text text-xs font-semibold">Status</span>
                            <select className="select select-bordered select-sm" name="status" value={data.status} onChange={handleChange}>
                                <option value="up">UP</option>
                                <option value="down">DOWN</option>
                            </select>
                        </label>
                    </div>

                    <div>
                        <label className="form-control w-full ">
                            <span className="label-text text-xs font-semibold">Tier</span>
                            <select className="select select-bordered select-sm" name="tier" value={data.tier} onChange={handleChange}>
                            <option value="">Select tier</option>
                                {[...Array(10)].map((_, index) => (
                                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    
                    <div>
                        <label className="form-control w-full ">
                            <span className="label-text text-xs font-semibold">Category</span>
                            <select className="select select-bordered select-sm" name="category" value={data.category} onChange={handleChange}>
                            <option value="">Select category</option>
                            <option value="sap">SAP</option>
                            <option value="non_sap">Non SAP</option>
                            <option value="turunan">Turunan</option>
                            <option value="ot/it">OT/IT</option>
                            <option value="collaboration">Collaboration</option>
                            </select>
                        </label>
                    </div>
                    
                    <div>
                        <label className="form-control w-full ">
                            <span className="label-text text-xs font-semibold">Group Area</span>
                            <select className="select select-bordered select-sm" name="group_area" value={data.group_area} onChange={handleChange}>
                            <option value="">Select Group Area</option>
                            {groupAreas.map((el, index) => (
                                <option key={index} value={el.id}>{el.name}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div>
                        <label className="form-control w-full ">
                            <span className="label-text text-xs font-semibold">Product By</span>
                            <select className="select select-bordered select-sm" name="product_by" value={data.product_by} onChange={handleChange}>
                            <option value="">Select Product By</option>
                            {companies.map((el, index) => (
                                <option key={index} value={el.id}>{el.name}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div>
                        <label className="form-control w-full ">
                            <span className="label-text text-xs font-semibold">user_login</span>
                            <select className="select select-bordered select-sm" name="user_login" value={data.user_login} onChange={handleChange}>
                            <option value="">Select user login</option>
                            <option value="login sso">login sso</option>
                            <option value="login ad">login ad</option>
                            <option value="internal apps">internal apps</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label className="form-control w-full ">
                            <span className="label-text text-xs font-semibold">Environment</span>
                            <select className="select select-bordered select-sm" name="environment" value={data.environment} onChange={handleChange}>
                            <option value="">Select Environment</option>
                            <option value="production">Production</option>
                            <option value="development">Development</option>
                            </select>
                        </label>
                    </div>
                    {["group","business_process"].map(
                        (el) => (
                            <div key={el}>
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">{el}</span>
                                    <input type="text" value={data.el} onChange={handleChange} name={el} className="input input-bordered input-sm w-full" autoComplete="off" />
                                </label>
                            </div>
                        )
                    )}

                    <div>
                        <label className="form-control w-full ">
                            <span className="label-text text-xs font-semibold">Virtual machine</span>
                            <select multiple className="select select-bordered select-sm" required name="virtual_machines" value={data.virtual_machines} onChange={handledata}>
                                <option value="" disabled>-- Select Virtual Machine --</option>
                                    {virtualMachine.map((el, index) => (
                                    <option key={index} value={el.id}>{el.id}-{el.name}</option>
                                    ))}
                            </select>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    {["url_dev", "url_prod","vm_dev","vm_prod"].map(
                        (el) => (
                            <div key={el}>
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">{el}</span>
                                    <input type="text" value={data.el} onChange={handleChange} name={el} className="input input-bordered input-sm w-full" autoComplete="off" />
                                </label>
                            </div>
                        )
                    )}

                </div>

                <div>
                    <label className="form-control w-full ">
                        <span className="label-text text-xs font-semibold">PIC First</span>
                        <select className="select select-bordered select-sm" required name="first_pic" value={data.first_pic} onChange={handledata}>
                            <option value="" disabled>-- Select PIC --</option>
                                {pic.map((el, index) => (
                                <option key={index} value={el.id}>{el.id}.{el.name}</option>
                                ))}
                        </select>
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    <div>
                        <label className="form-control w-full ">
                            <span className="label-text text-xs font-semibold">PIC Backup</span>
                            <select multiple className="select select-bordered select-sm" required name="backup_pic" value={data.backup_pic} onChange={handledata}>
                                <option value="" disabled>-- Select PIC Backup --</option>
                                    {pic.map((el, index) => (
                                    <option key={index} value={el.id}>{el.id}.{el.name}</option>
                                    ))}
                            </select>
                        </label>
                    </div> 
                    <div>
                        <label className="form-control w-full ">
                            <span className="label-text text-xs font-semibold">PIC ICT</span>
                            <select multiple className="select select-bordered select-sm" required name="pic_ict" value={data.pic_ict} onChange={handledata}>
                                <option value="" disabled>-- Select PIC ICT --</option>
                                    {pic.map((el, index) => (
                                    <option key={index} value={el.id}>{el.id}.{el.name}</option>
                                    ))}
                            </select>
                        </label>
                    </div> 
                    <div>
                        <label className="form-control w-full ">
                            <span className="label-text text-xs font-semibold">PIC USER</span>
                            <select multiple className="select select-bordered select-sm" required name="pic_user" value={data.pic_user} onChange={handledata}>
                                <option value="" disabled>-- Select PIC --</option>
                                    {pic.map((el, index) => (
                                    <option key={index} value={el.id}>{el.id}.{el.name}</option>
                                    ))}
                            </select>
                        </label>
                    </div>

                    <div>
                        <label className="form-control w-full ">
                            <span className="label-text text-xs font-semibold">PIC OLD</span>
                            <select multiple className="select select-bordered select-sm" required name="old_pic" value={data.old_pic} onChange={handledata}>
                                <option value="" disabled>-- Select PIC OLD --</option>
                                    {pic.map((el, index) => (
                                    <option key={index} value={el.id}>{el.id}.{el.name}</option>
                                    ))}
                            </select>
                        </label>
                    </div>
                    <div>
                        <label className="form-control w-full ">
                            <span className="label-text text-xs font-semibold">Technology</span>
                            <select multiple className="select select-bordered select-sm" required name="technologies" value={data.technologies} onChange={handledata}>
                                <option value="" disabled>-- Select Technology --</option>
                                    {technology.map((el, index) => (
                                    <option key={index} value={el.id}>{el.id}.{el.group}-{el.name}</option>
                                    ))}
                            </select>
                        </label>
                    </div> 
                    <div>
                        <label className="form-control w-full ">
                            <span className="label-text text-xs font-semibold">Topology</span>
                            <select multiple className="select select-bordered select-sm" required name="topologies" value={data.topologies} onChange={handledata}>
                                <option value="" disabled>-- Select Topology --</option>
                                    {topology.map((el, index) => (
                                    <option key={index} value={el.id}>{el.id}.{el.group}-{el.link}</option>
                                    ))}
                            </select>
                        </label>
                    </div> 
                </div>

                

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">


                    {["db_connection_path", "sap_connection_path","ad_connection_path"].map(
                        (el) => (
                            <div key={el}>
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">{el}</span>
                                    <input type="text" value={data.el} onChange={handleChange} name={el} className="input input-bordered input-sm w-full " autoComplete="off" />
                                </label>
                            </div>
                        )
                    )}

                    {["user_doc", "technical_doc","other_doc"].map(
                        (el) => (
                            <div key={el}>
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">{el}</span>
                                    <input type="text" value={data.el} onChange={handleChange} name={el} className="input input-bordered input-sm w-full "placeholder={"Write your " + el + " link here..."} autoComplete="off"/>
                                </label>
                            </div>
                        )
                    )}

                </div>


                <div>
                    <h3 className="py-2 font-bold">Description</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {["description","information"].map((el) => (
                            <div key={el}>
                                <label className="form-control">
                                    <span className="label-text">{el}</span>
                                    <textarea className="textarea textarea-bordered h-36" name={el} value={data.el} onChange={handleChange} placeholder={"Write your " + el + " here..."}></textarea>
                                </label>
                            </div>
                        ))}

                    </div>
                </div>

                <div className="flex items-center justify-end my-4 gap-4">
                    <button className="btn btn-success btn-sm" value="submit" type="submit" >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Submit
                    </button>
                    <Link to={"/dashboard/applications"}>
                        <button className="btn btn-error btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                        </button>
                    </Link>
                </div>
            </form>) : <div className="flex items-center justify-center min-h-screen bg-base-100"><span className="loading loading-infinity loading-lg items-center text-primary animate-bounce"></span><span className="text-2xl font-bold animate-bounce text-primary">&nbsp;Loading</span></div>}


        </>
    )
}