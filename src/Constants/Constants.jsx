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

export function timeSince(timestamp) {
    const now = new Date();
    const resDate = new Date(timestamp);

    const millis = now - resDate;

    if (millis < 1000) {
        return 'Just now';
    }

    const seconds = Math.floor(millis / 1000);
    if (seconds < 60) {
        return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`
    }

    const days = Math.floor(hours / 24);
    if (days < 7) {
        return `${days} day${days === 1 ? '' : 's'} ago`
    }

    const moreThanAWeek = { year: 'numeric', month: 'short', day: 'numeric'}
    return resDate.toLocaleDateString(undefined, moreThanAWeek);

}