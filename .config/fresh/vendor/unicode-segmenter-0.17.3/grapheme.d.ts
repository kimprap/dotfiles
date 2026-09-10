/**
 * Unicode segmentation by extended grapheme rules.
 *
 * This is fully compatible with the {@link Intl.Segmenter.segment} API
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/segment
 *
 * @param {string} input
 * @return {GraphemeSegmenter} iterator for grapheme cluster segments
 */
export function graphemeSegments(input: string): GraphemeSegmenter;
/**
 * Count number of extended grapheme clusters in given text.
 *
 * @param {string} input
 * @return {number} count of grapheme clusters
 */
export function countGraphemes(input: string): number;
/**
 * Split given text into extended grapheme clusters.
 *
 * @param {string} input
 * @return {IterableIterator<string>} iterator for grapheme clusters
 *
 * @see {@link graphemeSegments} if you need extra information.
 *
 * @example
 * [...splitGraphemes('abc')] // => ['a', 'b', 'c']
 */
export function splitGraphemes(input: string): IterableIterator<string>;
/**
 * Collect all extended grapheme clusters in given text.
 *
 * This is a faster alternative to {@link splitGraphemes}, as it packs sliced segments directly into the result array.
 * However, for large inputs, using the {@link splitGraphemes} is more memory-efficient.
 *
 * @param {string} input
 * @return {string[]} array of grapheme clusters
 *
 * @see {@link splitGraphemes} for a large text input.
 *
 * @example
 * collectGraphemes('abc') // => ['a', 'b', 'c']
 */
export function collectGraphemes(input: string): string[];
export type GC_Any = import("./_grapheme_data.js").GC_Any;
export type GraphemeCategoryNum = import("./_grapheme_data.js").GraphemeCategoryNum;
export type GraphemeSegmentExtra = {
    /**
     * The first code point of the segment
     */
    _hd: number;
    /**
     * Beginning Grapheme_Cluster_Break category of the segment
     */
    _catBegin: GraphemeCategoryNum;
    /**
     * Ending Grapheme_Cluster_Break category of the segment
     */
    _catEnd: GraphemeCategoryNum;
};
export type GraphemeSegmentOutput = import("./core.js").SegmentOutput<GraphemeSegmentExtra>;
export type GraphemeSegmenter = import("./core.js").Segmenter<GraphemeSegmentExtra>;
import { GraphemeCategory } from './_grapheme_data.js';
export { GraphemeCategory, countGraphemes as countGrapheme };
