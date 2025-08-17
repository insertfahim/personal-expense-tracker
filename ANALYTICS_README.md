# Analytics Dashboard Documentation

## Overview

The Analytics Dashboard provides comprehensive insights into your spending patterns and financial habits. This feature-rich dashboard includes interactive charts, detailed statistics, and actionable financial insights.

## Features

### 📊 Visual Analytics

-   **Category Breakdown Pie Chart**: Interactive pie chart showing spending distribution across categories
-   **Monthly Spending Trends**: Bar chart displaying spending patterns over time
-   **Responsive Design**: Fully responsive for desktop, tablet, and mobile devices

### 📈 Key Metrics

-   **Total Spent**: Your total expense amount across all categories
-   **Total Expenses**: Number of expense entries
-   **Average Amount**: Average spending per expense
-   **Top Category**: Your highest spending category

### 🎯 Smart Insights

-   **Spending Trends**: Month-over-month comparison with percentage changes
-   **Category Analysis**: Detailed breakdown with counts, totals, and percentages
-   **Progress Indicators**: Visual progress bars for category spending

## Dashboard Sections

### Summary Cards

Four key metric cards at the top provide quick insights:

1. **Total Spent** - Total amount with trend indicator
2. **Total Expenses** - Count of all expenses
3. **Average Amount** - Average expense amount
4. **Top Category** - Highest spending category with amount

### Interactive Charts

1. **Category Distribution Pie Chart**

    - Visual representation of spending by category
    - Color-coded segments for easy identification
    - Hover tooltips with detailed amounts
    - Legend for category identification

2. **Monthly Spending Bar Chart**
    - Monthly spending trends over time
    - Interactive tooltips with exact amounts
    - Easy identification of high/low spending months

### Detailed Category Table

Comprehensive table showing:

-   Category name with color indicator
-   Total amount spent
-   Number of expenses
-   Average amount per expense
-   Percentage of total spending
-   Visual progress bars

## Data Sources

The analytics dashboard pulls data from:

-   **Expense Statistics API** (`/api/expenses/stats`)
-   **Real-time Data**: Updates when expenses are added/modified
-   **Historical Data**: Shows trends across different time periods

## API Integration

### Stats Endpoint Response

```json
{
    "success": true,
    "data": {
        "categoryStats": [
            {
                "_id": "Food",
                "total": 250.75,
                "count": 8
            }
        ],
        "monthlyStats": [
            {
                "_id": 8,
                "total": 445.5,
                "count": 12
            }
        ],
        "totalStats": {
            "totalAmount": 1250.0,
            "totalExpenses": 25,
            "avgAmount": 50.0
        }
    }
}
```

## Error Handling

The dashboard includes robust error handling:

-   **Loading States**: Shows spinner while fetching data
-   **Error Messages**: Clear error display with retry button
-   **Empty States**: Helpful messages when no data is available
-   **Graceful Degradation**: Works even with incomplete data

## Responsive Design

The dashboard is fully responsive:

-   **Desktop**: Full layout with side-by-side charts
-   **Tablet**: Stacked chart layout
-   **Mobile**: Single-column layout with condensed information

## Color Scheme

Consistent color palette for charts:

-   Blue (#3B82F6) - Primary
-   Green (#10B981) - Success
-   Yellow (#F59E0B) - Warning
-   Red (#EF4444) - Alert
-   Purple (#8B5CF6) - Accent
-   Cyan (#06B6D4) - Info
-   Orange (#F97316) - Secondary

## Getting Started

1. **Add Expenses**: Start by adding some expenses through the "Add Expense" form
2. **View Analytics**: Navigate to `/analytics` to see your dashboard
3. **Explore Data**: Click on charts and explore different sections
4. **Refresh Data**: Use the refresh button to update analytics

## Technical Implementation

### Frontend Technologies

-   **React + TypeScript**: Type-safe component development
-   **Recharts**: Interactive chart library
-   **Tailwind CSS**: Utility-first styling
-   **Next.js**: React framework with SSR support

### Chart Libraries

-   **Recharts PieChart**: Category distribution visualization
-   **Recharts BarChart**: Monthly trend visualization
-   **ResponsiveContainer**: Automatic chart resizing

### State Management

-   **Custom Hooks**: `useExpenseStats` for data fetching
-   **React useMemo**: Optimized data processing
-   **Real-time Updates**: Automatic refresh capabilities

### Performance Optimizations

-   **Memoized Calculations**: Expensive computations cached
-   **Lazy Loading**: Charts load only when needed
-   **Efficient Re-renders**: Minimal component updates

## Sample Data

To test the analytics dashboard with sample data, you can:

1. Use the "Add Expense" form to manually add expenses
2. Run the sample data script (if available)
3. Import data from existing expense tracking apps

## Future Enhancements

Planned features for future versions:

-   **Date Range Filtering**: Custom date range selection
-   **Export Functionality**: Download charts and reports
-   **Budget Tracking**: Set and monitor spending budgets
-   **Savings Goals**: Track progress toward savings targets
-   **Advanced Filtering**: Filter by amount, date, or custom criteria
-   **Comparison Views**: Year-over-year comparisons
-   **Predictive Analytics**: Spending forecasts and trends

## Troubleshooting

### Common Issues

1. **No Data Showing**: Ensure expenses are added first
2. **Charts Not Loading**: Check network connection and API status
3. **Incorrect Statistics**: Refresh the page to update data

### Development Issues

1. **Import Errors**: Ensure all dependencies are installed
2. **TypeScript Errors**: Check type definitions
3. **Build Errors**: Verify component imports and exports

For more help, check the main README.md file or create an issue in the repository.
