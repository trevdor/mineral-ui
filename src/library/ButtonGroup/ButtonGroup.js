/* @flow */
import React, { Children, Component, cloneElement, createElement } from 'react';
import { ChoiceGroup } from '../Choice';
import { createStyledComponent } from '../styles';
import { setFromArray } from '../utils/collections';
import InputButton from './InputButton';

type Props = {
  /**
   * Value of the selected Radio or an array of values of the selected
   * Checkboxes. Primarily for use with controlled components. If this prop is
   * specified, an `onChange` handler must also be specified. See also:
   * `defaultChecked`.
   */
  checked?: string | Array<string>,
  /** Mineral InputButtons rendered as [Button](/components/button) components */
  children?: Array<React$Element<*>>,
  /** Data used to contruct InputButtons, see [example](#data) */
  data?: Array<{
    defaultChecked?: boolean,
    label: string | React$Element<*>,
    value: string
  }>,
  /**
   * Value of the selected InputButton [Button](/components/button); primarily for use with
   * uncontrolled components.
   */
  defaultChecked?: string | Array<string>,
  /** Disables all children */
  disabled?: boolean,
  /** Indicates that the field is invalid. Not forwarded for checkboxes. */
  invalid?: boolean,
  /** The name of the group */
  name: string,
  /** Indicates whether HTML inputs are type checkbox (default is type radio) */
  multiple?: boolean,
  /** Function called when a choice is selected */
  onChange?: (event: SyntheticInputEvent<>) => void,
  /** Indicates that the field is required. Not forwarded for checkboxes. */
  required?: boolean,
  /** Props to be applied directly to the root element */
  rootProps?: Object,
  /** Available RadioButton sizes */
  size?: 'small' | 'medium' | 'large' | 'jumbo',
  /** Available variants */
  variant?: 'danger' | 'success' | 'warning'
};

type State = {
  checked?: string | Array<string> | void
};

const styles = {
  display: 'flex',
  // flexDirection: inline ? 'row' : 'column',

  '& > *:not(:last-child)': {
    marginBottom: 0,
    marginRight: 0
  }
};

const findDefaultValues = (props) => {
  const { children, data, multiple } = props;
  let defaultValues: string | Array<string> | void = [];

  const addDefaultValue = (value) => {
    defaultValues.push(value);
  };

  if (multiple) {
    if (children && Array.isArray(children)) {
      children.map((button) => {
        if (button.props.defaultChecked && Array.isArray(defaultValues)) {
          addDefaultValue(button.props.value);
        }
      });
    } else if (data) {
      data.map((button) => {
        if (button.defaultChecked && Array.isArray(defaultValues)) {
          addDefaultValue(button.value);
        }
      });
    }
  } else {
    if (children && Array.isArray(children)) {
      const button = children.find((button) => {
        return button.props.defaultChecked;
      });
      defaultValues = button && button.props.value;
    } else if (data) {
      const button = data.find((button) => {
        return button.defaultChecked;
      });
      defaultValues = button && button.value;
    }
  }

  return defaultValues;
};

const isChecked = (checked: string | Array<string>, value) => {
  return Array.isArray(checked)
    ? checked.indexOf(value) !== -1
    : checked === value;
};

const Root = createStyledComponent('div', styles, {
  displayName: 'ButtonGroup',
  includeStyleReset: true
});

/**
 * TODO ButtonGroup allows authors to construct a group of [Buttons](/components/button)
 * that perform like a [RadioGroup](/components/radio-group) or
 * [CheckboxGroup](/components/checkbox-group).
 */
class ButtonGroup extends Component<Props, State> {
  state: State = {
    checked: this.props.defaultChecked || findDefaultValues(this.props) || ''
  };

  render() {
    const {
      children,
      data,
      defaultChecked,
      invalid,
      multiple,
      required,
      role,
      rootProps: otherRootProps,
      size,
      ...restProps
    } = this.props;
    const type = multiple ? 'checkbox' : 'radio';

    const rootProps = {
      role: `${type === 'radio' ? 'radio' : ''}group`,
      ...otherRootProps
    };

    const inputProps = (value, index, inputData = {}) => {
      console.log(this.getControllableValue('checked'));
      return {
        checked: isChecked(this.getControllableValue('checked'), value),
        onChange: (event: SyntheticInputEvent<>) => {
          this.handleChange(event, type);
        },
        // checked: checked !== undefined ? isChecked(checked, value) : undefined,
        invalid: type === 'checkbox' ? undefined : invalid,
        key: index,
        required: type === 'checkbox' ? undefined : required,
        // type: appearance === 'button' ? type : null,
        size,
        type,
        value,
        ...restProps, // Note: Props are spread to input rather than Root
        ...inputData
      };
    };

    let inputs = null;
    if (data) {
      inputs = data.map((inputData, index) => {
        const { defaultChecked, value, ...restInputData } = inputData;
        return createElement(InputButton, {
          ...inputProps(value, index, restInputData)
        });
      });
    } else if (children) {
      inputs = Children.map(children, (child, index) => {
        const {
          defaultChecked: ignoreDefaultChecked,
          disabled: buttonDisabled,
          invalid: buttonInvalid,
          required: buttonRequired,
          size: ignoreSize,
          value,
          ...buttonProps
        } = child.props;

        return (
          <InputButton
            {...inputProps(value, index, {
              buttonProps,
              disabled: this.props.disabled || buttonDisabled,
              invalid: invalid || buttonInvalid,
              required: required || buttonRequired,
              type,
              variant: this.props.variant || buttonProps.variant
            })}
          />
        );
      });
    }

    return <Root {...rootProps}>{inputs}</Root>;
  }

  handleChange = (event: SyntheticInputEvent<>, type: string) => {
    event.persist();

    if (this.isControlled('checked')) {
      this.changeActions(event);
    } else {
      this.setState(
        (prevState) => {
          return this.updateState(event, prevState, type);
        },
        () => {
          this.changeActions(event);
        }
      );
    }
  };

  changeActions = (event: SyntheticInputEvent<>) => {
    this.props.onChange && this.props.onChange(event);
  };

  updateState = (
    event: SyntheticInputEvent<>,
    prevState: State,
    type: string
  ) => {
    const { target } = event;
    let checked;

    if (type === 'radio') {
      checked = target.value;
    } else if (type === 'checkbox' && prevState.checked) {
      // what if prevState.checked is undefined?

      const prevChecked = setFromArray([].concat(prevState.checked));
      prevChecked.has(target.value)
        ? prevChecked.delete(target.value)
        : prevChecked.add(target.value);

      checked = Array.from(prevChecked);
    }
    return { checked };
  };

  isControlled = (prop: string) => {
    return this.props.hasOwnProperty(prop);
  };

  getControllableValue = (key: string) => {
    return this.isControlled(key) ? this.props[key] : this.state[key];
  };
}

ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;