import { LightningElement, api, wire, track } from 'lwc';

import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import upsertContact from '@salesforce/apex/AccountContact.upsertContact';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';


export default class AddAccountContact extends LightningElement {
    @track contactRecord = {};
    @track accountRecord = {};

    handleChange(event) {
        const field = event.target.name;
        //this.contactRecord[event.target.field] = event.target.value;
        if (field === 'accountName') {
            this.accountRecord['Name'] = event.target.value;
        } else if (field === 'salary') {
            this.accountRecord['Salary__c'] = event.target.value;
        } else if(field === 'cFirstName'){
            this.contactRecord['FirstName'] = event.target.value;
        } else if(field === 'cLastName'){
            this.contactRecord['LastName'] = event.target.value;
        }
    }
    
    handleSubmit() {
       
        const allValid = [...this.template.querySelectorAll('lightning-input')]
        .reduce((validSoFar, inputCmp) => {
                    inputCmp.reportValidity();
                    return validSoFar && inputCmp.checkValidity();
        }, true);
        if (allValid) {
              // if(this.validated())
              //log(this.contactRecord);
           // console.log('Contact for save => ', JSON.stringify(this.contactRecord));
            createRecord({ apiName: CONTACT_OBJECT.objectApiName, fields: this.contactRecord })
                .then(contact => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Contact created from saveForm => ' + contact.id,
                            variant: 'success'
                        })
                    );
                })
                .catch((error) => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error creating record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
                createRecord({ apiName: ACCOUNT_OBJECT.objectApiName, fields: this.accountRecord })
                .then(contact => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Acount created from saveForm => ' + contact.id,
                            variant: 'success'
                        })
                    );
                })
                .catch((error) => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error creating record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
        } else {
            alert('Please update the invalid form entries and try again.');
        }
    }
}