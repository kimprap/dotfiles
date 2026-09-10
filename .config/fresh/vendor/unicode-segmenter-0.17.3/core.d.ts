/**
 * @template {number} [T=number]
 * @typedef {[from: number, to: number, category: T]} CategorizedUnicodeRange
 */
/**
 * @typedef {CategorizedUnicodeRange<0>} UnicodeRange
 */
/**
 * @typedef {string & { __tag: 'UnicodeDataEncoding' }} UnicodeDataEncoding
 *
 * Encoding for array of {@link UnicodeRange}, as a separator-free
 * sequence of variable-length quantities in the base36 alphabet;
 * each character carries 4 payload bits and a continuation bit.
 *
 * Each {@link UnicodeRange} packed as a pair of quantities:
 *
 * gap      = from - (previous to) - 1
 * padding  = to - from
 *
 * Notes:
 * - Ranges are sorted and never overlap, so the delta-encoded gap is
 *   always non-negative, and mostly a single character.
 * - The max value of a category is 23; https://www.unicode.org/reports/tr29/tr29-45.html#Table_Word_Break_Property_Values
 * - The longest range is 42,720; CJK UNIFIED IDEOGRAPH-20000..CJK UNIFIED IDEOGRAPH-2A6DF
 *
 * See `scripts/lib/encoding.js` for the encoder.
 */
/**
 * Decode {@link UnicodeDataEncoding} and hand every range to `emit`.
 *
 * Callers build their own index from the callback, so decoding never materializes an intermediate array of ranges;
 * on the grapheme table that is ~800 short-lived tuples per module load.
 *
 * @param {UnicodeDataEncoding} data
 * @param {string} cats base36 category digit per range, or `''` for none
 * @param {(from: number, to: number, cat: number) => void} emit
 * @return {void}
 */
export function decodeUnicodeData(data: UnicodeDataEncoding, cats: string, emit: (from: number, to: number, cat: number) => void): void;
/**
 * @template {object} Ext
 * @typedef {{
 *   segment: string,
 *   index: number,
 *   input: string,
 * } & Ext} SegmentOutput
 */
/**
 * @template {object} T
 * @typedef {IterableIterator<SegmentOutput<T>>} Segmenter
 */
/**
 * @typedef {[starts: Uint32Array, ends: Uint32Array]} UnicodeRangeTable
 *
 * Flat, binary-searchable range table. `starts[i]` holds the first
 * codepoint of the i-th range, and `ends[i]` packs its last codepoint
 * and category as `end << 5 | category`.
 *
 * The 5-bit category fits any break property; the largest category
 * value is 23.
 */
/**
 * Category of the range containing the given codepoint.
 *
 * @param {number} cp
 * @param {Uint32Array} starts sorted, non-overlapping range starts
 * @param {Uint32Array} ends packed `end << 5 | category`, parallel to `starts`
 * @return {number} category of the containing range, or 0 if no match
 */
export function findUnicodeRangeCategory(cp: number, starts: Uint32Array, ends: Uint32Array): number;
/**
 * Decode {@link UnicodeDataEncoding} into a membership test table for
 * {@link findUnicodeRangeCategory}; every range takes category 1, so a
 * match is truthy and a miss is 0.
 *
 * @param {UnicodeDataEncoding} data
 * @return {UnicodeRangeTable}
 */
export function decodeUnicodeFlatData(data: UnicodeDataEncoding): UnicodeRangeTable;
export type CategorizedUnicodeRange<T extends number = number> = [from: number, to: number, category: T];
export type UnicodeRange = CategorizedUnicodeRange<0>;
/**
 *
 * Encoding for array of {@link UnicodeRange}, as a separator-free
 * sequence of variable-length quantities in the base36 alphabet;
 * each character carries 4 payload bits and a continuation bit.
 *
 * Each {@link UnicodeRange} packed as a pair of quantities:
 *
 * gap      = from - (previous to) - 1
 * padding  = to - from
 *
 * Notes:
 * - Ranges are sorted and never overlap, so the delta-encoded gap is
 *   always non-negative, and mostly a single character.
 * - The max value of a category is 23; https://www.unicode.org/reports/tr29/tr29-45.html#Table_Word_Break_Property_Values
 * - The longest range is 42,720; CJK UNIFIED IDEOGRAPH-20000..CJK UNIFIED IDEOGRAPH-2A6DF
 *
 * See `scripts/lib/encoding.js` for the encoder.
 */
export type UnicodeDataEncoding = string & {
    __tag: "UnicodeDataEncoding";
};
export type SegmentOutput<Ext extends object> = {
    segment: string;
    index: number;
    input: string;
} & Ext;
export type Segmenter<T extends object> = IterableIterator<SegmentOutput<T>>;
/**
 * Flat, binary-searchable range table. `starts[i]` holds the first
 * codepoint of the i-th range, and `ends[i]` packs its last codepoint
 * and category as `end << 5 | category`.
 *
 * The 5-bit category fits any break property; the largest category
 * value is 23.
 */
export type UnicodeRangeTable = [starts: Uint32Array, ends: Uint32Array];
