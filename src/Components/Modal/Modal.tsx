import React, { useEffect } from "react";
import useLanguageInfo from "../../Hooks/LanguageInfo";
import { getOsTheme } from "../../theme/osTheme";
import { CloseGlyph } from "../os/OsIcons";

interface ModalProps {
    show: boolean;
    onClose: () => void;
    title: string;
    modalData: string;
    darkMode?: boolean;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, title, modalData, darkMode = true }) => {
    const dataInfo = useLanguageInfo(modalData);
    const theme = getOsTheme(darkMode);

    useEffect(() => {
        if (!show) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [show, onClose]);

    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5" style={{ background: "rgba(0,0,0,0.5)" }}>
            <button
                type="button"
                aria-label="Close details"
                onClick={onClose}
                className="absolute inset-0 cursor-default"
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden"
                style={{
                    background: theme.panel,
                    border: `1px solid ${theme.borderStrong}`,
                    borderTop: `2px solid ${theme.accent}`,
                    boxShadow: `0 24px 50px -20px ${theme.shadow}`,
                }}
            >
                <div
                    className="flex h-9 shrink-0 items-center justify-between px-3"
                    style={{ background: theme.titlebarActive, borderBottom: `1px solid ${theme.border}` }}
                >
                    <span className="os-mono text-xs" style={{ color: theme.text }}>
                        {title}
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close details"
                        className="flex h-[18px] w-[18px] items-center justify-center border"
                        style={{ borderColor: theme.borderStrong, color: theme.textMuted }}
                    >
                        <CloseGlyph />
                    </button>
                </div>

                <div className="overflow-auto p-5">
                    <h2 className="os-sans flex items-center justify-start gap-2 text-lg font-semibold" style={{ color: theme.text }}>
                        {dataInfo?.icon}
                        {dataInfo?.title}
                    </h2>

                    <p className="os-sans mt-3 text-sm leading-relaxed" style={{ color: theme.textMuted }}>
                        {dataInfo?.content}
                        {dataInfo?.link && (
                            <a
                                href={dataInfo.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pl-2 underline"
                                style={{ color: theme.accent }}
                            >
                                More info
                            </a>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Modal;
