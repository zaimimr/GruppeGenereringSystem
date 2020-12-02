import { makeStyles } from '@material-ui/core/styles';
import { ColDef, ComponentProps, DataGrid } from '@material-ui/data-grid';
import Pagination from '@material-ui/lab/Pagination';
import React from 'react';
import { IParticipants } from 'utils/types';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    marginLeft: 'auto',
  },
});
/**
 * Table
 * @category Views
 * @subcategory Filter
 * @param {IParticipants[]} participantList list over particpants
 * @return {React.Component} <Table /> component
 * ""
 * @example
 *
 * return (
 *   <Table participantList={participantList} />
 * )
 */
export default function Table({ participantList }: { participantList: IParticipants[] }) {
  const columns: ColDef[] = [
    { field: 'name', headerName: 'Navn', width: 200 },
    { field: 'email', headerName: 'E-post', width: 200 },
    { field: 'group', headerName: 'Gruppe', width: 200 },
  ];
  return (
    <DataGrid
      autoHeight
      columns={columns}
      components={{
        pagination: CustomPagination,
      }}
      disableSelectionOnClick
      hideFooterRowCount
      pageSize={5}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rows={participantList as any}
      rowsPerPageOptions={[5, 25, 100]}
    />
  );
}

function CustomPagination(props: ComponentProps) {
  const classes = useStyles();
  const { pagination, api } = props;
  return (
    <Pagination
      className={classes.root}
      color='primary'
      count={pagination.pageCount}
      onChange={(e, value) => api.current.setPage(value)}
      page={pagination.page}
    />
  );
}
