const axios = require('axios');
const fs = require('fs');
const ytdl = require('youtube-dl');

let channelLink = `https://www.youtube.com/channel/UCWrW3kmk_mpt4H86OBhleaA/`;
channelLink = channelLink.replace(`https://www.youtube.com/channel/`, ``).replace(`/`, ``)

const getVideos = async (youtubeChannelLink) => {
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?channelId=${channelLink}&part=snippet,id&order=date&maxResults=20&key=${process.env.GOOGLE_API_KEY}`);
    return response.data;
  } catch (e) {
    throw new Error(`Unable to get this channel's videos.`);
  }
}



const downloadVideos = async (youtubeChannelLink) => {
  
}

getVideos(channelLink).then((response) => {
  console.log(response);
}).catch((e) => {
  console.log(e.message);
})