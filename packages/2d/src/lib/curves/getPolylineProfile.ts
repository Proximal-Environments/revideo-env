import type {Vector2} from '@revideo/core';
import {clamp} from '@revideo/core';
import type {CurveProfile} from './CurveProfile';
import {LineSegment} from './LineSegment';

export function getPolylineProfile(
  points: readonly Vector2[],
  _radius: number,
  closed: boolean,
): CurveProfile {
  const profile: CurveProfile = {
    arcLength: 0,
    segments: [],
    minSin: 1,
  };

  if (points.length === 0) {
    return profile;
  }

  let last = points[0];
  for (let i = 1; i < points.length; i++) {
    const line = new LineSegment(last, points[i]);
    if (line.arcLength > 0) {
      profile.segments.push(line);
      profile.arcLength += line.arcLength;
    }
    last = points[i];
  }

  if (closed && points.length > 1) {
    const closing = new LineSegment(points[points.length - 1], points[0]);
    if (closing.arcLength > 0) {
      profile.segments.push(closing);
      profile.arcLength += closing.arcLength;
    }
  }

  for (let i = 1; i + 1 < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const c = points[i + 1];
    const ab = a.sub(b).normalized.safe;
    const cb = c.sub(b).normalized.safe;
    const angleBetween = Math.acos(clamp(-1, 1, ab.dot(cb)));
    const angleSin = Math.sin(angleBetween / 2);
    profile.minSin = Math.min(profile.minSin, Math.abs(angleSin));
  }

  if (closed && points.length > 2) {
    const a = points[points.length - 2];
    const b = points[points.length - 1];
    const c = points[0];
    const ab = a.sub(b).normalized.safe;
    const cb = c.sub(b).normalized.safe;
    const angleBetween = Math.acos(clamp(-1, 1, ab.dot(cb)));
    const angleSin = Math.sin(angleBetween / 2);
    profile.minSin = Math.min(profile.minSin, Math.abs(angleSin));
  }

  return profile;
}
