import { LightningElement, api, track, wire } from 'lwc';
import getResults from "@salesforce/apex/InputLookupCtrl.getResults";
import getRecents from "@salesforce/apex/InputLookupCtrl.getRecents";

export default class InputLookup extends LightningElement {

    @api selectedRecord = "";
    @api sobjectDeveloperName = "Account";
    @api sobjectLabel = "Account";
    @api fieldLabel = "";
    @api iconName = "standard:account";
    @api placeholder = "Search...";
    @api queryWhereCondition = "";
    @api queryLimit = 5;
    @api showRecents = false;

    searchString = "";
    results = "";
    recents  = "";

    @track dropdownCssClass = "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-combobox-lookup";
    @track containerCssClass = "slds-combobox_container slds-has-inline-listbox";

    _handler;
    connectedCallback() {
        this.showRecents = true;
        document.addEventListener('click', this._handler = this.close.bind(this));
    }
    disconnectedCallback() {
        document.removeEventListener('click', this._handler);
    }
    ignore(event) {
        event.stopPropagation();
        return false;
    }
    close() { 
        console.log('we should close now');
        this.closeDropdown();
    }

    keyupInput(event) {
        this.searchString = event.target.value;
        
        if(this.searchString) {
        	this.doSearch();
        } else {
            this.clearResults();
            if(this.showRecents) {
            	this.getRecents();
            }
        }
	}
    selectResult(event) {
        let resultId = event.currentTarget.dataset.id;
        for (let i in this.results) {
            if(this.results[i].Id === resultId) {
                delete this.results[i].Highlight;
            	this.selectedRecord = this.results[i];
                this.searchString = "";
                this.results = [];
                this.closeDropdown();
            }
        }
	}

    removeSelected() {
        this.selectedRecord = "";
    }

    focusInput() {
        this.containerCssClass = "slds-combobox_container slds-has-inline-listbox slds-has-input-focus";
        if(this.showRecents) {
            this.getRecents();
        }
    
    }

    blurInput() {
        this.containerCssClass = "slds-combobox_container slds-has-inline-listbox";
    }

    doSearch() {
        getResults({ 
            "searchString": this.searchString,
            "sobjectDeveloperName": this.sobjectDeveloperName,
            "queryWhereCondition": this.queryWhereCondition,
            "queryLimit": this.queryLimit
        })
        .then((results) => {
            if (results) {
                results = this.addHighlight(results, this.searchString);
                this.results = results;
                this.openDropdown();
            } else {
                this.results = "";
                this.closeDropdown();
            }
        })
        .catch((error) => {
            console.log("Error - getResults", error);
        });
	}

    getRecents() {
        getRecents({ 
            "sobjectDeveloperName": this.sobjectDeveloperName,
            "queryWhereCondition": this.queryWhereCondition,
            "queryLimit": this.queryLimit
        })
        .then((recents) => {
            if (recents) {
                recents = this.addHighlight(recents, "");
                this.results = recents;
                this.openDropdown();
            } else {
                this.results = "";
                this.closeDropdown();
            }
        })
        .catch((error) => {
            console.log("Error - getRecents", error);
        });
    }

    openDropdown() {
		this.dropdownCssClass = "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-combobox-lookup slds-is-open";
	}
    
    closeDropdown() {
		this.dropdownCssClass = "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-combobox-lookup";
	}

    clearResults() {
        this.results = "";
        this.closeDropdown();
    }

    addHighlight(results, searchString) {
        let regex = new RegExp(searchString, "gi")
        for(let i in results) {   
            results[i].Highlight = results[i].Name.replace(regex, function(str) {
                return "<mark>" + str + "</mark>"
            });
        }
        return results;
    }
}