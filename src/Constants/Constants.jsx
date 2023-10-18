export const API_URL = 'http://206.189.91.54/api/v1'

export function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }

    return date.toLocaleString(undefined, options);
}