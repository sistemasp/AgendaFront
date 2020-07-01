import React from "react";
import { Checkbox, FormControlLabel, withStyles } from "@material-ui/core";
import { green } from "@material-ui/core/colors";

const GreenCheckbox = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

export const CheckCustom = (props) => {

    const { 
        checked,
        onChange,
        name,
        label,
        disabled,
    } = props;

    return (
        <FormControlLabel
            control={
                <GreenCheckbox 
                    checked={checked}
                    onChange={onChange}
                    name={name}
                    disabled={disabled} />}
            label={label}
        />        
    )
}