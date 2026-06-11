import React, { useState } from 'react';
import { FaCommentAlt, FaEnvelope, FaGithub, FaLinkedin, FaPaperPlane, FaPhone, FaUser } from 'react-icons/fa';
import emailjs from 'emailjs-com';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
    name: string;
    phone: string;
    email: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
}

const Contact: React.FC<any> = ({ darkMode }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: '',
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState<boolean>(false);

    const validate = (data: FormData): FormErrors => {
        const errors: FormErrors = {};
    
        if (!data.name.trim()) {
            errors.name = 'Name is required';
        }
    
        if (!data.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = 'Email address is invalid';
        }
    
        if (!data.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!/^\d{10,15}$/.test(data.phone)) {
            errors.phone = 'Phone number is invalid. It should be 10-15 digits long.';
        }
    
        if (!data.message.trim()) {
            errors.message = 'Message is required';
        }
    
        return errors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = validate(formData);
        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            setLoading(true);
            const to = 'Marvin Mosico';
            emailjs.send(
                'service_ohf7tvo',      // Replace with your service ID
                'template_z5bw03j',      // Replace with your template ID
                {
                    to_name: to,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                },
                '5W3ReZn8Qi7NCL4Vj'            // Replace with your user ID
            )
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                toast.success('Message sent successfully!');
                setFormData({ name: '', email: '', phone: '', message: '' });
            })
            .catch((error) => {
                console.log('FAILED...', error);
                toast.error('Failed to send message.');
            }).finally(() => {
                setLoading(false);
            });;

            setFormData({
                name: '',
                phone: '',
                email: '',
                message: '',
            });
        }else {
            toast.error('Please fill up all input fields in the form.');
        }
    };

    return (
      <>
        <ToastContainer />
        <div className="pb-8">
            <div className="text-center mb-6">
                <h2 className="brand-gradient-text text-center items-center text-3xl font-bold mt-4">
                Get in touch
                </h2>
                <span className="brand-gradient-text text-center items-center text-sm font-medium mt-[30px]">
                Let's talk about your project
                </span>
            </div>

            <div className="mb-6 grid gap-3 md:grid-cols-3">
                <ContactLink
                    href="mailto:marvinmosicoo@gmail.com"
                    icon={<FaEnvelope size={16} />}
                    label="Email"
                    value="marvinmosicoo@gmail.com"
                    darkMode={darkMode}
                />
                <ContactLink
                    href="https://www.linkedin.com/in/marvin-mosico-0b1467210/"
                    icon={<FaLinkedin size={16} />}
                    label="LinkedIn"
                    value="Marvin Mosico"
                    darkMode={darkMode}
                />
                <ContactLink
                    href="https://github.com/MarvinMosiCoder"
                    icon={<FaGithub size={16} />}
                    label="GitHub"
                    value="MarvinMosiCoder"
                    darkMode={darkMode}
                />
            </div>

            <form onSubmit={handleSubmit} noValidate>
                {/* Row of three inputs */}
                <div className="flex flex-col gap-5 mb-6 lg:flex-row">
                {/* Name */}
                <div className="w-full relative">
                    <FaUser className={`absolute left-0 top-3 ${darkMode ? "text-cyan-400" : "text-teal-600"}`} size={18} />
                    <input
                    name="name"
                    type="text"
                    placeholder="Your name"
                    className={`w-full bg-transparent text-sm text-gray-900 ${darkMode ? 'dark:text-gray-100' : 'dark:text-gray-600' } pl-7 pr-2 py-2
                    border-0 border-b-2 ${
                        formErrors.name ? "border-red-500" : darkMode ? "border-cyan-400/70" : "border-teal-600/70"
                    } brand-focus focus:outline-none focus:ring-0 placeholder-gray-400`}
                    value={formData.name}
                    onChange={handleChange}
                    aria-invalid={!!formErrors.name}
                    aria-describedby="name-error"
                    />
                    {formErrors.name && (
                    <p id="name-error" className="mt-1 text-xs text-red-500">
                        {formErrors.name}
                    </p>
                    )}
                </div>

                {/* Phone */}
                <div className="w-full relative">
                    <FaPhone className={`absolute left-0 top-3 ${darkMode ? "text-cyan-400" : "text-teal-600"}`} size={18} />
                    <input
                    name="phone"
                    type="tel"
                    placeholder="Your phone number"
                    className={`w-full bg-transparent text-sm text-gray-900 ${darkMode ? 'dark:text-gray-100' : 'dark:text-gray-600' }  pl-7 pr-2 py-2
                    border-0 border-b-2 
                    ${
                        formErrors.phone ? "border-red-500" : darkMode ? "border-cyan-400/70" : "border-teal-600/70"
                    } brand-focus focus:outline-none focus:ring-0 placeholder-gray-400`}
                    value={formData.phone}
                    onChange={handleChange}
                    aria-invalid={!!formErrors.phone}
                    aria-describedby="phone-error"
                    />
                    {formErrors.phone && (
                    <p id="phone-error" className="mt-1 text-xs text-red-500">
                        {formErrors.phone}
                    </p>
                    )}
                </div>

                {/* Email */}
                <div className="w-full relative">
                    <FaEnvelope className={`absolute left-0 top-3 ${darkMode ? "text-cyan-400" : "text-teal-600"}`} size={18} />
                    <input
                    name="email"
                    type="email"
                    placeholder="Your email"
                    className={`w-full bg-transparent text-sm text-gray-900 ${darkMode ? 'dark:text-gray-100' : 'dark:text-gray-600' } pl-7 pr-2 py-2
                    border-0 border-b-2 ${
                        formErrors.email ? "border-red-500" : darkMode ? "border-cyan-400/70" : "border-teal-600/70"
                    } brand-focus focus:outline-none focus:ring-0 placeholder-gray-400`}
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={!!formErrors.email}
                    aria-describedby="email-error"
                    />
                    {formErrors.email && (
                    <p id="email-error" className="mt-1 text-xs text-red-500">
                        {formErrors.email}
                    </p>
                    )}
                </div>
                </div>

                {/* Message */}
                <div className="relative">
                <FaCommentAlt className={`absolute left-0 top-3 ${darkMode ? "text-cyan-400" : "text-teal-600"}`} size={18} />
                <textarea
                    name="message"
                    id="message"
                    placeholder="Your message"
                    className={`block w-full h-32 bg-transparent text-sm text-gray-900 ${darkMode ? 'dark:text-gray-100' : 'dark:text-gray-600' } pl-7 pr-2 py-2
                    border-0 border-b-2 ${
                    formErrors.message ? "border-red-500" : darkMode ? "border-cyan-400/70" : "border-teal-600/70"
                    } brand-focus focus:outline-none focus:ring-0 placeholder-gray-400`}
                    value={formData.message}
                    onChange={handleChange}
                    aria-invalid={!!formErrors.message}
                    aria-describedby="message-error"
                />
                {formErrors.message && (
                    <p id="message-error" className="mt-1 text-xs text-red-500">
                    {formErrors.message}
                    </p>
                )}
                </div>

                {/* Submit */}
                <div className="mt-4 flex justify-end">
                <button
                    disabled={loading}
                    type="submit"
                    className={`inline-flex items-center gap-2 rounded-md border px-6 py-2 text-sm font-semibold transition-colors duration-300 disabled:opacity-60 ${
                        darkMode
                            ? "border-cyan-300/60 text-cyan-300 hover:border-cyan-300 hover:bg-cyan-300/10"
                            : "border-teal-600/60 text-teal-700 hover:border-teal-600 hover:bg-teal-600/10"
                    }`}
                >
                    <FaPaperPlane size={14} />
                    {loading ? "Sending..." : "Send"}
                </button>
                </div>
            </form>
        </div>
    </>
    );
};

function ContactLink({
    href,
    icon,
    label,
    value,
    darkMode,
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
    value: string;
    darkMode: boolean;
}) {
    return (
        <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
            className={`brand-glow-card rounded-md border p-3 transition-all duration-300 ${
                darkMode
                    ? "border-cyan-300/10 bg-neutral-950 text-gray-200 hover:border-cyan-300/30 hover:bg-neutral-900"
                    : "border-teal-500/15 bg-white text-neutral-800 hover:border-teal-500/35 hover:bg-white"
            }`}
        >
            <div className="flex items-center gap-2 text-sm font-semibold">
                {icon}
                <span>{label}</span>
            </div>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mt-2 truncate text-xs`}>
                {value}
            </p>
        </a>
    );
}

export default Contact;
