import React from 'react';

const MembershipItem = ({ membership, onBuy }) => {
    const { id, name, price, description } = membership;

    // Conditional classes for premium membership - Keep the blue shadow for ID 4
    const isPremium = id === 4;
    const premiumShadowClass = isPremium ? 'shadow-blue-500/50' : 'shadow-[rgba(33,150,243,0.4)]';

    return (
        // Wrapper for the gradient border on hover
        // This wrapper will have the gradient background on hover
        <div
            className={`p-[2px] rounded-[14px] transition-all duration-300 group relative
                 hover:bg-gradient-to-r hover:from-blue-400 hover:via-purple-500 hover:to-pink-500
                 ${isPremium ? 'hover:scale-105' : ''}`}
        >
            {/* Inner div with actual content and background */}
            {/* This div's background covers the wrapper's initial background, revealing the gradient on hover */}
            <div
                className={`flex flex-col items-center justify-around w-full h-full px-[1px] py-5 text-center
                   shadow-lg ${premiumShadowClass} rounded-[10px] bg-gradient-to-br from-[#04051dea] to-[#2b566e]`}
            >
                <div className="p-5 flex-grow w-full">
                    <div className="font-extrabold uppercase text-[rgba(255,255,255,0.64)] mt-2.5 text-[25px] tracking-wide">
                        {name}
                    </div>
                    <div className="text-white font-extrabold text-[50px] text-shadow-md">
                        ${price}
                    </div>
                    <div className="text-[rgba(255,255,255,0.6)] mt-2.5 text-sm">
                        {description}
                    </div>
                </div>
                <button
                    className="select-none border-none outline-none text-white uppercase font-bold text-xs py-3 px-6 bg-[#2196f3] rounded-xl w-[90%] shadow-[0px_4px_18px_#2c3442] mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => onBuy(membership)}
                >
                    Buy now
                </button>
            </div>
        </div>
    );
};

export default MembershipItem;