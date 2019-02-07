import React from 'react';
import Grid from "@material-ui/core/Grid/Grid";
import TextField from "@material-ui/core/TextField/TextField";
import Paper from "@material-ui/core/Paper/Paper";
import moment from 'moment';
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import Input from "@material-ui/core/Input/Input";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";

export default class ObjectInfoParameters extends React.Component {
  state = {
    tableValid: true,
    objectIdValid: true
  }

  filterParameters = (parameters) => {
    return Object.keys(parameters).reduce((acc, parameterName) => {
      if (['type', 'table', 'objectId'].indexOf(parameterName) !== -1) {
        acc[parameterName] = parameters[parameterName];
      }
      return acc;
    }, {});
  }

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
    const { table, objectId, onChange, className: classNameProp, onTextFilterChange } = this.props;
    const { tableValid, objectIdValid } = this.state;

    return (
      <Paper elevation={1} className={classNameProp}>
        <Grid container spacing={16} >
          <Grid item xs={4}>
            <TextField
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
            <TextField
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