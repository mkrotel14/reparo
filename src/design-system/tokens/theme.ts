const palette = {
  ink: "#18201D",
  moss: "#215B45",
  fern: "#397B5C",
  mint: "#DCEFE5",
  cream: "#FBF9F4",
  sand: "#EEE9DE",
  slate: "#66706B",
  white: "#FFFFFF",
  night: "#111815",
  charcoal: "#1B2621",
  fog: "#D7E2DB",
  amber: "#F2A73B",
  red: "#C54A42",
} as const;

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
} as const;

const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  pill: 999,
} as const;

const typography = {
  title: 28,
  heading: 20,
  body: 16,
  caption: 13,
} as const;

type AppTheme = {
  colors: Record<
    | "background"
    | "surface"
    | "surfaceMuted"
    | "text"
    | "textMuted"
    | "primary"
    | "primaryPressed"
    | "onPrimary"
    | "border"
    | "success"
    | "warning"
    | "danger",
    string
  >;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
};

export const lightTheme: AppTheme = {
  colors: {
    background: palette.cream,
    surface: palette.white,
    surfaceMuted: palette.sand,
    text: palette.ink,
    textMuted: palette.slate,
    primary: palette.moss,
    primaryPressed: palette.fern,
    onPrimary: palette.white,
    border: "#D9DED8",
    success: palette.fern,
    warning: palette.amber,
    danger: palette.red,
  },
  spacing,
  radius,
  typography,
};

export const darkTheme: AppTheme = {
  ...lightTheme,
  colors: {
    background: palette.night,
    surface: palette.charcoal,
    surfaceMuted: "#26322C",
    text: "#F4F7F3",
    textMuted: "#B5C1BA",
    primary: "#7FC7A2",
    primaryPressed: "#A2DCBC",
    onPrimary: palette.night,
    border: "#34433B",
    success: "#8BD4AA",
    warning: "#F5BE65",
    danger: "#EB837C",
  },
};
