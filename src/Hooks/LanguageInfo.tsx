import { useState, useEffect, ReactNode } from 'react';
import { FaLaravel, FaPhp, FaReact } from 'react-icons/fa';

interface DataInfo {
    title: string;
    content: string;
    link: string;
    icon?: ReactNode;
}

const useLanguageInfo = (title: string): DataInfo | null => {
    const [dataInfo, setDataInfo] = useState<DataInfo | null>(null);

    useEffect(() => {
        let display: DataInfo;
        switch (title) {
            case 'PHP':
                display = {
                    title: title,
                    content: 'PHP is a general-purpose scripting language geared towards web development. It was originally created by Danish-Canadian programmer Rasmus Lerdorf in 1993 and released in 1995. The PHP reference implementation is now produced by the PHP Group.',
                    link: 'https://www.php.net/',
                    icon: <FaPhp className="text-teal-100 hover:text-teal-300 transition duration-300" size={50} />
                };
                setDataInfo(display);
                break;
            case 'Laravel':
                display = {
                    title: title,
                    content: 'Laravel is a free and open-source PHP-based web framework for building web applications. It was created by Taylor Otwell and intended for the development of web applications following the model–view–controller architectural pattern and based on Symfony.',
                    link: 'https://laravel.com/',
                    icon: <FaLaravel className="text-teal-100 hover:text-teal-300 transition duration-300" size={50} />
                };
                setDataInfo(display);
                break;
            case 'React':
                display = {
                    title: title,
                    content: 'React is a free and open-source front-end JavaScript library for building user interfaces based on components by Facebook Inc. It is maintained by Meta and a community of individual developers and companies. React can be used to develop single-page, mobile, or server-rendered applications with frameworks like Next.js.',
                    link: 'https://react.dev/',
                    icon: <FaReact className="text-teal-100 hover:text-teal-300 transition duration-300" size={50} />
                };
                setDataInfo(display);
                break;
            case 'TypeScript':
                display = {
                    title: title,
                    content: 'TypeScript is a free and open-source high-level programming language developed by Microsoft that adds static typing with optional type annotations to JavaScript. It is designed for the development of large applications and transpiles to JavaScript.',
                    link: 'https://www.typescriptlang.org/',
                    icon: ''
                };
                setDataInfo(display);
                break;
            case 'Tailwind':
                display = {
                    title: title,
                    content: 'Tailwind CSS is an open-source CSS framework. Unlike other frameworks, like Bootstrap, it does not provide a series of predefined classes for elements such as buttons or tables. Instead, it creates a list of "utility" CSS classes that can be used to style each element by mixing and matching.',
                    link: 'https://tailwindcss.com/',
                    icon: '',
                };
                setDataInfo(display);
                break;
            case 'JQuery':
                display = {
                    title: title,
                    content: 'jQuery is a JavaScript library designed to simplify HTML DOM tree traversal and manipulation, as well as event handling, CSS animations, and Ajax. It is free, open-source software using the permissive MIT License. As of August 2022, jQuery is used by 77% of the 10 million most popular websites.',
                    link: 'https://jquery.com/',
                    icon: '',
                };
                setDataInfo(display);
                break;
            case 'MySQL':
                display = {
                    title: title,
                    content: 'MySQL is an open-source relational database management system. Its name is a combination of "My", the name of co-founder Michael Widenius"s daughter My, and "SQL", the acronym for Structured Query Language.',
                    link: 'https://www.mysql.com/',
                    icon: '',
                };
                setDataInfo(display);
                break;
            case 'CodeIgniter':
                display = {
                    title: title,
                    content: 'CodeIgniter is a free and open-source software rapid development web framework, for use in building dynamic web sites with PHP.',
                    link: 'https://www.codeigniter.com/',
                    icon: ''
                };
                setDataInfo(display);
                break;
            default:
                display = {
                    title: 'Unknown',
                    content: 'No content available',
                    link: '',
                };
                setDataInfo(display);
                break;
        }
    }, [title]);

    return dataInfo;
};

export default useLanguageInfo;
