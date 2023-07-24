import { Checkbox, FormControlLabel } from '@mui/material';
import { IWorkflowPieceData } from 'context/workflows/types';
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

interface Props {
  name: `inputs.${string}.value` | `inputs.${string}.fromUpstream` | `inputs.${string}.fromUpstream.${string}`
  label?: string
  defaultChecked?: boolean
  disabled?: boolean
}

const CheckboxInput: React.FC<Props> = ({ label, name, defaultChecked = false, disabled = false }) => {
  const { control } = useFormContext<IWorkflowPieceData>()

  return (
    <>
      {label ?
        <FormControlLabel
          labelPlacement="start"
          label={label}
          control={
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={!!field.value}
                  disabled={disabled}
                />
              )}
            />}
        />
        :
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Checkbox
              {...field}
              checked={!!field.value}
              disabled={disabled}
            />
          )}
        />
      }
    </>
  );
}

export default React.memo(CheckboxInput);
