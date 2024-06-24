import { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../../axios";

export function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [validation, setValidation] = useState([]);

    const navigateTo = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        //send data to server
        await instance.post('/register', { name, email, password })
            .then(() => {

                //redirect to login page
                navigateTo('/login')
            })
            .catch((error) => {

                //assign error to state "validation"
                setValidation(error.response.data);
            })
    };

    return (
        <>
            <div className="hero min-h-screen bg-gradient-to-br from-red-600 to-gray-100">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold px-6">&nbsp;</h1>
                    </div>
                    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <div className="bg-gradient-to-l from-primary to-base-100">&nbsp;</div>
                        <form className="card-body">
                            <div className="flex items-center mb-2">
                                <img src="/img/logo.png" className="w-12 mr-2" />
                                <span className="font-bold text-4xl text-primary">MO</span>
                                <span className="font-bold text-4xl">TOO</span>
                            </div>
                            <span className="text-sm italic font-semibold">please register with your email</span>
                            <div className="py-4">
                                <div className="form-control mb-2">
                                    <div className="join from-primary">
                                        <button className="btn join-item btn-primary"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>

                                        </button>
                                        <input type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder="fullname" className="join-item input w-full input-primary" required />
                                        {validation.name && (
                                            <div className="text-error">
                                                {validation.name[0]}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-control mb-2">
                                    <div className="join ">
                                        <button className="btn join-item btn-primary"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
                                        </svg>
                                        </button>
                                        <input type="email" placeholder="email" onChange={(e) => setEmail(e.target.value)} value={email} className="join-item input w-full input-primary" required />
                                        {validation.email && (
                                            <div className="text-error">
                                                {validation.email[0]}
                                            </div>
                                        )
                                        }
                                    </div>
                                </div>

                                <div className="form-control">
                                    <div className="join">
                                        <button className="btn btn-primary join-item "><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                        </svg>
                                        </button>
                                        <input type="password" placeholder="password" className="input join-item w-full input-primary" onChange={(e) => setPassword(e.target.value)} value={password} required />
                                        {
                                            validation.password && (
                                                <div className="text-error">
                                                    {validation.password[0]}
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>

                            </div>
                            <div className="form-control" >
                                <button className="btn btn-primary" onClick={handleSubmit}>Register</button>
                                <span className="text-sm italic font-semibold">Sudah memiliki akun? <a className = "text-primary "href="/login">Log in</a> </span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </>
    )
}