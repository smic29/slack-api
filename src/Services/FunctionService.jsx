
const FunctionService = {
    groupMessagesByDate: function (messages) {
        const groupedMessages = {};

        messages.forEach((message) => {
            const timestamp = new Date(message.created_at);
            const dateKey = timestamp.toDateString();

            if (!groupedMessages[dateKey]) {
                groupedMessages[dateKey] = [];
            }

            groupedMessages[dateKey].push(message);
        });

        return groupedMessages;
    },

    formatDate: function (dateString) {
        function isSameDay(date1, date2) {
            return (
                date1.getDate() === date2.getDate() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getYear() === date2.getYear()
            );
        };

        function getFormattedDay(date) {
            const day = date.getDate();
            if (day >= 11 && day <= 13) {
                return day + 'th';
            }
            switch (day % 10) {
                case 1:
                    return day + 'st';
                case 2:
                    return day + 'nd';
                case 3:
                    return day + 'rd';
                default:
                    return day + 'th';
            }
        }

        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (isSameDay(date, today)) {
            return 'Today';
        } else if (isSameDay(date, yesterday)) {
            return 'Yesterday';
        } else {
            const options = { weekday: 'long'};
            const options2 = { month: 'long' };
            const FormattedDay = getFormattedDay(date);
            return `
            ${date.toLocaleDateString(undefined, options)}, 
            ${date.toLocaleDateString(undefined, options2)} ${FormattedDay}
            `;
        }
    }
}

export default FunctionService;