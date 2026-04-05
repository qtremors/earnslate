/**
 * Generates a CSV string from headers and data rows.
 * Handles escaping of special characters (quotes, commas, newlines).
 */
export const generateCSV = (headers: string[], rows: (string | number)[][]): string => {
    const escapeField = (field: string | number): string => {
        const str = String(field);
        // If field contains quotes, comma, or newline, wrap in quotes and escape existing quotes
        if (str.includes('"') || str.includes(',') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const headerRow = headers.map(escapeField).join(',');
    const dataRows = rows.map(row => row.map(escapeField).join(','));

    return [headerRow, ...dataRows].join('\n');
};

/**
 * Triggers a download of the CSV content.
 */
export const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
