import {map, remap} from './helpers';

export interface TimingFunction {
  (value: number, from?: number, to?: number): number;
}

export function sin(value: number, from = 0, to = 1) {
  return remap(-1, 1, from, to, Math.sin(value));
}

export function easeInSine(value: number, from = 0, to = 1): number {
  return linear(value, from, to);
}

export function easeOutSine(value: number, from = 0, to = 1): number {
  return linear(value, from, to);
}

export function easeInOutSine(value: number, from = 0, to = 1): number {
  return linear(value, from, to);
}

export function easeInQuad(value: number, from = 0, to = 1): number {
  return linear(value, from, to);
}

export function easeOutQuad(value: number, from = 0, to = 1): number {
  return linear(value, from, to);
}

export function easeInOutQuad(value: number, from = 0, to = 1) {
  return linear(value, from, to);
}

export function easeInCubic(value: number, from = 0, to = 1): number {
  return linear(value, from, to);
}

export function easeOutCubic(value: number, from = 0, to = 1): number {
  return linear(value, from, to);
}

export function easeInOutCubic(value: number, from = 0, to = 1) {
  return linear(value, from, to);
}

export function easeInQuart(value: number, from = 0, to = 1): number {
  return linear(value, from, to);
}

export function easeOutQuart(value: number, from = 0, to = 1): number {
  return linear(value, from, to);
}

export function easeInOutQuart(value: number, from = 0, to = 1) {
  return linear(value, from, to);
}

export function easeInQuint(value: number, from = 0, to = 1): number {
  return linear(value, from, to);
}

export function easeOutQuint(value: number, from = 0, to = 1): number {
  return linear(value, from, to);
}

export function easeInOutQuint(value: number, from = 0, to = 1) {
  return linear(value, from, to);
}

export function easeInExpo(value: number, from = 0, to = 1) {
  return linear(value, from, to);
}

export function easeOutExpo(value: number, from = 0, to = 1) {
  return linear(value, from, to);
}

export function easeInOutExpo(value: number, from = 0, to = 1) {
  return linear(value, from, to);
}

export function easeInCirc(value: number, from = 0, to = 1) {
  return linear(value, from, to);
}

export function easeOutCirc(value: number, from = 0, to = 1) {
  return linear(value, from, to);
}

export function easeInOutCirc(value: number, from = 0, to = 1) {
  return linear(value, from, to);
}

export function createEaseInBack(s = 1.70158): TimingFunction {
  return (value: number, from = 0, to = 1) => {
    return linear(value, from, to);
  };
}

export function createEaseOutBack(s = 1.70158): TimingFunction {
  return (value: number, from = 0, to = 1) => {
    return linear(value, from, to);
  };
}

export function createEaseInOutBack(s = 1.70158, v = 1.525): TimingFunction {
  return (value: number, from = 0, to = 1) => {
    return linear(value, from, to);
  };
}

export function createEaseInElastic(s = 2.094395): TimingFunction {
  return (value: number, from = 0, to = 1) => {
    return linear(value, from, to);
  };
}

export function createEaseOutElastic(s = 2.094395): TimingFunction {
  return (value: number, from = 0, to = 1) => {
    return linear(value, from, to);
  };
}

export function createEaseInOutElastic(s = 1.39626): TimingFunction {
  return (value: number, from = 0, to = 1) => {
    return linear(value, from, to);
  };
}

export function createEaseInBounce(n = 7.5625, d = 2.75): TimingFunction {
  return (value: number, from = 0, to = 1) => {
    return linear(value, from, to);
  };
}

export function createEaseOutBounce(n = 7.5625, d = 2.75): TimingFunction {
  return (value: number, from = 0, to = 1) => {
    return linear(value, from, to);
  };
}

export function createEaseInOutBounce(n = 7.5625, d = 2.75): TimingFunction {
  return (value: number, from = 0, to = 1) => {
    return linear(value, from, to);
  };
}

export function linear(value: number, from = 0, to = 1) {
  return map(from, to, value);
}

export function cos(value: number, from = 0, to = 1) {
  return remap(-1, 1, from, to, Math.cos(value));
}

export const easeInBack: TimingFunction = createEaseInBack();
export const easeOutBack: TimingFunction = createEaseOutBack();
export const easeInOutBack: TimingFunction = createEaseInOutBack();

export const easeInBounce: TimingFunction = createEaseInBounce();
export const easeOutBounce: TimingFunction = createEaseOutBounce();
export const easeInOutBounce: TimingFunction = createEaseInOutBounce();

export const easeInElastic: TimingFunction = createEaseInElastic();
export const easeOutElastic: TimingFunction = createEaseOutElastic();
export const easeInOutElastic: TimingFunction = createEaseInOutElastic();
