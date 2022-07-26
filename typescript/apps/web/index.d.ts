// type CustomColors = 'primaryColorName' | 'secondaryColorName';

// declare module '@mantine/core' {
//     export interface MantineThemeColorsOverride {
//         colors: Record<CustomColors, Tuple<string, 10>>;
//     }
// }

// or if you want to "extend" standard colors
import { Tuple, DefaultMantineColor } from '@mantine/core';

type ExtendedCustomColors = 'primaryColorName' | 'secondaryColorName' | DefaultMantineColor;

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
  }

  export interface MantineThemeOther {
    myCustomProperty: string;
    myCustomFunction: () => void;
  }

  // MantineStyleSystemValue
}

type FilterDataType =
  | 'number_single'
  | 'number_multiple'
  | 'date_single'
  | 'date_multiple'
  | 'string_single'
  | 'string_multiple';

declare module '@tanstack/table-core' {
  interface ColumnMeta {
    filterType: FilterDataType;
  }

  interface FilterMeta {
    itemRank: RankingInfo;
  }
}
