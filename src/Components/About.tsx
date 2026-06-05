import React from 'react';

const About: React.FC = () => {
    return (
        <>
            <div className="flex items-center">
                <h2 className="text-center text-gray-300 text-xl font-medium mt-[30px] mb-5 lg:hidden">
                    About
                </h2>
            </div>
            <div className="text-gray-400 text-lg mt-6 max-w-prose space-y-5">
                <p>
                    As a dedicated software developer with four years of professional experience, I have cultivated a strong foundation in coding and problem-solving. My educational background includes a Bachelor of Science in Information Technology (BSIT), complemented by two years of focused study in Computer Science.
                </p>
                <p>
                    Beyond my professional life, I have a deep enthusiasm for gaming and travel. Gaming helps me think strategically and stay curious about technology, while travel gives me new perspectives that support creative problem-solving.
                </p>
                <p>
                    I am always eager to take on new challenges and continuously expand my expertise in software development. My goal is to contribute meaningful tools and practical solutions that help people work better.
                </p>
            </div>
        </>
    );
};

export default About;
