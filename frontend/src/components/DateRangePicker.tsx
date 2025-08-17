"use client";

import React, { useState } from "react";
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { Calendar, ChevronDown, X } from "lucide-react";

interface DateRangePickerProps {
    startDate: Date | null;
    endDate: Date | null;
    onDateChange: (startDate: Date | null, endDate: Date | null) => void;
}

type DatePreset = {
    label: string;
    value: () => { start: Date; end: Date };
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({
    startDate,
    endDate,
    onDateChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const datePresets: DatePreset[] = [
        {
            label: "Last 7 days",
            value: () => ({
                start: subDays(new Date(), 7),
                end: new Date(),
            }),
        },
        {
            label: "Last 30 days",
            value: () => ({
                start: subDays(new Date(), 30),
                end: new Date(),
            }),
        },
        {
            label: "This month",
            value: () => ({
                start: startOfMonth(new Date()),
                end: new Date(),
            }),
        },
        {
            label: "Last month",
            value: () => {
                const lastMonth = subMonths(new Date(), 1);
                return {
                    start: startOfMonth(lastMonth),
                    end: endOfMonth(lastMonth),
                };
            },
        },
        {
            label: "Last 3 months",
            value: () => ({
                start: subMonths(new Date(), 3),
                end: new Date(),
            }),
        },
        {
            label: "This year",
            value: () => ({
                start: new Date(new Date().getFullYear(), 0, 1),
                end: new Date(),
            }),
        },
    ];

    const handlePresetClick = (preset: DatePreset) => {
        const { start, end } = preset.value();
        onDateChange(start, end);
        setIsOpen(false);
    };

    const clearDates = () => {
        onDateChange(null, null);
        setIsOpen(false);
    };

    const formatDateRange = () => {
        if (!startDate && !endDate) return "All Time";
        if (startDate && !endDate)
            return `Since ${format(startDate, "MMM d, yyyy")}`;
        if (!startDate && endDate)
            return `Until ${format(endDate, "MMM d, yyyy")}`;
        return `${format(startDate, "MMM d, yyyy")} - ${format(
            endDate,
            "MMM d, yyyy"
        )}`;
    };

    return (
        <div className="relative">
            <div
                className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                    {formatDateRange()}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border z-10">
                    <div className="p-3 border-b">
                        <div className="flex justify-between items-center">
                            <h3 className="font-medium text-gray-700">
                                Select Date Range
                            </h3>
                            <button
                                onClick={clearDates}
                                className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                            >
                                <X className="h-3 w-3 mr-1" /> Clear
                            </button>
                        </div>
                    </div>
                    <div className="p-3">
                        <div className="space-y-2">
                            {datePresets.map((preset, index) => (
                                <button
                                    key={index}
                                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                                    onClick={() => handlePresetClick(preset)}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-3 border-t">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full border rounded-md px-2 py-1 text-sm"
                                    value={
                                        startDate
                                            ? format(startDate, "yyyy-MM-dd")
                                            : ""
                                    }
                                    onChange={(e) => {
                                        const date = e.target.value
                                            ? new Date(e.target.value)
                                            : null;
                                        onDateChange(date, endDate);
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full border rounded-md px-2 py-1 text-sm"
                                    value={
                                        endDate
                                            ? format(endDate, "yyyy-MM-dd")
                                            : ""
                                    }
                                    onChange={(e) => {
                                        const date = e.target.value
                                            ? new Date(e.target.value)
                                            : null;
                                        onDateChange(startDate, date);
                                    }}
                                    min={
                                        startDate
                                            ? format(startDate, "yyyy-MM-dd")
                                            : undefined
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="p-3 border-t flex justify-end">
                        <button
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                            onClick={() => setIsOpen(false)}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangePicker;
