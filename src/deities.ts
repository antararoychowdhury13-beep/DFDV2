// Auto-generated from antar_app_100_deities_content.xlsx — do not hand-edit.
// Source rows with real content: 10 (placeholder rows like 'Deity 11' are filtered).
// To add more deities: fill more rows in the spreadsheet and regenerate.

export type Deity = {
  no: number;
  name: string;
  tag: string;
  desc: string;
  /** Sprite portrait crop. Present only for the deities in deities.png. */
  portraitTop?: number;
};

export const DEITY_PORTRAIT_CROP = {
  w: 4.4857,
  h: 15.6646,
  left: -0.3238,
};

export const DEITIES: Deity[] = [
  { no: 1, name: 'Lord Shiva', tag: 'Mahadev', desc: 'Supreme yogi, destroyer of ego and source of inner stillness', portraitTop: -4.4283 },
  { no: 2, name: 'Maa Parvati', tag: 'Shakti Swaroopa', desc: 'Mother of strength, devotion and divine feminine grace' },
  { no: 3, name: 'Lord Vishnu', tag: 'Narayana', desc: 'Preserver of the universe and protector of cosmic balance', portraitTop: -6.6118 },
  { no: 4, name: 'Maa Lakshmi', tag: 'Shri Mahalakshmi', desc: 'Goddess of prosperity, beauty, abundance and auspiciousness', portraitTop: -5.5038 },
  { no: 5, name: 'Lord Krishna', tag: 'Govinda', desc: 'Divine guide of love, wisdom, joy and compassion', portraitTop: -7.6993 },
  { no: 6, name: 'Radha Krishna', tag: 'Divine Love', desc: 'Eternal union of devotion, surrender and spiritual love' },
  { no: 7, name: 'Lord Rama', tag: 'Maryada Purushottam', desc: 'Embodiment of dharma, truth, courage and righteous living' },
  { no: 8, name: 'Maa Sita', tag: 'Janaki Mata', desc: 'Symbol of purity, patience, devotion and inner strength' },
  { no: 9, name: 'Hanuman', tag: 'Sankat Mochan', desc: 'Remover of troubles and giver of devotion, courage and protection' },
  { no: 10, name: 'Maa Durga', tag: 'Mahishasura Mardini', desc: 'Divine mother who protects, empowers and destroys negativity' },
];
