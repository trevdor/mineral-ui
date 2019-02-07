/* @flow */
import { MenuItemType, MenuItems } from '../Menu/types';

export default class ItemMatcher {
  keys: string = '';

  keysTimer: number | null | undefined;

  searchIndex: number;

  findMatchingItem = (
    items: MenuItems,
    highlightedIndex: number | null | undefined,
    key: string
  ) => {
    if (!this.isMatchableCharacter(key)) {
      return;
    }

    this.searchIndex =
      highlightedIndex === undefined ? 0 : highlightedIndex + 1;

    this.keys += key;
    this.resetKeysAfterDelay();

    const match =
      this.findMatchingItemInRange(items, this.searchIndex, items.length) ||
      this.findMatchingItemInRange(items, 0, this.searchIndex);

    return match;
  };

  findMatchingItemInRange = (
    items: Array<MenuItemType>,
    start: number,
    end: number
  ) => {
    const keys = this.keys.toLowerCase();
    for (let index = start; index < end; index++) {
      const { text } = items[index];
      if (
        text &&
        typeof text === 'string' &&
        text.toLowerCase().indexOf(keys) === 0
      ) {
        return items[index];
      }
    }
  };

  resetKeysAfterDelay = () => {
    if (this.keysTimer) {
      clearTimeout(this.keysTimer);
      this.keysTimer = null;
    }

    this.keysTimer = window.setTimeout(() => {
      this.keys = '';
      this.keysTimer = null;
    }, 500);
  };

  // Exclude standalone modifier keys, but allow use as combinator
  // e.g. Reject standalone ALT key, but ALT+m which creates µ is okay
  isMatchableCharacter = (key: string) => {
    return key.length === 1 && /\S/.test(key);
  };
}
