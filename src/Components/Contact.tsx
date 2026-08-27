import React, { useState } from "react";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import emailjs from "emailjs-com";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getOsTheme, OsTheme } from "../theme/osTheme";

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

interface ContactProps {
  darkMode?: boolean;
}

const Contact: React.FC<ContactProps> = ({ darkMode = true }) => {
  const theme = getOsTheme(darkMode);
  const [formData, setFormData] = useState<FormData>({ name: "", phone: "", email: "", message: "" });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = (data: FormData): FormErrors => {
    const errors: FormErrors = {};
    if (!data.name.trim()) errors.name = "Name is required";
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email address is invalid";
    }
    if (!data.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(data.phone)) {
      errors.phone = "Phone number is invalid. It should be 10-15 digits long.";
    }
    if (!data.message.trim()) errors.message = "Message is required";
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validate(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      emailjs
        .send(
          "service_ohf7tvo",
          "template_z5bw03j",
          {
            to_name: "Marvin Mosico",
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
          },
          "5W3ReZn8Qi7NCL4Vj"
        )
        .then(() => {
          toast.success("Message sent successfully!");
          setFormData({ name: "", email: "", phone: "", message: "" });
        })
        .catch(() => {
          toast.error("Failed to send message.");
        })
        .finally(() => setLoading(false));
    } else {
      toast.error("Please fill up all input fields in the form.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* compose form */}
        <div className="flex-1 min-w-0">
          <div className="os-mono text-xs tracking-widest" style={{ color: theme.accent }}>
            {"// GET IN TOUCH"}
          </div>
          <h2 className="os-sans mt-2 text-2xl font-bold" style={{ color: theme.text }}>
            Send a message
          </h2>
          <p className="os-sans mt-2 text-sm max-w-md" style={{ color: theme.textMuted }}>
            I build practical tools for teams that need reliable workflows. Open to new systems and collaborations.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
            <Field label="name" theme={theme} error={formErrors.name}>
              <input
                name="name"
                type="text"
                placeholder="jane doe"
                value={formData.name}
                onChange={handleChange}
                className="os-mono w-full bg-transparent text-sm outline-none placeholder:opacity-40"
                style={{ color: theme.text }}
                aria-invalid={!!formErrors.name}
              />
            </Field>

            <Field label="phone" theme={theme} error={formErrors.phone}>
              <input
                name="phone"
                type="tel"
                placeholder="09171234567"
                value={formData.phone}
                onChange={handleChange}
                className="os-mono w-full bg-transparent text-sm outline-none placeholder:opacity-40"
                style={{ color: theme.text }}
                aria-invalid={!!formErrors.phone}
              />
            </Field>

            <Field label="email" theme={theme} error={formErrors.email}>
              <input
                name="email"
                type="email"
                placeholder="jane@company.com"
                value={formData.email}
                onChange={handleChange}
                className="os-mono w-full bg-transparent text-sm outline-none placeholder:opacity-40"
                style={{ color: theme.text }}
                aria-invalid={!!formErrors.email}
              />
            </Field>

            <Field label="message" theme={theme} error={formErrors.message}>
              <textarea
                name="message"
                placeholder="tell me about your project or role..."
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="os-mono w-full bg-transparent text-sm outline-none resize-none placeholder:opacity-40"
                style={{ color: theme.text }}
                aria-invalid={!!formErrors.message}
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="os-mono self-start px-5 py-3 text-xs font-semibold transition disabled:opacity-60"
              style={{ background: theme.accent, color: theme.panel }}
            >
              {loading ? "$ sending..." : "$ send_message --to=marvin"}
            </button>
          </form>
        </div>

        {/* channels */}
        <div className="md:w-64 shrink-0 md:pl-6 md:border-l" style={{ borderColor: theme.border }}>
          <div className="os-mono text-[10px] tracking-wide mb-3" style={{ color: theme.accent }}>
            DIRECT CHANNELS
          </div>

          <div className="flex flex-col gap-2.5">
            <ChannelRow href="mailto:marvinmosicoo@gmail.com" icon={<FaEnvelope size={14} />} label="Email" value="marvinmosicoo@gmail.com" theme={theme} />
            <ChannelRow
              href="https://www.linkedin.com/in/marvin-mosico-0b1467210/"
              icon={<FaLinkedin size={14} />}
              label="LinkedIn"
              value="/in/marvin-mosico-0b1467210"
              theme={theme}
            />
            <ChannelRow href="https://github.com/MarvinMosiCoder" icon={<FaGithub size={14} />} label="GitHub" value="MarvinMosiCoder" theme={theme} />
          </div>

          <div className="h-px my-4" style={{ background: theme.border }} />

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: theme.accent }} />
            <span className="os-mono text-xs font-semibold" style={{ color: theme.text }}>
              AVAILABLE
            </span>
          </div>
          <p className="os-sans text-xs mt-2 leading-relaxed" style={{ color: theme.textDim }}>
            Open for web applications, dashboards, and internal business systems.
          </p>
        </div>
      </div>
    </>
  );
};

function Field({
  label,
  theme,
  error,
  children,
}: {
  label: string;
  theme: OsTheme;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="os-mono flex items-center gap-1.5 text-[11px] uppercase tracking-wide mb-1.5" style={{ color: theme.textMuted }}>
        <span style={{ color: theme.accent }}>&gt;</span>
        {label}
      </div>
      <div className="px-3.5 py-3" style={{ border: `1px solid ${error ? "#e05d5d" : theme.border}`, background: theme.bg }}>
        {children}
      </div>
      {error && (
        <p className="os-mono mt-1 text-xs" style={{ color: "#e05d5d" }}>
          {error}
        </p>
      )}
    </div>
  );
}

function ChannelRow({
  href,
  icon,
  label,
  value,
  theme,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  theme: OsTheme;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
      className="flex items-center gap-3 p-2.5 transition-colors"
      style={{ border: `1px solid ${theme.border}` }}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center"
        style={{ border: `1px solid ${theme.chipBorder}`, color: theme.text }}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="os-sans block text-xs font-semibold" style={{ color: theme.text }}>
          {label}
        </span>
        <span className="os-mono block text-[11px] truncate" style={{ color: theme.textDim }}>
          {value}
        </span>
      </span>
    </a>
  );
}

export default Contact;
