const axios = require('axios');
const fs = require('fs');
const ytdl = require('youtube-dl');

let channelLink = `https://www.youtube.com/channel/UCWrW3kmk_mpt4H86OBhleaA/`;
channelLink = channelLink.replace(`https://www.youtube.com/channel/`, ``).replace(`/`, ``)

const getVideos = async (youtubeChannelLink) => {
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?channelId=${channelLink}&part=snippet,id&order=date&maxResults=50&key=${process.env.GOOGLE_API_KEY}`);
    return response.data;
  } catch (e) {
    throw new Error(`Unable to get this channel's videos.`);
  }
}

const downloadVideos = async (youtubeChannelLink) => {
  const videos = await getVideos(youtubeChannelLink);
  for (let x = 0; x < videos.items.length; x++) {
    const video = videos.items[x];
    if (video.id.kind === 'youtube#video' && video.snippet.liveBroadcastContent === 'none') {
      let videoDl = ytdl(`http://www.youtube.com/watch?v=${video.id.videoId}`,
        ['--format=18'], {
          cwd: __dirname
        });


      const dir = `videos`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      videoDl.on('info', function (info) {
        console.log('Download started');
        console.log('filename: ' + info._filename);
        console.log('size: ' + info.size);
      });
      
      videoDl.pipe(fs.createWriteStream(`${dir}/${video.snippet.title}.mp4`));

    }
  }
}

downloadVideos(channelLink);