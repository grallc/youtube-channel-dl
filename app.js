const argv = require('yargs')
  .usage('Usage : $0 [options]')
  .alias('id', 'channel')
  .nargs('id', 1)
  .describe('id', 'Youtube Channel ID')
  .alias('api', 'key')
  .nargs('api', 1)
  .describe('api', 'Google API Key [Youtube API must be enabled]')
  .demandOption(['id', 'api'])
  .help('h')
  .argv;

const axios = require('axios');
const fs = require('fs');
const ytdl = require('youtube-dl');

let channelLink = argv.id;
channelLink = channelLink.replace(`https://www.youtube.com/channel/`, ``).replace(`/`, ``)

const getVideos = async (youtubeChannelLink) => {
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?channelId=${channelLink}&part=snippet,id&order=date&maxResults=50&key=${argv.api}`);
    return response.data;
  } catch (e) {
    throw new Error(`Unable to get this channel's videos.`);
  }
}

const dir = `videos`;
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
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

      const channelDir = `videos/${video.snippet.channelTitle}`;
      if (!fs.existsSync(channelDir)) {
        fs.mkdirSync(channelDir);
      }
      let infos;

      videoDl.on('info', function (videoInfos) {
        infos = videoInfos;
        console.log(`Started downloading '${videoInfos.title}'... (${videoInfos.size/1000000}Mb)`)
      });
      videoDl.pipe(fs.createWriteStream(`${channelDir}/${(video.snippet.title).replace('/', '\'')}.mp4`));

      videoDl.on('end', function() {
        console.log(`Successfully downloaded and saved '${infos.title}' in '${__dirname}/${channelDir}' !`)
      });



    }
  }
}

downloadVideos(channelLink);