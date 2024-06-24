import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import instance from "../../../axios";

export function ApplicationsEdit() {
    const [applications, setApplications] = useState([]);
    const [load, setLoad] = useState(true);
    const [virtualMachine, setVirtualMachine] = useState([]);
    const [groupAreas, setGroupAreas] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [pic, setPIC] = useState([]);
    const [topology, setTopology] = useState([]);
    const [technology, setTechnology] = useState([]);

    const navigate = useNavigate();
    const { id } = useParams();

    const fetchDataApplications = async () => {
        try {
            const userResponse = await instance.get('/user');
            if (userResponse.data.role !== "admin") {
                navigate('/dashboard');
                return;
            }

            const appResponse = await instance.get(`/applications/${id}`);
            const appData = appResponse.data.data;
            setApplications(appData);
            setData({
                ...appData,
                first_pic: appData.first_pic || '',
                virtual_machines: appData.virtual_machines || [],
                group_area: appData.group_area.id || '',
                product_by: appData.product_by.id || '',
                tier: appData.tier || ''
            });
            setLoad(false);
        } catch (error) {
            console.error("Error fetching application data", error);
        }
    };

    const fetchAppsData = async () => {
        try {
            const [vmResponse, topologyResponse, technologyResponse, picResponse, groupAreasResponse, companiesResponse] = await Promise.all([
                instance.get("/virtual_machines"),
                instance.get("/topologies"),
                instance.get("/technologies"),
                instance.get("/pics"),
                instance.get("/group_areas"),
                instance.get("/companies")
            ]);

            setVirtualMachine(vmResponse.data.data);
            setTopology(topologyResponse.data.data);
            setTechnology(technologyResponse.data.data);
            setPIC(picResponse.data.data);
            setGroupAreas(groupAreasResponse.data.data);
            setCompanies(companiesResponse.data.data);
        } catch (error) {
            console.error("Error fetching additional data", error);
        }
    };

    useEffect(() => {
        fetchDataApplications();
        fetchAppsData();
    }, []);

    const [data, setData] = useState({
        name: '', 
        description: '', 
        business_process: '', 
        platform: '',
        status: '', 
        tier: '', 
        category: '', 
        group_area: '', 
        product_by: '', 
        db_connection_path: '', 
        ad_connection_path: '', 
        sap_connection_path: '',
        technical_doc: '', 
        user_doc: '', 
        other_doc: '', 
        information: '', 
        virtual_machines: [],
        first_pic: [],
        backup_pic: [],
        pic_ict: [],
        pic_user: [],
        old_pic: [],
        topologies: [],
        technologies: [],
    });

    const renderOptions = (allOptions, current) => {
        return allOptions.filter(option => option !== current).map(option => (
            <option key={option} value={option}>{option}</option>
        ));
    };

    const handleChange = (e) => {
        const { name, value, selectedOptions } = e.target;
        if (selectedOptions) {
            const values = Array.from(selectedOptions, option => option.value);
            setData({ ...data, [name]: values });
        } else {
            setData({ ...data, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.keys(data).forEach(key => {
            if (Array.isArray(data[key])) {
                data[key].forEach(item => formData.append(`${key}[]`, item));
            } else {
                formData.append(key, data[key]);
            }
        });

        try {
            formData.append('_method', 'PATCH');
            await instance.post(`/applications/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate('/dashboard/applications');
        } catch (error) {
            console.error('Error updating data', error);
        }
    };

    return (
        <>
            {load ? (
                <div className="flex items-center justify-center min-h-screen bg-base-100"><span className="loading loading-infinity loading-lg items-center text-primary animate-bounce"></span><span className="text-2xl font-bold animate-bounce text-primary">&nbsp;Loading</span></div>
            ) : (
                <div className="container mx-auto p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="font-bold text-lg">Edit Application Data</div>
                        <div className="grid grid-cols-1 gap-4 py-2">
                            <div >
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">Short Name</span>
                                    <input type="text" value={data.short_name} onChange={handleChange} name="short_name" className="input input-bordered input-sm w-full" autoComplete="off" />
                                </label>
                            </div>
                            <div >
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">Long Name</span>
                                    <input type="text" value={data.long_name} onChange={handleChange} name="long_name" className="input input-bordered input-sm w-full" autoComplete="off" />
                                </label>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                            <div>
                                <label className="form-control w-full">
                                    <span className="label-text text-xs font-semibold">Pick a file*</span>
                                    <input type="file" className="file-input file-input-sm file-input-bordered w-full" name="image" onChange={handleFileChange} />
                                </label>
                            </div>
                            <div>
                                <label className="form-control w-full max-w-lg">
                                    <span className="label-text text-xs font-semibold">Platform</span>
                                    <select className="select select-bordered select-sm" name="platform" defaultValue={applications.platform} onChange={handleChange}>
                                        <option value={applications.platform}>{applications.platform}</option>
                                        {renderOptions(['website', 'mobile', 'desktop'], applications.platform)}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label className="form-control w-full max-w-lg">
                                    <span className="label-text text-xs font-semibold">Status</span>
                                    <select className="select select-bordered select-sm" name="status" defaultValue={applications.status} onChange={handleChange}>
                                        <option value={applications.status}>{applications.status}</option>
                                        {renderOptions(['up', 'down', 'maintenance', 'delete'], applications.status)}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label className="form-control w-full">
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
                                <label className="form-control w-full max-w-lg">
                                    <span className="label-text text-xs font-semibold">Category</span>
                                    <select className="select select-bordered select-sm" name="category" defaultValue={applications.category} onChange={handleChange}>
                                        <option value={applications.category}>{applications.category}</option>
                                        {renderOptions(['sap', 'non_sap', 'turunan', 'ot/it', 'collaboration'], applications.category)}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label className="form-control w-full">
                                    <span className="label-text text-xs font-semibold">user_login</span>
                                    <select className="select select-bordered select-sm" name="user_login" defaultValue={applications.user_login} onChange={handleChange}>
                                        <option value={applications.user_login}>{applications.user_login}</option>
                                        {renderOptions(['login sso', 'login ad', 'internal apps'], applications.user_login)}
                                    </select>
                                </label>
                            </div>
                            {[
                                [applications.group, "group"],
                                [applications.business_process, "business_process"]
                            ].map(el => (
                                <div key={el[1]}>
                                    <label className="form-control w-full">
                                        <span className="label-text text-xs font-semibold">{el[1]}</span>
                                        <input type="text" defaultValue={el[0]} onChange={handleChange} name={el[1]} className="input input-bordered input-sm w-full" />
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="form-control w-full">
                                <span className="label-text text-xs font-semibold">Virtual machine</span>
                                <select multiple className="select select-bordered select-sm" name="virtual_machines" value={data.virtual_machines} onChange={handleChange}>
                                    <option value="" disabled>-- Select Virtual Machine --</option>
                                    {virtualMachine.map((el, index) => (
                                        <option key={index} value={el.id}>{el.id}-{el.name}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                            {[
                                [applications.url_prod, "url_prod"],
                                [applications.url_dev, "url_dev"],
                                [applications.vm_dev, "vm_dev"],
                                [applications.vm_prod, "vm_prod"]
                            ].map(el => (
                                <div key={el[1]}>
                                    <label className="form-control w-full">
                                        <span className="label-text text-xs font-semibold">{el[1]}</span>
                                        <input type="text" defaultValue={el[0]} onChange={handleChange} name={el[1]} className="input input-bordered input-sm w-full" />
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="form-control w-full">
                                <span className="label-text text-xs font-semibold">PIC First</span>
                                <select className="select select-bordered select-sm" name="first_pic" value={data.first_pic} onChange={handleChange}>
                                    <option value="" disabled>-- Select PIC --</option>
                                    {pic.map((el, index) => (
                                        <option key={index} value={el.id}>{el.id}.{el.name}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                            <div>
                                <label className="form-control w-full">
                                    <span className="label-text text-xs font-semibold">PIC Backup</span>
                                    <select multiple className="select select-bordered select-sm" name="backup_pic" value={data.backup_pic} onChange={handleChange}>
                                        <option value="" disabled>-- Select PIC Backup --</option>
                                        {pic.map((el, index) => (
                                            <option key={index} value={el.id}>{el.id}.{el.name}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label className="form-control w-full">
                                    <span className="label-text text-xs font-semibold">PIC ICT</span>
                                    <select multiple className="select select-bordered select-sm" name="pic_ict" value={data.pic_ict} onChange={handleChange}>
                                        <option value="" disabled>-- Select PIC ICT --</option>
                                        {pic.map((el, index) => (
                                            <option key={index} value={el.id}>{el.id}.{el.name}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label className="form-control w-full">
                                    <span className="label-text text-xs font-semibold">PIC USER</span>
                                    <select multiple className="select select-bordered select-sm" name="pic_user" value={data.pic_user} onChange={handleChange}>
                                        <option value="" disabled>-- Select PIC USER --</option>
                                        {pic.map((el, index) => (
                                            <option key={index} value={el.id}>{el.id}.{el.name}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label className="form-control w-full">
                                    <span className="label-text text-xs font-semibold">PIC OLD</span>
                                    <select multiple className="select select-bordered select-sm" name="old_pic" value={data.old_pic} onChange={handleChange}>
                                        <option value="" disabled>-- Select PIC OLD --</option>
                                        {pic.map((el, index) => (
                                            <option key={index} value={el.id}>{el.id}.{el.name}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label className="form-control w-full">
                                    <span className="label-text text-xs font-semibold">Technology</span>
                                    <select multiple className="select select-bordered select-sm" name="technologies" value={data.technologies} onChange={handleChange}>
                                        <option value="" disabled>-- Select Technology --</option>
                                        {technology.map((el, index) => (
                                            <option key={index} value={el.id}>{el.id}.{el.group}-{el.name}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label className="form-control w-full">
                                    <span className="label-text text-xs font-semibold">Topology</span>
                                    <select multiple className="select select-bordered select-sm" name="topologies" value={data.topologies} onChange={handleChange}>
                                        <option value="" disabled>-- Select Topology --</option>
                                        {topology.map((el, index) => (
                                            <option key={index} value={el.id}>{el.id}.{el.group}-{el.link}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                            {[
                                [applications.db_connection_path, "db_connection_path"],
                                [applications.sap_connection_path, "sap_connection_path"],
                                [applications.ad_connection_path, "ad_connection_path"],
                                [applications.user_doc, "user_doc"],
                                [applications.technical_doc, "technical_doc"],
                                [applications.other_doc, "other_doc"]
                            ].map(el => (
                                <div key={el[1]}>
                                    <label className="form-control w-full">
                                        <span className="label-text text-xs font-semibold">{el[1]}</span>
                                        <input type="text" defaultValue={el[0]} onChange={handleChange} name={el[1]} className="input input-bordered input-sm w-full" />
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div>
                            <h3 className="py-2 font-bold">Description</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    [applications.description, "Description"],
                                    [applications.information, "Information"]
                                ].map(el => (
                                    <div key={el[1]}>
                                        <label className="form-control">
                                            <span className="label-text">{el[1]}</span>
                                            <textarea className="textarea textarea-bordered h-36" defaultValue={el[0]} onChange={handleChange} name={el[1]} placeholder={"Write your " + el[1] + " here..."}></textarea>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-end my-4 gap-4">
                            <button className="btn btn-success btn-sm" type="submit">
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
                    </form>
                </div>
            )}
        </>
    );
    
}
