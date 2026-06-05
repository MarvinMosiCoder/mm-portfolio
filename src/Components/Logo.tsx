import React, { useState } from 'react';

const Logo: React.FC<any> = () => {
    const borderColor = 'border-teal-300';
    const hoverLogo = 'text-teal-200';
    return (
        <>
            <div className="pt-1">
                <div className="relative w-7 h-7">
                    <div className={`absolute inset-0 w-9 h-9 bg-transparent rounded-md border-2 ${borderColor} transform rotate-45`}>
                    <div className={`absolute inset-0 w-8 h-8 transform -rotate-65 flex justify-center items-center`}>
                        <span className={`text-teal-300 hover:${hoverLogo} text-lg font-bold`}>M</span>
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Logo;