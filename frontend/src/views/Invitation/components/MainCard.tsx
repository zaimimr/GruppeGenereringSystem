import { Checkbox, createStyles, FormControlLabel, makeStyles, Theme, Typography } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import Button from 'components/Button';
import Dropdown from 'components/Dropdown';
import Paper from 'components/Paper';
import TextField from 'components/TextField';
import { useSetCsvGroups } from 'context/EventContext';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CSVReader, readString } from 'react-papaparse';
import { GroupType } from 'views/Invitation/Invitation';

export type MainCardFormInputType = {
  groupName: string;
  csvDropzone: string | string[][];
  csvTextarea: string;
  csvName: string;
  csvEmail: string;
};

const MainCardFormInputDefaultValue = {
  groupName: '',
  csvDropzone: '',
  csvTextarea: '',
  csvName: '',
  csvEmail: '',
};

function MainCard() {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      dropZone: {
        paddingBottom: '50px !important',
        '& div': {
          borderRadius: `${theme.shape.borderRadius}px !important`,
        },
      },
      dropZoneError: {
        paddingBottom: '50px !important',
        '& div': {
          borderRadius: `${theme.shape.borderRadius}px !important`,
          borderColor: `${theme.palette.error.main} !important`,
          color: theme.palette.error.main,
        },
      },
    }),
  );
  const classes = useStyles();

  const { errors, handleSubmit, clearErrors, control, reset, setValue, getValues, setError, watch } = useForm<MainCardFormInputType>({
    defaultValues: MainCardFormInputDefaultValue,
  });

  const watchDropZone = watch('csvDropzone');
  const watchTextArea = watch('csvTextarea');

  const [groupInfo, setGroupInfo] = React.useState<string[][]>([['']]);
  const [checkboxChecked, setCheckboxChecked] = React.useState(false);
  const [resetDropZone, setResetDropZone] = React.useState(false);

  React.useEffect(() => {
    const csvData: string[][] = [];
    if (watchDropZone) {
      const dropzoneValue: MainCardFormInputType['csvDropzone'] = getValues('csvDropzone');
      if (Array.isArray(dropzoneValue)) {
        // Does not allow for string[] as type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dropzoneValue.forEach(({ data }: any) => {
          csvData.push(data);
        });
      }
    } else if (watchTextArea) {
      const textareaValue = readString(getValues('csvTextarea'));
      if (textareaValue.errors.length !== 0) {
        setError('csvTextarea', {
          type: 'manual',
          message: textareaValue.errors[0].message, // TODO: bytte denne til en generell tilbakemelding på Norsk
        });
      } else {
        clearErrors(['csvTextarea']);
        // Does not allow for string[] as type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        textareaValue.data.forEach((v: any) => {
          csvData.push(v);
        });
      }
    }
    setGroupInfo(csvData);
    // eslint-disable-next-line
  }, [watchDropZone, watchTextArea]);

  React.useEffect(() => {
    if (resetDropZone) {
      setResetDropZone(false);
    }
  }, [resetDropZone]);

  const [groups, setGroups] = useSetCsvGroups();
  const onSubmit = handleSubmit((data) => {
    const formData: GroupType = {
      groupData: groupInfo,
      groupName: data.groupName,
      csvHeader: checkboxChecked,
      csvName: data.csvName,
      csvEmail: data.csvEmail,
    };
    setGroups([...groups, formData]);
    resetForm();
  });

  const resetForm = () => {
    reset(MainCardFormInputDefaultValue);
    setGroupInfo([]);
    setCheckboxChecked(false);
    setResetDropZone(true);
  };

  return (
    <Paper>
      <form autoComplete='off' noValidate onSubmit={onSubmit}>
        <Grid container spacing={4}>
          <Grid container item xs={12}>
            <Grid item sm={4} xs={12}>
              <TextField
                control={control}
                error={errors.groupName}
                fullWidth
                id='invitation_groupname_inputfield'
                label='Gruppenavn'
                name='groupName'
                required='Gruppenavn er påkrevd'
              />
            </Grid>
          </Grid>
          {!watchTextArea && (
            <Grid className={errors.csvDropzone ? classes.dropZoneError : classes.dropZone} item xs={12}>
              <Controller
                control={control}
                defaultValue=''
                name='csvDropzone'
                render={() => (
                  <CSVReader
                    addRemoveButton
                    isReset={resetDropZone}
                    onDrop={(data: MainCardFormInputType['csvDropzone']) => setValue('csvDropzone', data)}
                    onError={() =>
                      setError('csvDropzone', {
                        type: 'manual',
                        message: 'Feil ved opplastning',
                      })
                    }
                    onRemoveFile={() => setValue('csvDropzone', '')}
                    removeButtonColor='#B00020'>
                    <span>Dropp eller last opp .CSV-fil her.</span>
                  </CSVReader>
                )}
                rules={{ required: !watchTextArea && 'Må oppgi CSV-fil' }}
              />
              <Typography color='error' style={{ marginLeft: '12px' }} variant='caption'>
                {errors.csvDropzone?.message}
              </Typography>
            </Grid>
          )}
          {!watchTextArea && !watchDropZone && (
            <Grid container item justify='center'>
              <Grid item>
                <Typography variant='h6'>Eller</Typography>
              </Grid>
            </Grid>
          )}
          {!watchDropZone && (
            <Grid item xs={12}>
              <TextField
                control={control}
                error={errors.csvTextarea}
                fullWidth
                id='invitation_groupname_inputfield'
                label='Lim inn tekst i CSV-format'
                multiline
                name='csvTextarea'
                required={watchDropZone ? undefined : 'Må oppgi CSV-data'}
                rows={6}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography variant='h4'>Velg påkrevde felter:</Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              checked={checkboxChecked}
              control={<Checkbox />}
              label={'Filen har kolonnenavn'}
              onChange={(event: React.ChangeEvent<unknown>, checked: boolean) => setCheckboxChecked(checked)}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              as={Dropdown}
              control={control}
              defaultValue=''
              error={errors.csvName?.message}
              id='invitation_dropdown_name_selector'
              items={groupInfo}
              label='Navn'
              name='csvName'
              required
              rules={{ required: 'Navn felt er påkrevd' }}
              setValue={(e: React.ChangeEvent<{ value: unknown }>) => setValue('csvName', e.target.value as string)}
              value={getValues('csvName')}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              as={Dropdown}
              control={control}
              defaultValue=''
              error={errors.csvEmail?.message}
              id='invitation_dropdown_email_selector'
              items={groupInfo}
              label='E-post'
              name='csvEmail'
              required
              rules={{ required: 'E-post felt er påkrevd' }}
              setValue={(e: React.ChangeEvent<{ value: unknown }>) => setValue('csvEmail', e.target.value as string)}
              value={getValues('csvEmail')}
            />
          </Grid>
          <Grid container item justify='space-between' xs={12}>
            <Grid item sm={3} xs={12}>
              <Button fullWidth label='Legg til gruppe' onClick={() => null} type='submit' />
            </Grid>
            <Grid item sm={2} xs={12}>
              <Button fullWidth label='Tøm felt' link onClick={() => resetForm()} />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default MainCard;
