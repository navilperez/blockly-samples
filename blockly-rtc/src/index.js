/**
 * @license
 * 
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Realtime collaboration demo using Node.js and SQlite.
 * @author navil@google.com (Navil Perez)
 */

import * as Blockly from 'blockly/dist';
import {getEvents, writeEvents} from './http/workspace_client_handlers';
import {getLocationUpdates, sendLocationUpdate} from './http/marker_manager_handlers';
import UserDataManager from './MarkerManager';
import WorkspaceClient from './WorkspaceClient';

document.addEventListener('DOMContentLoaded', async () => {
  const workspace = Blockly.inject('blocklyDiv',
      {
        toolbox: document.getElementById('toolbox'),
        media: 'media/'
      });
  const workspaceClient = new WorkspaceClient(
      workspace.id, getEvents, writeEvents);
  workspaceClient.listener.on('runEvents', (eventQueue) => {
    runEvents_(eventQueue);
  });
  await workspaceClient.initiateWorkspace();

  const userDataManager = new UserDataManager(workspace.id, sendLocationUpdate,
      getLocationUpdates);  
  await userDataManager.initMarkers();

  workspace.addChangeListener((event) => {
    if (event instanceof Blockly.Events.Ui) {
      if (event.element == 'selected') {
        userDataManager.handleEvent(event);
      };
      return;
    };
    workspaceClient.activeChanges.push(event);
    if (!Blockly.Events.getGroup()) {
      workspaceClient.flushEvents();
    };
  });

  /**
   * Run a series of events that allow the order of events on the workspace
   * to converge with the order of events on the database.
   * @param {<!Array.<!WorkspaceAction>>} eventQueue An array of events and the
   * direction they should be run.
   * @private
   */
  function runEvents_(eventQueue) {
    eventQueue.forEach((workspaceAction)=> {
      Blockly.Events.disable();
      workspaceAction.event.run(workspaceAction.forward);
      Blockly.Events.enable();
    });
  };
});
