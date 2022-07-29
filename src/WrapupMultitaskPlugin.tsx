import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

import wrapupAction from './actions/WrapupAction/WrapupAction';
import completedAction from './actions/CompletedAction/CompletedAction';

// import CustomTaskList from './components/CustomTaskList/CustomTaskList';

const PLUGIN_NAME = 'WrapupMultitaskPlugin';

export default class WrapupMultitaskPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   */
  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    wrapupAction(manager);
    completedAction(manager);
    // const options: Flex.ContentFragmentProps = { sortOrder: -1 };
    // flex.AgentDesktopView.Panel1.Content.add(<CustomTaskList key="WrapupMultitaskPlugin-component" />, options);
  }
}
