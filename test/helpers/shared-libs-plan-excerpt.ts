import { sliceBetween } from './skill-fixture';

/** Keep the bounded Code Quality fixture on the real engineering decision path. */
export function sharedLibsPlanExcerpt(entrypoint: string, review: string): string {
  return [
    sliceBetween(entrypoint, '## Shared contract', '## Scope gate'),
    sliceBetween(review, '## Confidence Calibration', '## Decision procedure'),
    sliceBetween(review, '## Decision procedure', '## Scope Challenge'),
    sliceBetween(review, '### 2. Code quality review', '### 3. Test review'),
  ].join('\n\n');
}
