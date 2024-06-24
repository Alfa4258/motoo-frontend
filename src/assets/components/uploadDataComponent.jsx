import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import instance from '../../axios';


const UploadDataComponent = () => {


    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            alert("Please upload a file first.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = event.target.result;
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            console.log(jsonData);

            // Define the required fields and their default values
            const requiredFields = {
                name: '',
                description: '',
                business_process: '',
                platform: '',
                status: '',
                tier: 0,
                category: '',
                group_area: 0,
                product_by: 0,
                db_connection_path: '',
                ad_connection_path: '',
                sap_connection_path: '',
                technical_doc: '',
                user_doc: '',
                other_doc: '',
                information: '',
                vm_prod: '',
                vm_dev: '',
                url_prod: '',
                url_dev: '',
                environment: '',
                user_login: '',
                virtual_machines: [],
                first_pic: '',
                backup_pic: [],
                pic_ict: [],
                pic_user: [],
                old_pic: [],
                topologies: [],
                technologies: []
            };

            // Map and validate the JSON data
            const formattedData = jsonData.map((item, index) => {
                const formattedItem = {};

                // Ensure all required fields are present
                for (const [key, defaultValue] of Object.entries(requiredFields)) {
                    formattedItem[key] = item[key] !== undefined ? item[key] : defaultValue;
                    if (Array.isArray(defaultValue) && typeof formattedItem[key] === 'string') {
                        formattedItem[key] = formattedItem[key].split(',');
                    }
                }

                // Log each item for detailed inspection
                console.log(`Formatted item ${index + 1}:`, formattedItem);

                return formattedItem;
            });
            console.log("Validated Data for API:", formattedData);

            // Send the formatted data to the API
            instance.post('/applications', formattedData, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(response => {
                    console.log('Data uploaded successfully', response);
                })
                .catch(error => {
                    console.error('Error uploading data', error);
                    if (error.response) {
                        console.error('Response data:', error.response.data);
                        console.error('Response status:', error.response.status);
                        console.error('Response headers:', error.response.headers);
                    }
                });
        };

        reader.readAsArrayBuffer(file);
    };

    return (
    <div>
        <button className='btn btn-info btn-sm' onClick={() => document.getElementById('my_modal_2').showModal()}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 animate-bounce">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>Upload
        </button>
            <dialog id="my_modal_2" className="modal">
                <div className="modal-box">
                    <div className="flex justify-between">
                        <h3 className="font-bold text-2xl">Upload Data</h3>
                        <a href="../../exampleData/test.xlsx" download target='_blank'>
                            <button className="btn btn-info btn-sm">Download Template</button>
                        </a>
                    </div>
                    <form className="py-6" onSubmit={handleSubmit}>
                        <div>Update data via file Excel</div>
                        <input type="file" className="file-input file-input-sm w-full max-w-xs my-4" onChange={handleFileChange} />
                        <div className="text-error text-xs w-full">important to download template first before submit</div>
                        <button type="submit" className="btn btn-success btn-sm mt-2 w-full">Submit</button>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
    </div>
    );
};

export default UploadDataComponent;
