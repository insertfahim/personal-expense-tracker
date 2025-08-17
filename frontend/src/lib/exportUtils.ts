import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import {
    ExpenseStats,
    Expense,
    HeatmapData,
    BudgetComparison,
    ForecastData,
} from "@/types";

// Type for jsPDF with autotable plugin
interface jsPDFWithAutoTable extends jsPDF {
    autoTable: (options: any) => jsPDF;
}

// Helper function to format date
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

// Helper function to get current timestamp for filenames
export const getTimestamp = (): string => {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
        2,
        "0"
    )}${String(now.getDate()).padStart(2, "0")}_${String(
        now.getHours()
    ).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
};

// Export expenses to CSV
export const exportExpensesToCSV = (expenses: Expense[]): void => {
    // Create CSV content
    let csvContent = "Title,Amount,Category,Date,Description\n";

    expenses.forEach((expense) => {
        const row = [
            expense.title,
            expense.amount,
            expense.category,
            formatDate(expense.date),
            expense.description || "",
        ]
            .map((item) => {
                // Handle items with commas by wrapping in quotes
                const itemStr = String(item);
                return itemStr.includes(",") ? `"${itemStr}"` : itemStr;
            })
            .join(",");

        csvContent += row + "\n";
    });

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `expenses_${getTimestamp()}.csv`);
};

// Export expenses to Excel
export const exportExpensesToExcel = (expenses: Expense[]): void => {
    // Prepare data
    const data = expenses.map((expense) => ({
        Title: expense.title,
        Amount: expense.amount,
        Category: expense.category,
        Date: formatDate(expense.date),
        Description: expense.description || "",
    }));

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
    });
    const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `expenses_${getTimestamp()}.xlsx`);
};

// Export expenses to PDF
export const exportExpensesToPDF = (expenses: Expense[]): void => {
    // Create PDF document
    const doc = new jsPDF() as jsPDFWithAutoTable;

    // Add title
    doc.setFontSize(18);
    doc.text("Expense Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare data for table
    const tableColumn = ["Title", "Amount", "Category", "Date", "Description"];
    const tableRows = expenses.map((expense) => [
        expense.title,
        `$${expense.amount.toFixed(2)}`,
        expense.category,
        formatDate(expense.date),
        expense.description || "",
    ]);

    // Create table
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [66, 139, 202] },
    });

    // Save the PDF
    doc.save(`expenses_${getTimestamp()}.pdf`);
};

// Export analytics data to PDF
export const exportAnalyticsToPDF = (stats: ExpenseStats): void => {
    // Create PDF document
    const doc = new jsPDF() as jsPDFWithAutoTable;

    // Add title
    doc.setFontSize(18);
    doc.text("Expense Analytics Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

    // Add summary section
    doc.setFontSize(14);
    doc.text("Summary", 14, 40);

    const summaryData = [
        ["Total Expenses", stats.totalStats.totalExpenses.toString()],
        ["Total Amount", `$${stats.totalStats.totalAmount.toFixed(2)}`],
        ["Average Amount", `$${stats.totalStats.avgAmount.toFixed(2)}`],
    ];

    doc.autoTable({
        head: [["Metric", "Value"]],
        body: summaryData,
        startY: 45,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
    });

    // Add category breakdown
    doc.setFontSize(14);
    doc.text("Category Breakdown", 14, doc.autoTable.previous.finalY + 15);

    const categoryData = stats.categoryStats.map((cat) => [
        cat._id,
        `$${cat.total.toFixed(2)}`,
        cat.count.toString(),
        `$${(cat.total / cat.count).toFixed(2)}`,
    ]);

    doc.autoTable({
        head: [["Category", "Total Amount", "Count", "Average"]],
        body: categoryData,
        startY: doc.autoTable.previous.finalY + 20,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
    });

    // Add monthly breakdown
    doc.setFontSize(14);
    doc.text("Monthly Breakdown", 14, doc.autoTable.previous.finalY + 15);

    const monthlyData = stats.monthlyStats.map((month) => {
        const date = new Date(2024, month._id - 1, 1);
        return [
            date.toLocaleString("default", { month: "long" }),
            `$${month.total.toFixed(2)}`,
            month.count.toString(),
        ];
    });

    doc.autoTable({
        head: [["Month", "Total Amount", "Count"]],
        body: monthlyData,
        startY: doc.autoTable.previous.finalY + 20,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
    });

    // Save the PDF
    doc.save(`analytics_${getTimestamp()}.pdf`);
};

// Export heatmap data to PDF
export const exportHeatmapToPDF = (data: HeatmapData): void => {
    // Create PDF document
    const doc = new jsPDF() as jsPDFWithAutoTable;

    // Add title
    doc.setFontSize(18);
    doc.text("Expense Heatmap Report", 14, 22);
    doc.setFontSize(11);

    const periodText = data.period.month
        ? `${new Date(2000, data.period.month - 1).toLocaleString("default", {
              month: "long",
          })} ${data.period.year}`
        : `Year ${data.period.year}`;

    doc.text(`Period: ${periodText}`, 14, 30);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 36);

    // Add summary section
    doc.setFontSize(14);
    doc.text("Summary", 14, 46);

    const summaryData = [
        ["Total Spent", `$${data.stats.totalSpent.toFixed(2)}`],
        ["Total Days with Expenses", data.stats.totalDays.toString()],
        ["Average Per Day", `$${data.stats.avgPerDay.toFixed(2)}`],
        [
            "Highest Spending Day",
            `${formatDate(
                data.stats.maxDay.date
            )} ($${data.stats.maxDay.value.toFixed(2)})`,
        ],
    ];

    doc.autoTable({
        head: [["Metric", "Value"]],
        body: summaryData,
        startY: 50,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
    });

    // Add weekday breakdown
    doc.setFontSize(14);
    doc.text("Weekday Analysis", 14, doc.autoTable.previous.finalY + 15);

    const weekdayData = data.weekdayStats
        .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
        .map((day) => [
            day.name,
            `$${day.total.toFixed(2)}`,
            day.count.toString(),
            `$${day.average.toFixed(2)}`,
        ]);

    doc.autoTable({
        head: [["Day", "Total Amount", "Count", "Average"]],
        body: weekdayData,
        startY: doc.autoTable.previous.finalY + 20,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
    });

    // Add daily data (top 10 days)
    doc.setFontSize(14);
    doc.text("Top Spending Days", 14, doc.autoTable.previous.finalY + 15);

    const topDays = [...data.heatmap]
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)
        .map((day) => [
            formatDate(day.date),
            `$${day.value.toFixed(2)}`,
            day.count.toString(),
        ]);

    doc.autoTable({
        head: [["Date", "Amount", "Transactions"]],
        body: topDays,
        startY: doc.autoTable.previous.finalY + 20,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
    });

    // Save the PDF
    doc.save(`heatmap_${getTimestamp()}.pdf`);
};

// Export budget comparison to PDF
export const exportBudgetComparisonToPDF = (data: BudgetComparison): void => {
    // Create PDF document
    const doc = new jsPDF() as jsPDFWithAutoTable;

    // Add title
    doc.setFontSize(18);
    doc.text("Budget Comparison Report", 14, 22);
    doc.setFontSize(11);

    const periodText = `${new Date(2000, data.period.month - 1).toLocaleString(
        "default",
        { month: "long" }
    )} ${data.period.year}`;
    doc.text(`Period: ${periodText}`, 14, 30);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 36);

    // Add summary section
    doc.setFontSize(14);
    doc.text("Summary", 14, 46);

    const summaryData = [
        ["Total Budget", `$${data.totals.budgetAmount.toFixed(2)}`],
        ["Actual Spending", `$${data.totals.actualAmount.toFixed(2)}`],
        ["Remaining", `$${data.totals.remaining.toFixed(2)}`],
        ["Usage Percentage", `${data.totals.percentage.toFixed(1)}%`],
    ];

    doc.autoTable({
        head: [["Metric", "Value"]],
        body: summaryData,
        startY: 50,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
    });

    // Add category breakdown
    doc.setFontSize(14);
    doc.text("Category Breakdown", 14, doc.autoTable.previous.finalY + 15);

    const categoryData = data.comparison.map((cat) => [
        cat.category,
        `$${cat.budgetAmount.toFixed(2)}`,
        `$${cat.actualAmount.toFixed(2)}`,
        `$${cat.remaining.toFixed(2)}`,
        `${cat.percentage.toFixed(1)}%`,
    ]);

    doc.autoTable({
        head: [["Category", "Budget", "Actual", "Remaining", "Usage %"]],
        body: categoryData,
        startY: doc.autoTable.previous.finalY + 20,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
    });

    // Save the PDF
    doc.save(`budget_comparison_${getTimestamp()}.pdf`);
};

// Export forecast data to PDF
export const exportForecastToPDF = (data: ForecastData): void => {
    // Create PDF document
    const doc = new jsPDF() as jsPDFWithAutoTable;

    // Add title
    doc.setFontSize(18);
    doc.text("Spending Forecast Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

    // Add trend information
    doc.setFontSize(14);
    doc.text("Trend Analysis", 14, 40);

    const trendData = [
        [
            "Spending Trend",
            data.trend === "increasing" ? "Increasing ↑" : "Decreasing ↓",
        ],
        ["Forecast Confidence", `${Math.round(data.confidence * 100)}%`],
    ];

    doc.autoTable({
        head: [["Metric", "Value"]],
        body: trendData,
        startY: 45,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
    });

    // Add forecast data
    doc.setFontSize(14);
    doc.text("Monthly Forecast", 14, doc.autoTable.previous.finalY + 15);

    const forecastData = data.forecast.map((month) => [
        `${month.monthName} ${month.year}`,
        `$${month.predicted.toFixed(2)}`,
    ]);

    doc.autoTable({
        head: [["Month", "Predicted Amount"]],
        body: forecastData,
        startY: doc.autoTable.previous.finalY + 20,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
    });

    // Add category forecast
    doc.setFontSize(14);
    doc.text("Category Forecast", 14, doc.autoTable.previous.finalY + 15);

    const categoryData = data.categoryForecasts
        .sort((a, b) => b.nextMonth - a.nextMonth)
        .map((cat) => [
            cat.category,
            `$${cat.nextMonth.toFixed(2)}`,
            cat.trend === "increasing" ? "Increasing ↑" : "Decreasing ↓",
            `${Math.round(cat.confidence * 100)}%`,
        ]);

    doc.autoTable({
        head: [["Category", "Next Month", "Trend", "Confidence"]],
        body: categoryData,
        startY: doc.autoTable.previous.finalY + 20,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
    });

    // Save the PDF
    doc.save(`forecast_${getTimestamp()}.pdf`);
};
