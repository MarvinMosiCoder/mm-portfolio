import React, { useEffect, useState } from 'react';
import { Link } from 'react-scroll';

const Sidebar: React.FC<any> = (props) => {
    const tealt = 'text-teal-300';
    const textGray = 'text-gray-400';

    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isScrolling, setIsScrolling] = useState(false);

    const handleClick = (index: number) => {
        // Prevent double trigger by disabling scroll effects momentarily
        setIsScrolling(true);
        setActiveIndex(index);

        // Allow scroll effects after some delay to ensure the smooth scroll is done
        setTimeout(() => {
            setIsScrolling(false);
        }, 500); // Adjust the delay based on the duration of smooth scroll
    }

    useEffect(() => {
        const sections = ['about', 'experience', 'projects', 'contact'];

        const handleScroll = () => {
            if (isScrolling) return; // Skip updating activeIndex if we are scrolling due to a click

            sections.forEach((section, index) => {
                const element = document.querySelector(`[data-section="${section}"]`);
                if (element) {
                    const rect = (element as HTMLElement).getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
                        setActiveIndex(index);
                    }
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isScrolling]);

    return (
        <div className="flex justify-between text-left pt-[60px]">
            <ul className="flex flex-col gap-5 text-left font-poppins text-sm">
                {['ABOUT', 'EXPERIENCE', 'PROJECTS', 'CONTACT'].map((item, index) => (
                    <li key={index}>
                        <Link
                            to={item.toLowerCase()}
                            smooth={true}
                            duration={500}
                            offset={-window.innerHeight / 2 + 260}
                            onClick={() => handleClick(index)}
                            className={`${activeIndex === index ? tealt + ' font-bold blur-none' : textGray} hover:${tealt} blur-[0.5px] transition duration-300 ease-in-out cursor-pointer`}
                        >
                            {item}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
