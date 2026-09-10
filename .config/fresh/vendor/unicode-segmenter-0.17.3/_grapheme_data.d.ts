/**
 * @typedef {import('./core.js').UnicodeDataEncoding} UnicodeDataEncoding
 */
/**
 * @typedef {0} GC_Any
 * @typedef {1} GC_CR
 * @typedef {2} GC_Control
 * @typedef {3} GC_Extend
 * @typedef {4} GC_Extended_Pictographic
 * @typedef {5} GC_L
 * @typedef {6} GC_LF
 * @typedef {7} GC_LV
 * @typedef {8} GC_LVT
 * @typedef {9} GC_Prepend
 * @typedef {10} GC_Regional_Indicator
 * @typedef {11} GC_SpacingMark
 * @typedef {12} GC_T
 * @typedef {13} GC_V
 * @typedef {14} GC_ZWJ
 * @typedef {(
 *   | GC_Any
 *   | GC_CR
 *   | GC_Control
 *   | GC_Extend
 *   | GC_Extended_Pictographic
 *   | GC_L
 *   | GC_LF
 *   | GC_LV
 *   | GC_LVT
 *   | GC_Prepend
 *   | GC_Regional_Indicator
 *   | GC_SpacingMark
 *   | GC_T
 *   | GC_V
 *   | GC_ZWJ
 * )} GraphemeCategoryNum
 */
/**
 * @typedef {(
 *   | 'Any'
 *   | 'CR'
 *   | 'Control'
 *   | 'Extend'
 *   | 'Extended_Pictographic'
 *   | 'L'
 *   | 'LF'
 *   | 'LV'
 *   | 'LVT'
 *   | 'Prepend'
 *   | 'Regional_Indicator'
 *   | 'SpacingMark'
 *   | 'T'
 *   | 'V'
 *   | 'ZWJ'
 * )} GraphemeCategoryKey
 */
/**
 * Grapheme category enum
 *
 * Note:
 *   The object isn't actually frozen
 *   because using `Object.freeze` increases 800 bytes on Brotli compression.
 *
 * @type {Readonly<Record<GraphemeCategoryKey, GraphemeCategoryNum>>}
 */
export const GraphemeCategory: Readonly<Record<GraphemeCategoryKey, GraphemeCategoryNum>>;
/**
 * Encoded `Grapheme_Cluster_Break` property ranges.
 *
 * Internal categories (never exposed through the public API):
 *   - 15: InCB_Consonant
 *
 * @type {UnicodeDataEncoding}
 */
export const grapheme_data: UnicodeDataEncoding;
/**
 * Category of each range in {@link grapheme_data}, base36 digit per range.
 */
export const grapheme_cats: "262122424333333393233393339333333333393393bf3b3b3b3b3f3f3bffff33b3bb33ff3f33b3b3333333bffff3b33bb33f33bffff33b3bb33ff3f33b3bbb333b3ff33b333f33b3b3b3b3333b3bf33b3bb39333b33b33b3b3b333b333333b3b33333f3b33b3ffb3f3fff3f3b33f35dc33333f3b3b3b33323333b3bb3b33b3fb3b3333b33333bff3b3f33bfb3b3ff3b3b3b3b3b333b333b3323e224423444444444444444444444444444444444444444444444444444444444444444444444444444444433334433333333b3b3bb33333b353bff3b3b3b3f3ff3b3b333bfff3f33333fb3bb3fb3b3bb33232333f333fff333333333b3b3333bb3b39393f3b3fbf33bb3b393b3b3b3333b33b33b3bbb33b33ffff3b3333bb3933b3b3b333b3b3b3b3b33b3b3b33b3b3b33b3b33b33b3b3b3fffff3bb39b9b3b33b3bf3f3b33f3b3f93b33b3b3bb33b33b3b3b3333393b3b3b33b39bffb3b332333b333dd3b3333233332333333333333333333333333333444444444444a4444444444444344444444444444444444444444444444444444444444";
/**
 * UAX #29 pair-wise rules for extended grapheme cluster boundaries,
 * evaluated into a 16x16 mask table indexed by `catBefore << 4 | catAfter`.
 *
 * A boundary exists iff the mask shares no bit with the runtime's packed sequence state.
 *
 * - 0: boundary (GB999 and friends), no state bit can match
 * - 1: no boundary; bit 0 is always set in the state
 * - 2: GB12/GB13, no boundary iff odd run of RI precedes
 * - 4: GB11, no boundary iff the ZWJ was preceded by ExtPic Extend*
 * - 8: GB9c, no boundary iff InCB Consonant [Extend Linker]* Linker [Extend Linker]* precedes
 *
 * See `buildGraphemePairTable` in scripts/unicode.js for the rules.
 */
export const grapheme_pairs: "0001000000010010000000100000000000000000000000000001000000010018000100000001001000010101100101100000000000000000000100000001111000010000000110101001110111111111000100000021001000010000000100100001000000011010000100000001111000014000000100180001000000010010";
export type UnicodeDataEncoding = import("./core.js").UnicodeDataEncoding;
export type GC_Any = 0;
export type GC_CR = 1;
export type GC_Control = 2;
export type GC_Extend = 3;
export type GC_Extended_Pictographic = 4;
export type GC_L = 5;
export type GC_LF = 6;
export type GC_LV = 7;
export type GC_LVT = 8;
export type GC_Prepend = 9;
export type GC_Regional_Indicator = 10;
export type GC_SpacingMark = 11;
export type GC_T = 12;
export type GC_V = 13;
export type GC_ZWJ = 14;
export type GraphemeCategoryNum = (GC_Any | GC_CR | GC_Control | GC_Extend | GC_Extended_Pictographic | GC_L | GC_LF | GC_LV | GC_LVT | GC_Prepend | GC_Regional_Indicator | GC_SpacingMark | GC_T | GC_V | GC_ZWJ);
export type GraphemeCategoryKey = ("Any" | "CR" | "Control" | "Extend" | "Extended_Pictographic" | "L" | "LF" | "LV" | "LVT" | "Prepend" | "Regional_Indicator" | "SpacingMark" | "T" | "V" | "ZWJ");
