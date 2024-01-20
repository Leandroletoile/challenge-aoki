import React from 'react';

interface ButtonsProps {
    onRotateLeft: () => void;
    onRotateRight: () => void;
    onDeleteLast: () => void;
    isLineComplete: boolean;
    hasSomethingToDelete: boolean;
}

const Buttons: React.FC<ButtonsProps> = ({ onRotateLeft, onRotateRight, onDeleteLast, isLineComplete, hasSomethingToDelete }) => {
    const iconSize = 30; 

    return (
        <div className="row mt-3 text-center">
            <div className="col-md-4 mb-2">
                <button className="btn btn-dark btn-circle btn-lg rounded-circle" onClick={onRotateLeft} disabled={isLineComplete || !hasSomethingToDelete}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                    </svg>
                </button>
            </div>

            <div className="col-md-4 mb-2">
                <button className="btn btn-danger btn-circle btn-lg rounded-circle" onClick={onDeleteLast} disabled={!hasSomethingToDelete}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                    </svg>
                </button>
            </div>

            <div className="col-md-4 mb-2">
                <button className="btn btn-dark btn-circle btn-lg rounded-circle" onClick={onRotateRight} disabled={isLineComplete || !hasSomethingToDelete}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} fill="currentColor" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Buttons;
