/**
 * Change task channel capacity
 * @params { String } workerSid
 * @params { String } action inc:increment dec:decrement
 */
const Twilio = require('twilio');
exports.handler = async function (context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  try {
    // Get parameters
    const { workerSid, action } = event;
    if (!workerSid || !action) throw new Error('Parameter(s) error.');
    if (!action.match(/inc|dec/)) throw new Error('Parameter(s) error.');

    // Get environment variables
    const { WORKSPACE_SID } = context;

    // Create twilio client
    const client = context.getTwilioClient();

    // Search the voice channel sid
    const workerChannels = await client.taskrouter.v1
      .workspaces(WORKSPACE_SID)
      .workers(workerSid)
      .workerChannels.list();
    console.dir(workerChannels);
    const voiceChannels = workerChannels.filter(
      (channel) => channel.taskChannelUniqueName === 'voice',
    );
    if (voiceChannels.length === 0)
      throw new Error(`This worker haven't a voice channel`);

    // Get current capacity
    const voiceChannel = await client.taskrouter.v1
      .workspaces(WORKSPACE_SID)
      .workers(workerSid)
      .workerChannels(voiceChannels[0].sid)
      .fetch();

    // Update worker's task channel capacity
    await client.taskrouter.v1
      .workspaces(WORKSPACE_SID)
      .workers(workerSid)
      .workerChannels(voiceChannel.sid)
      .update({
        capacity:
          action === 'inc'
            ? voiceChannel.configuredCapacity + 1
            : voiceChannel.configuredCapacity > 1
            ? voiceChannel.configuredCapacity - 1
            : voiceChannel.configuredCapacity,
      });

    response.appendHeader('Content-Type', 'text/plain');
    response.setBody('OK');
    callback(null, response);
  } catch (err) {
    console.error(err.message ? err.message : err);
    response.appendHeader('Content-Type', 'text/plain');
    response.setBody(`Error: ${err.message}`);
    callback(null, response);
  }
};
