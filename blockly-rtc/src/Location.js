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
 * @fileoverview Object representing a user's location.
 * @author navil@google.com (Navil Perez)
 */

import * as Blockly from 'blockly/dist';

export default class Location {
  constructor(type, blockId, fieldName) {
    this.type = type;
    this.blockId = blockId;
    this.fieldName = fieldName;
  };

  /**
   * Create a Location from an event. Currently supports creating Locations for
   * blocks from a 'selected' UI event.
   * @param {!Blockly.Event} event The event that creates a Location.
   * @return {!LocationUpdate} The Location representative of the event.
   * @public
   */  
  static fromEvent(event) {
    // TODO: Add support for a field location on a change event.
    const id = event.workspaceId;
    const type = 'BLOCK';
    const blockId = event.newValue;
    const fieldName = null;
    return new Location(type, blockId, fieldName);  
  };

  /**
   * Decode the JSON into a Location.
   * @param {!Object} json The JSON representation of the Location.
   * @return {!LocationUpdate} The Location represented by the JSON.
   * @public
   */
  static fromJson(json) {
    return new Location(json.type, json.blockId, json.fieldName);
  };

  /**
   * Check if the combination of Location properties describe a viable location.
   * @return {!Boolean} Whether the LocationUpdate has a viable location.
   * @public
   */  
  hasValidLocation() {
    if (this.type == 'FIELD' && this.blockId && this.fieldName) {
      return true;
    } else if (this.type == 'BLOCK' && this.blockId) {
      return true;
    } else {
      return false;
    };
  };
  
  /**
   * Create a Marker at the Location.
   * @param {!Blockly.Workspace} workspace The workspace the user is on.
   * @return {!Blockly.Marker} A Marker with the curNode set to the Location.
   * @public
   */
  toMarker(workspace) {
    const marker = new Blockly.Marker();
    const node = this.createNode(workspace);
    marker.setCurNode(node);
    return marker;
  };

  /**
   * Create an ASTNode pointing to the Location.
   * @param {!Blockly.Workspace} workspace The workspace the user is on.
   * @return {Blockly.ASTNode} An AST Node that points to the Location or null
   * if the location is not viable.
   * @public
   */
  createNode(workspace) {
    if (!this.hasValidLocation()) {
      return null;
    };
    if (this.type == 'BLOCK') {
      return this.createBlockNode_(workspace);
    } else if (this.type == 'FIELD') {
      return this.createFieldNode_(workspace);
    };
  };

  /**
   * Create an ASTNode pointing to a block.
   * @param {!Blockly.Workspace} workspace The workspace the user is on.
   * @return {Blockly.ASTNode} An AST Node that points to a block.
   * @public
   */
  createBlockNode_(workspace) {
    const block = workspace.getBlockById(this.blockId);
    return Blockly.ASTNode.createBlockNode(block);
  };

  /**
   * Create an ASTNode pointing to a field.
   * @param {!Blockly.Workspace} workspace The workspace the user is on.
   * @return {Blockly.ASTNode} An AST Node that points to a field.
   * @public
   */  
  createFieldNode_(workspace) {
    const block = workspace.getBlockById(this.blockId);
    const field = block.getField(this.fieldName);
    return Blockly.ASTNode.createFieldNode(field);
  };
};
