/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  HeadingNode,
  createHeadingNode,
  isHeadingNode,
} from 'outline/HeadingNode';
import {ParagraphNode} from 'outline/ParagraphNode';
import {TextNode} from 'outline';
import {initializeUnitTest} from '../utils';

const editorThemeClasses = Object.freeze({
  heading: {
    h1: 'my-h1-class',
    h2: 'my-h2-class',
    h3: 'my-h3-class',
    h4: 'my-h4-class',
    h5: 'my-h5-class',
  },
});

describe('OutlineHeadingNode tests', () => {
  initializeUnitTest((testEnv) => {
    test('HeadingNode.constructor', async () => {
      const {editor} = testEnv;
      await editor.update(() => {
        const headingNode = new HeadingNode('h1');
        expect(headingNode.getFlags()).toBe(0);
        expect(headingNode.getType()).toBe('heading');
        expect(headingNode.getTag()).toBe('h1');
        expect(headingNode.getTextContent()).toBe('');
      });
      expect(() => new HeadingNode()).toThrow();
    });

    test('HeadingNode.clone()', async () => {
      const {editor} = testEnv;
      await editor.update(() => {
        const headingNode = new HeadingNode('h1');
        const textNode = new TextNode('foo');
        headingNode.append(textNode);
        const headingNodeClone = headingNode.clone();
        expect(headingNodeClone).not.toBe(headingNode);
        expect(headingNode.__type).toEqual(headingNodeClone.__type);
        expect(headingNode.__flags).toEqual(headingNodeClone.__flags);
        expect(headingNode.__parent).toEqual(headingNodeClone.__parent);
        expect(headingNode.__children).toEqual(headingNodeClone.__children);
        expect(headingNode.__tag).toEqual(headingNodeClone.__tag);
        expect(headingNode.__key).toEqual(headingNodeClone.__key);
        expect(headingNode.getTextContent()).toEqual(
          headingNodeClone.getTextContent(),
        );
      });
    });

    test('HeadingNode.createDOM()', async () => {
      const {editor} = testEnv;
      await editor.update(() => {
        const headingNode = new HeadingNode('h1');
        expect(headingNode.createDOM(editorThemeClasses).outerHTML).toBe(
          '<h1 class="my-h1-class"></h1>',
        );
        expect(headingNode.createDOM({heading: {}}).outerHTML).toBe(
          '<h1></h1>',
        );
        expect(headingNode.createDOM({}).outerHTML).toBe('<h1></h1>');
      });
    });

    test('HeadingNode.updateDOM()', async () => {
      const {editor} = testEnv;
      await editor.update(() => {
        const headingNode = new HeadingNode('h1');
        const domElement = headingNode.createDOM(editorThemeClasses);
        expect(domElement.outerHTML).toBe('<h1 class="my-h1-class"></h1>');
        const newHeadingNode = new HeadingNode();
        const result = newHeadingNode.updateDOM(headingNode, domElement);
        expect(result).toBe(false);
        expect(domElement.outerHTML).toBe('<h1 class="my-h1-class"></h1>');
      });
    });

    test('HeadingNode.insertNewAfter()', async () => {
      const {editor} = testEnv;
      let headingNode;
      await editor.update((view) => {
        const root = view.getRoot();
        headingNode = new HeadingNode('h1');
        root.append(headingNode);
      });
      expect(testEnv.outerHTML).toBe(
        '<div contenteditable="true" data-outline-editor="true"><h1></h1></div>',
      );
      await editor.update((view) => {
        const result = headingNode.insertNewAfter();
        expect(result).toBeInstanceOf(ParagraphNode);
        expect(result.getDirection()).toEqual(headingNode.getDirection());
      });
      expect(testEnv.outerHTML).toBe(
        '<div contenteditable="true" data-outline-editor="true"><h1></h1><p></p></div>',
      );
    });

    test('HeadingNode.canInsertTab()', async () => {
      const {editor} = testEnv;
      await editor.update(() => {
        const headingNode = new HeadingNode();
        expect(headingNode.canInsertTab()).toBe(false);
      });
    });

    test('createHeadingNode()', async () => {
      const {editor} = testEnv;
      await editor.update(() => {
        const headingNode = new HeadingNode();
        const createdHeadingNode = createHeadingNode();
        expect(headingNode.__type).toEqual(createdHeadingNode.__type);
        expect(headingNode.__flags).toEqual(createdHeadingNode.__flags);
        expect(headingNode.__parent).toEqual(createdHeadingNode.__parent);
        expect(headingNode.__key).not.toEqual(createdHeadingNode.__key);
      });
    });

    test('isHeadingNode()', async () => {
      const {editor} = testEnv;
      await editor.update(() => {
        const headingNode = new HeadingNode();
        expect(isHeadingNode(headingNode)).toBe(true);
      });
    });
  });
});