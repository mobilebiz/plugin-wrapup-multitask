import * as Flex from '@twilio/flex-ui';
import { ITask, Manager } from '@twilio/flex-ui';
import axios from 'axios';

// Get environment variables
const { FLEX_APP_FUNCTIONS_DOMAIN } = process.env;

export default function completedAction(manager: Flex.Manager) {
  manager.events.addListener('taskCompleted', async (task: ITask) => {
    if (task.channelType === 'voice') {
      console.log(`🐸 taskCompleted`);
      console.dir(task);
      const url = `https://${FLEX_APP_FUNCTIONS_DOMAIN}/change-capacity?workerSid=${task.workerSid}&action=dec`;
      const res = await axios.post(url);
      console.log(`🐸 taskWrapup capacity decremented.`);
    }
  });
}
