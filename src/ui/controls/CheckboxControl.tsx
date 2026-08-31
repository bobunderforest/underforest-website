import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from 'react-hook-form'
import { Checkbox } from './Checkbox'

type Props = Omit<React.ComponentProps<typeof Checkbox>, 'value'> & {
  name: string
  rules?: RegisterOptions
}

export const CheckboxControl = ({ rules, ...props }: Props) => {
  const { control, formState } = useFormContext()
  const { isSubmitting } = formState

  return (
    <Controller
      name={props.name}
      rules={rules}
      control={control}
      render={({ field }) => (
        <Checkbox
          {...props}
          ref={field.ref}
          name={field.name}
          checked={!!field.value}
          value={field.value}
          onBlur={field.onBlur}
          onChange={(event) => field.onChange(event.target.checked)}
          disabled={isSubmitting}
        />
      )}
    />
  )
}
