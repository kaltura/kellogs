import React from 'react';
import Grid from "@material-ui/core/Grid/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import ClearableTextField from '../ClearableTextField';
import { pick } from 'ramda';

const defaultParams = ['type', 'table', 'objectId'];

export default class ObjectInfoParameters extends React.Component {
  state = {
    tableValid: true,
    objectIdValid: true
  }

  filterParameters = pick(defaultParams);

  validate = () => {
    const isTableValid = this._validate('table');
    const isObjectIdValid = this._validate('objectId');
    return isTableValid && isObjectIdValid;
  }

  _validate = (propertyName) => {
    const value = this.props[propertyName];
    const isValid = !!value;
    this.setState({
      [`${propertyName}Valid`]: isValid
    })

    return isValid;
  }

  render() {
    const { table, objectId, onChange, onClear, className: classNameProp } = this.props;
    const { tableValid, objectIdValid } = this.state;

    return (
      <Paper elevation={1} className={classNameProp}>
        <Grid container spacing={16} >
          <Grid item xs={4}>
            <ClearableTextField
              onClear={onClear}
              error={!tableValid}
              fullWidth
              label={`Table ${tableValid ? '' : '(required)'}`}
              name={'table'}
              value={table}
              onChange={onChange}
              onBlur={() => this._validate('table')}
            />
          </Grid>
          <Grid item xs={4}>
            <ClearableTextField
              onClear={onClear}
              error={!objectIdValid}
              fullWidth
              label={`Object ID ${tableValid ? '' : '(required)'}`}
              name={'objectId'}
              value={objectId}
              onChange={onChange}
              onBlur={() => this._validate('objectId')}
            />
          </Grid>
        </Grid>
      </Paper>
    )
  }
}
