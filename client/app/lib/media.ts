const breakPoints = {
  tablet: 768,
  desktop: 1024,
  wide: 1200,
  xwide: 1440,
} as const;

type BreakpointName = keyof typeof breakPoints;

export const mediaQuery = (width: number) => `@media (min-width: ${width}px)`;

type Media = Record<BreakpointName, string>;

export const media = Object.entries(breakPoints).reduce(
  (acc, [name, width]) => {
    acc[name as BreakpointName] = mediaQuery(width);
    return acc;
  },
  {} as Media,
);
