import React from "react";
import useLanguageInfo from "../../Hooks/LanguageInfo";

interface ModalProps {
    show: boolean;
    onClose: () => void;
    title: string;
    modalData: string;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, title, modalData }) => {
    const dataInfo = useLanguageInfo(modalData);

    if (!show) {
        return null;
    }

    return (
        <div className="modal-backdrop z-[100] fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-30">
            <div className="rounded-lg max-w-lg w-full bg-slate-800 shadow-custom m-5">
                <div className="flex justify-between p-5 border-b-2 items-center">
                    <p className="font-poppins font-extrabold text-white text-lg">
                        {title}
                    </p>
                    <button
                        onClick={onClose}
                        className="text-white font-bold text-xl text-right"
                    >
                        &times;
                    </button>
                </div>

                <h2 className="flex items-center justify-start gap-2 py-3 px-5 text-white text-lg font-semibold overflow-auto max-h-[89vh]">
                    {dataInfo?.icon}
                    {dataInfo?.title}
                </h2>

                <p className="py-1 px-5 text-white text-sm overflow-auto pb-4 max-h-[89vh]">
                    {dataInfo?.content}
                    {dataInfo?.link && (
                        <a
                            href={dataInfo.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pl-2 text-cyan-200 underline"
                        >
                            More info
                        </a>
                    )}
                </p>
            </div>
        </div>
    );
};

export default Modal;
