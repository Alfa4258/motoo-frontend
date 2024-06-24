import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../../axios";

export function Login() {

    const [data, setData] = useState({
        // Define the fields you want to add
        email: '',
        password: '',
    });

    const navigateTo = useNavigate();

    const [validation, setValidation] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [adminContact, setAdminContact] = useState({ email: '', phone: '' });

    const navigate = useNavigate();
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    localStorage.removeItem('token')
    //hook useEffect
    useEffect(() => {

        //check token
        if (localStorage.getItem('token')) {

            //redirect page dashboard
            navigate('/dashboard');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Make a POST request to your API endpoint
            const response = await instance.post('/login', data);

            //save token to localStorage
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            // Handle error
            setValidation(error.response.data);
            console.log(validation)
        }
    };

    const fetchDataAdmin = async (e) => {
        e.preventDefault();
        try {
            const response = await instance.get('/admin-contact');
            if (response.data.success) {
                const adminContactInfo = response.data.data;
                setAdminContact(adminContactInfo);
                setPopupMessage(`Hubungi Admin untuk mengganti password anda <br /><br />Email : ${adminContactInfo.email}<br />Phone : ${adminContactInfo.phone}`);
                setShowPopup(true);
            }
        } catch (error) {
            setValidation(error.response.data);
            setPopupMessage('Error: ' + error.response.data.message || 'Gagal mengambil data admin');
            setShowPopup(true);
            console.error("Error fetching admin contact:", error);
        }
    }

    useEffect(() => {
        fetchDataAdmin();
    }, []);

    const closePopup = () => {
        setShowPopup(false);
        navigateTo('/login');
        // setShowPopup(false);
        // if (popupMessage.startsWith('Reset Password')) {
        //     navigateTo('/login'); // Navigate to login page after closing popup
        // }
    };

    return (
        <>
            <div className="hero min-h-screen bg-gradient-to-br from-red-300 to-gray-100">
                <div className="hero-content flex-col ">
                    <div className="card shrink-0 w-full max-w-sm shadow-xl bg-base-100">
                        <div className="bg-gradient-to-l from-base-100 to-primary">&nbsp;</div>
                        <form className="card-body" onSubmit={handleSubmit}>
                            <div className="flex items-center mb-4">
                                <img src="/img/logo.png" className="w-14 mr-2" />
                                <span className="font-bold text-4xl text-primary">MO</span>
                                <span className="font-bold text-4xl">TOO</span>
                            </div>
                            <span className="text-sm italic font-semibold">please login with your email</span>
                            <div className="py-4">
                                <div className="form-control mb-2 border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-red-500">
                                    <div className="join">
                                        <button className="btn join-item btn-primary" tabIndex={-1}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
                                            </svg>
                                        </button>
                                        <input type="email" placeholder="Email" className="join-item input w-full" name="email" onChange={handleChange} value={data.email} required />
                                    </div>
                                    {validation.email && (
                                        <div className="text-error">
                                            {validation.email[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="form-control">
                                    <div className="join border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-red-500">
                                        <button className="btn btn-primary join-item" tabIndex={-1}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                            </svg>
                                        </button>
                                        <input type="password" placeholder="Password" className="input join-item w-full input-bordered" name="password" onChange={handleChange} value={data.password} required />
                                    </div>
                                    {validation.password && (
                                        <div className="text-error">
                                            {validation.password[0]}
                                        </div>
                                    )}
                                    {validation.message && (
                                        <div className="text-error">
                                            {validation.message}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="form-control">
                                <button className="btn btn-primary">Login</button>
                            </div>
                            <span className="text-sm italic font-semibold" style={{ textAlign: "center" }}>Belum memiliki akun? <a className="text-primary" href="/register">Daftar</a></span>
                            <span className="text-sm font-semibold" style={{ textAlign: "center" }}>
                                <a className="text-primary" onClick={fetchDataAdmin} style={{ cursor: 'pointer' }}>Lupa password ?</a>
                            </span>
                        </form>
                    </div>
                </div>
            </div>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
                        <p dangerouslySetInnerHTML={{ __html: popupMessage }}></p>
                        <button onClick={closePopup} className="mt-4 btn btn-primary">Close</button>
                    </div>
                </div>
            )}
        </>
    );
}
