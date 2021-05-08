"use strict";
const channelData = require('./channelData.js'),
    playlistData = require('./playlistData.js'),
    channelCodes = require('./channelCodes'),
    nameParser = require('./nameParser.js'),
    clock = require('./clock.js'),
    START_TIME = 1595199600, // 2020-07-20 00:00:00
    MIN_SCHEDULE_LENGTH = 60 * 60,
    MAX_SCHEDULE_LENGTH = 24 * 60 * 60;

function getShowListForChannel(channelNameOrCode) {
    const showsForPredefinedChannel = channelData.getShows().filter(show => show.channels.includes(channelNameOrCode));

    if (showsForPredefinedChannel.length) {
        return showsForPredefinedChannel;

    } else {
        const showIndexes = channelCodes.buildShowIndexesFromChannelCode(channelNameOrCode);
        return channelData.getShows().filter(show => showIndexes.includes(show.index));
    }
}

function getFullScheduleFromShowList(showListForChannel) {
    const showsToFiles = {};

    showListForChannel.forEach(show => {
        showsToFiles[show.name] = [];
        show.playlists.forEach(playlistName => {
            const playlist = playlistData.getPlaylist(playlistName);
            playlist.files.forEach(fileMetadata => {
                const readableName = nameParser.parseName(playlistName, fileMetadata);
                showsToFiles[show.name].push({
                    url: `https://${playlist.server}/${playlist.dir}/${fileMetadata.name}`,
                    archivalUrl: `https://archive.org/download/${playlistName}/${fileMetadata.name}`,
                    length: Number(fileMetadata.length),
                    name: readableName
                });
            });
        });
    });

    return showsToFiles[Object.keys(showsToFiles)[0]];
}

function getCurrentSchedule(fullSchedule, lengthInSeconds) {
    return fullSchedule;
}

module.exports = {
    getScheduleForChannel(channelNameOrCode, lengthInSeconds) {
        const showListForChannel = getShowListForChannel(channelNameOrCode);
            const fullSchedule = getFullScheduleFromShowList(showListForChannel),
            currentSchedule = getCurrentSchedule(fullSchedule, lengthInSeconds);

        return currentSchedule;
    }
}