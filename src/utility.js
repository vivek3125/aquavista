// import React from 'react';
// import moment from 'moment';
const moment  = require('moment');

const CATEGORY = [
    'Drama', 'Mystery', 'Romance', 'Science Fiction', 'Fantasy', 'Historical Fiction', 'Horror', 'Thriller', 'Western', 'Biography', 'Autobiography', 
    'Memoir', 'Self-Help', 'Business', 'Health', 'Cooking', 'Travel', 'History', 'Science', 'Psycology', 'Philosophy', 'Religion', 'Art', 'Photography',
    'Sports', 'Gardening', 'Crafts'
];

const getPostedTime = (timestamp) => {
    const dateTime = moment(timestamp);
    const formattedDate = dateTime.format('MMM DD, YYYY');
    const formattedTime = dateTime.format('HH:mm');
    return `${formattedDate}`;   
}

const getPostedTime2 = (timestamp) => {
    const dateTime = moment(timestamp);
    const now = moment();

    const diffDays = now.diff(dateTime, 'days');
    const diffWeeks = now.diff(dateTime, 'weeks');
    const diffMonths = now.diff(dateTime, 'months');
    const diffYears = now.diff(dateTime, 'years');

    if (diffDays === 0) {
        return 'TODAY';
    } else if (diffDays === 1) {
        return 'YESTERDAY';
    } else if (diffDays >= 2 && diffDays <= 6) {
        return `${diffDays} DAY AGO`;
    } else if (diffDays > 6 && diffWeeks < 4) {
        return `${diffWeeks} WEEK AGO`;
    } else if (diffWeeks >= 4 && diffMonths < 12) {
        return `${diffMonths} MONTH AGO`;
    } else if (diffMonths >= 12) {
        return `${diffYears} YEAR AGO`;
    } else {
        return dateTime.format('MMM DD, YYYY');
    }
};

module.exports = {
    CATEGORY, getPostedTime, getPostedTime2
}