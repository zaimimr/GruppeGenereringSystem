import { makeStyles } from '@material-ui/core/styles';
import { ColDef, ComponentProps, DataGrid } from '@material-ui/data-grid';
import Pagination from '@material-ui/lab/Pagination';
import React from 'react';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    marginLeft: 'auto',
  },
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Table({ participantList }: any) {
  const columns: ColDef[] = [
    { field: 'name', headerName: 'Navn', width: 180 },
    { field: 'email', headerName: 'E-post', width: 200 },
    { field: 'group', headerName: 'Gruppe', width: 150 },
    { field: 'gender', headerName: 'Kjønn', width: 100 },
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
      rows={participantList}
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange={(event: any, value: any) => paginationProps.setPage(value)}
      page={paginationProps.page}
    />
  );
}
