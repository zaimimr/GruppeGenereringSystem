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
import { ICsvData } from 'utils/types';

export type IMainCardFormInput = {
  groupName: string;
  csvDropzone: string | string[][];
  csvTextarea: string;
  csvNameField: string;
  csvEmailField: string;
};

const MainCardFormInputDefaultValue = {
  groupName: '',
  csvDropzone: '',
  csvTextarea: '',
  csvNameField: '',
  csvEmailField: '',
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

  const { errors, handleSubmit, clearErrors, control, reset, setValue, getValues, setError, watch } = useForm<IMainCardFormInput>({
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
      const dropzoneValue: IMainCardFormInput['csvDropzone'] = getValues('csvDropzone');
      if (Array.isArray(dropzoneValue)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dropzoneValue.forEach(({ data }: any) => {
          if (data instanceof Array) {
            csvData.push(data);
          }
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
        textareaValue.data.forEach((value: string[] | unknown) => {
          if (value instanceof Array) {
            csvData.push(value);
          }
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
    const formData: ICsvData = {
      groupName: data.groupName,
      csvIsHeader: checkboxChecked,
      csvNameField: data.csvNameField,
      csvEmailField: data.csvEmailField,
      csvData: groupInfo,
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
                    onDrop={(data: IMainCardFormInput['csvDropzone']) => setValue('csvDropzone', data)}
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
              onChange={(e: React.ChangeEvent<unknown>, checked: boolean) => setCheckboxChecked(checked)}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              as={Dropdown}
              control={control}
              defaultValue=''
              error={errors.csvNameField?.message}
              id='invitation_dropdown_name_selector'
              items={groupInfo[0]}
              label='Navn'
              name='csvNameField'
              required
              rules={{ required: 'Navn felt er påkrevd' }}
              setValue={(e: React.ChangeEvent<{ value: unknown }>) => setValue('csvNameField', e.target.value as string)}
              value={getValues('csvNameField')}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              as={Dropdown}
              control={control}
              defaultValue=''
              error={errors.csvEmailField?.message}
              id='invitation_dropdown_email_selector'
              items={groupInfo[0]}
              label='E-post'
              name='csvEmailField'
              required
              rules={{ required: 'E-post felt er påkrevd' }}
              setValue={(e: React.ChangeEvent<{ value: unknown }>) => setValue('csvEmailField', e.target.value as string)}
              value={getValues('csvEmailField')}
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
