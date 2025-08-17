"use client";

import React, { useState, useRef } from "react";
import { Download, FileText, FileSpreadsheet, ChevronDown } from "lucide-react";

interface ExportButtonProps {
    onExportCSV?: () => void;
    onExportExcel?: () => void;
    onExportPDF?: () => void;
    disabled?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({
    onExportCSV,
    onExportExcel,
    onExportPDF,
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const handleExport = (
        exportFn: (() => void) | undefined,
        format: string
    ) => {
        if (exportFn) {
            try {
                exportFn();
            } catch (error) {
                console.error(`Error exporting to ${format}:`, error);
                alert(`Failed to export to ${format}. Please try again.`);
            }
        }
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                disabled={disabled}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    disabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
                <Download className="h-4 w-4" />
                <span>Export</span>
                <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                    <div className="py-1">
                        {onExportCSV && (
                            <button
                                onClick={() => handleExport(onExportCSV, "CSV")}
                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <FileText className="h-4 w-4 mr-2 text-green-600" />
                                Export as CSV
                            </button>
                        )}
                        {onExportExcel && (
                            <button
                                onClick={() =>
                                    handleExport(onExportExcel, "Excel")
                                }
                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <FileSpreadsheet className="h-4 w-4 mr-2 text-blue-600" />
                                Export as Excel
                            </button>
                        )}
                        {onExportPDF && (
                            <button
                                onClick={() => handleExport(onExportPDF, "PDF")}
                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <FileText className="h-4 w-4 mr-2 text-red-600" />
                                Export as PDF
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExportButton;
