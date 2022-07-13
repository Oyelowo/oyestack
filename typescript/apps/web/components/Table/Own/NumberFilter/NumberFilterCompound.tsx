import { useState } from 'react';
import {
  ActionIcon,
  Anchor,
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Group,
  Popover,
  Radio,
  RadioGroup,
  Table,
  TextInput,
  Switch,
  Box,
  Text,
  Code,
  Select,
} from '@mantine/core';
import { useForm, formList } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { Trash } from 'tabler-icons-react';
import { useSetState } from '@mantine/hooks';
// import { BiFilterAlt as FilterIcon } from "react-icons/bi";
import { Filter as FilterIcon } from 'tabler-icons-react';
import { Column, Table as ReactTable } from '@tanstack/react-table';
import { FilterConditionNumberCompound, OperatorNumber } from './shared';
import { Person } from '../makeData';
import { FilterCompoundOperationNumber, operatorsValuesAndLabels } from './compoundHelper';

export const NumberFilterCompound = ({
  column,
  table,
}: {
  column: Column<Person, unknown>;
  table: ReactTable<Person>;
}) => {
  const [opened, setOpened] = useState(false);
  const form = useForm({
    initialValues: {
      operations: formList<FilterConditionNumberCompound & { key: string }>([
        { logical: 'and', operator: 'fuzzy', filter: 0, key: randomId() },
      ]),
    },
  });

  const handleClose = () => {
    // form.reset();
    setOpened(false);
  };

  const handleClear = () => {
    column.setFilterValue(undefined);
    form.reset();
    setOpened(false);
  };

  const handleApply = () => {
    column.setFilterValue(form.values.operations);
    setOpened(false);
  };

  const fields = form.values.operations.map((item, index) => (
    <Group key={item.key} mt="xs">
      {index !== 0 ? (
        <Select
          label="Operator"
          {...form.getListInputProps('operations', index, 'logical')}
          data={['and', 'or']}
          sx={{ flex: 0.9 }}
        />
      ) : (
        <Select
          rightSection={<></>}
          // styles={{ rightSection: { pointerEvents: 'none' } }}
          value={null}
          data={[]}
          disabled
          sx={{ flex: 0.9 }}
        />
      )}
      <Select
        label="Operator"
        {...form.getListInputProps('operations', index, 'operator')}
        data={operatorsValuesAndLabels}
        sx={{ flex: 2 }}
      />
      <TextInput
        placeholder="John Doe"
        required
        // sx={{ flex: 1 }}
        {...form.getListInputProps('operations', index, 'filter')}
      />
      <ActionIcon
        color="red"
        variant="hover"
        onClick={() => form.removeListItem('operations', index)}
      >
        <Trash size={16} />
      </ActionIcon>
    </Group>
  ));

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
      // zIndex={10000}
    >
      <Box sx={{ maxWidth: 500 }} mx="auto">
        {fields.length > 0 ? (
          <Group mb="xs">
            <Text weight={500} size="sm" sx={{ flex: 1 }}>
              Name
            </Text>
            <Text weight={500} size="sm" pr={90}>
              Status
            </Text>
          </Group>
        ) : (
          <Text color="dimmed" align="center">
            No one here...
          </Text>
        )}

        {fields}

        <Group position="center" mt="md">
          <Button
            onClick={() =>
              form.addListItem('operations', {
                operator: 'eq',
                logical: 'and',
                filter: 0,
                key: randomId(),
              })
            }
          >
            Add+
          </Button>
        </Group>

        <Text size="sm" weight={500} mt="md">
          Form values:
        </Text>
        <Code block>{JSON.stringify(form.values, null, 2)}</Code>
      </Box>
      <Group position="apart">
        <Anchor component="button" color="gray" onClick={handleClear}>
          Clear
        </Anchor>
        <Button onClick={handleApply}>Apply</Button>
      </Group>
    </Popover>
  );
};
