export const NOTE_COLORS = [
  { key: 'yellow', bg: 'linear-gradient(150deg, #FFFDE7 0%, #FFF9C4 50%, #FFF176 100%)', swatch: '#FFF176', confetti: ['#FFF176', '#FDE68A', '#F59E0B'], label: 'Yellow' },
  { key: 'pink',   bg: 'linear-gradient(150deg, #FCE4EC 0%, #F8BBD9 50%, #F48FB1 100%)', swatch: '#F48FB1', confetti: ['#F48FB1', '#EC4899', '#FCE7F3'], label: 'Pink' },
  { key: 'blue',   bg: 'linear-gradient(150deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)', swatch: '#90CAF9', confetti: ['#90CAF9', '#3B82F6', '#DBEAFE'], label: 'Blue' },
  { key: 'green',  bg: 'linear-gradient(150deg, #E8F5E9 0%, #C8E6C9 50%, #A5D6A7 100%)', swatch: '#A5D6A7', confetti: ['#A5D6A7', '#22C55E', '#DCFCE7'], label: 'Green' },
  { key: 'purple', bg: 'linear-gradient(150deg, #F3E5F5 0%, #E1BEE7 50%, #CE93D8 100%)', swatch: '#CE93D8', confetti: ['#CE93D8', '#A855F7', '#F3E8FF'], label: 'Purple' },
  { key: 'orange', bg: 'linear-gradient(150deg, #FFF3E0 0%, #FFE0B2 50%, #FFCC80 100%)', swatch: '#FFCC80', confetti: ['#FFCC80', '#F97316', '#FEF3C7'], label: 'Orange' },
];

export const DEFAULT_NOTE_COLOR = NOTE_COLORS[0];

export function getNoteColor(key?: string) {
  return NOTE_COLORS.find((c) => c.key === key) ?? DEFAULT_NOTE_COLOR;
}
