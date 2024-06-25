import React from 'react';

export function PICCard({ picData, title, className, onViewDetail }) {
    return (
        <div className="card w-60 bg-base-100 shadow-xl">
            <figure>
                <img
                    src={picData.length > 0 && picData[0].photo ? picData[0].photo : 'https://i.pinimg.com/564x/58/cc/f0/58ccf0b8588653f63f55e93dc68d7cd0.jpg'}
                    alt={`${title}`}
                    className={className}
                    style={{ height: '300px', width: '100%', objectFit: 'cover' }}
                />
            </figure>
            <div className="card-body flex flex-col items-center">
                {picData.length > 0 ? (
                    <>
                        <div>{title}</div>
                        <h1 className="card-title">{picData[0].name}</h1>
                        <div className="card-actions justify-center items-center">
                            <button
                                className="btn btn-outline btn-sm w-40"
                                onClick={() => onViewDetail(picData[0], title)}
                            >
                                View Detail
                            </button>
                        </div>
                    </>
                ) : (
                    <p>Loading {title} information...</p>
                )}
            </div>
    </div>
    );
}