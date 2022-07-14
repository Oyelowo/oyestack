import { useState } from 'react';
import {
  ActionIcon,
  Anchor,
  Button,
  Divider,
  Group,
  Popover,
  Radio,
  RadioGroup,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Filter as FilterIcon, Calendar as CalendarIcon } from 'tabler-icons-react';
import { Column } from '@tanstack/react-table';
import { FilterConditionDateSimple } from './shared';
import { operatorsValuesAndLabels } from './dateFilterCompoundFn';
import { DatePicker } from '@mantine/dates';

export const DateFilterSimple = <T extends unknown>({ column }: { column: Column<T, unknown> }) => {
  const form = useForm<FilterConditionDateSimple>({
    initialValues: {
      filter: null,
      operator: 'fuzzy',
    },
  });
  const [opened, setOpened] = useState(false);

  const handleClose = () => {
    form.reset();
    setOpened(false);
  };

  const handleClear = () => {
    column.setFilterValue(undefined);
    form.reset();
    setOpened(false);
  };

  const handleApply = () => {
    column.setFilterValue(form.values);
    setOpened(false);
  };

  return (
    <Popover
      target={
        <ActionIcon
          variant={column.getFilterValue() ? 'light' : 'hover'}
          color={column.getFilterValue() ? 'blue' : 'gray'}
          onClick={() => setOpened((o) => !o)}
        >
          <FilterIcon />
        </ActionIcon>
      }
      opened={opened}
      onClose={handleClose}
      onClick={(e) => e.stopPropagation()}
      position="bottom"
      transition="scale-y"
    >
      <RadioGroup
        description="Select your option"
        orientation="vertical"
        size="sm"
        {...form.getInputProps('operator')}
      >
        {operatorsValuesAndLabels.map(({ value, label }) => (
          <Radio key={value} value={value} label={label} />
        ))}
      </RadioGroup>
      <Divider my="sm" />

      <DatePicker
        icon={<CalendarIcon />}
        placeholder="Pick date"
        mb="sm"
        withinPortal={false}
        {...form.getInputProps('filter')}
      />

      <Group position="apart">
        <Anchor component="button" color="gray" onClick={handleClear}>
          Clear
        </Anchor>
        <Button onClick={handleApply}>Apply</Button>
      </Group>
    </Popover>
  );
};
