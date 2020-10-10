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

function CustomPagination({ paginationProps }: ComponentProps) {
  const classes = useStyles();

  return (
    <Pagination
      className={classes.root}
      color='primary'
      count={paginationProps.pageCount}
      onChange={(e: React.ChangeEvent<unknown>, value: number) => {
        paginationProps.setPage(value);
      }}
      page={paginationProps.page}
    />
  );
}
