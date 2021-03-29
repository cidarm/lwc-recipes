import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {
    createRecord,
    getRecordCreateDefaults,
    generateRecordInputForCreate
} from 'lightning/uiRecordApi';
import { reduceErrors } from 'c/ldsUtils';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import TYPE from '@salesforce/schema/Account.Type';


export default class LDSAccount2 extends LightningElement {
    aType;
    aTypeField = TYPE.fieldApiName;
    aTypeCreateable;
    error;
    nameField = NAME_FIELD.fieldApiName;
    recordInput;

@wire(getRecordCreateDefaults, { objectApiName: ACCOUNT_OBJECT })
loadAccountCreateDefaults({ data, error }) {
    if (data) {
        // Create a record input with default field values
        this.recordInput = generateRecordInputForCreate(
            data.record,
            data.objectInfos[ACCOUNT_OBJECT.objectApiName] 
        );
        const fields = this.recordInput.fields;
        this.aTypeCreateable = TYPE.objectApiName in fields;
        this.aType = fields[TYPE.fieldApiName];
        this.error = undefined;
    } else if (error) {
        this.recordInput = undefined;
        this.error = error;
        }
    }

    handleFieldChange(event) {
        this.recordInput.fields[event.target.dataset.fieldName] =
            event.target.value;
    }

    createAccount() {
        createRecord(this.recordInput)
        .then((account) => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Account created, with id: ' +account.Name,
                    variant: 'success'
                })
            );
        })
        .catch((error) => {
            this.dispatchEvent(
                new ShowToastEvent ({
                    title: 'Error creating record',
                    message: reduceErrors(error).join(', '),
                    variant: 'error'
                })
            );
        });
    }
}