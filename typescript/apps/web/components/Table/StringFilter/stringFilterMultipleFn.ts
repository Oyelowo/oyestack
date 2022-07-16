import { FilterMultipleProps, filterRowByMultipleFilters, RowString } from '../helpers';
import { FilterFn } from '@tanstack/react-table';
import { AddMeta, OperatorLogical } from '../helpers';
import {
  filterStringBySingleFilter,
} from './shared';


export const stringFilterCompoundFn: FilterFn<unknown> = (
  row,
  columnId,
  filters: FilterMultipleProps<string>[],
  addMeta
) => {
  const rowValue = row.getValue<string>(columnId);

  return filterRowByMultipleFilters({
    onFilterRowValue: ({ operator, filterValue }) => {
      return filterStringBySingleFilter({
        operator,
        filterValue,
        rowValue,
        addMeta
      })
    },
    filterProps: filters
  })
};

stringFilterCompoundFn.autoRemove = (val) => !val;

export const operatorsValuesAndLabels: Array<{
  value: RowString["operator"];
  label: string;
}> = [
    {
      value: 'fuzzy',
      label: 'Allow typo',
    },
    {
      value: 'contains',
      label: 'Contains',
    },
    {
      value: 'not_contain',
      label: 'Does not Contain',
    },
    {
      value: 'starts_with',
      label: 'Starts with',
    },
    {
      value: 'ends_with',
      label: 'Ends with',
    },
    {
      value: 'equals',
      label: 'Equals',
    },
    {
      value: 'not_equal',
      label: 'Not equal',
    },
  ];
