import React from 'react';
import {
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  Table,
  //   Header,
} from '@tanstack/react-table';
import { makeData, Person } from './makeData';
import { DebouncedInput } from './DebouncedInput';
import { Filter } from './Filter';
import { fuzzyFilter, fuzzySort } from './ReactTable';
import { Group } from '@mantine/core';
import { ArrowsSort, SortAscending, SortDescending } from 'tabler-icons-react';
import { useStyles } from './styles';
import { StringFilter2 } from './StringFilter';
import { useColumns } from './columns';
import StringFilter from './Filters/StringFilter';

export function TableDataGrid() {
  const { columns } = useColumns();
  const rerender = React.useReducer(() => ({}), {})[1];

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  const [data, setData] = React.useState(() => makeData(50000));
  const refreshData = () => setData((old) => makeData(50000));

  const table = useReactTable<Person>({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  React.useEffect(() => {
    //   Sets fullName column as sorting
    if (table.getState().columnFilters[0]?.id === 'fullName') {
      if (table.getState().sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }]);
      }
    }
  }, [table.getState().columnFilters[0]?.id]);

  return (
    <div>
      <div>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={(value) => setGlobalFilter(String(value))}
          //   placeholder="Search all columns..."
        />
      </div>
      <div />
      <table>
        <Header table={table} />

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <Footer table={table} />
    </div>
  );
}

function Header({ table }: { table: Table<Person> }) {
  const { classes } = useStyles();
  const Sorter = ({ isAsc }: { isAsc: boolean }) =>
    isAsc ? <SortAscending /> : <SortDescending />;
  return (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        //   Header Row
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((h) => {
            return (
              <th key={h.id} colSpan={h.colSpan}>
                {!h.isPlaceholder && (
                  <>
                    <div
                      className={h.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                      onClick={h.column.getToggleSortingHandler()}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}

                      {h.column.getCanSort() &&
                        (h.column.getIsSorted() ? (
                          <Sorter isAsc={h.column.getIsSorted() === 'asc'} />
                        ) : (
                          <ArrowsSort className={classes.disableSortIcon} />
                        ))}
                    </div>

                    {h.column.getCanFilter() && (
                      <div>
                        <StringFilter column={h.column} table={table} />
                        {/* <Filter column={h.column} table={table} /> */}
                        {/* <StringFilter2 column={h.column} table={table} /> */}
                        {/* <StringFilter2 /> */}
                      </div>
                    )}
                  </>
                )}
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
}

function Footer({ table }: { table: Table<Person> }) {
  return (
    <>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
      <div>{/* <button onClick={() => rerender()}>Force Rerender</button> */}</div>
      <div>{/* <button onClick={() => refreshData()}>Refresh Data</button> */}</div>
      <pre>{JSON.stringify(table.getState(), null, 2)}</pre>
    </>
  );
}
