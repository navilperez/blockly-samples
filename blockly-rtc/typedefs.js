/**
 * @license
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
 * @fileoverview Typedefs for use in the realtime collaboration demo.
 * @author navil@google.com (Navil Perez)
 */

/**
 * An entry from the database.
 * @typedef {Object} Entry
 * @property {<!Array.<!Blockly.Event>>} events An array of Blockly Events.
 * @property {string} entryId The id assigned to an entry by the client.
 * @property {string} serverId The id assigned to an event by the server.
 */

 /**
 * A local representation of an entry in the database.
 * @typedef {Object} LocalEntry
 * @property {<!Array.<!Blockly.Event>>} events An array of Blockly Events.
 * @property {string} entryId The id assigned to an event by the client.
 */
 
 /**
 * An represents an update to the location of a user.
 * @typedef {Object} LocationUpdate
 * @property {string} workspaceId The workspaceId of the user.
 * @property {Location} location The location of the user. 
 */

 /**
 * An action to be performed on the workspace.
 * @typedef {Object} WorkspaceAction
 * @property {!Blockly.Event} event A Blockly Event.
 * @property {boolean} forward Indicates the direction to run an event.
 */
