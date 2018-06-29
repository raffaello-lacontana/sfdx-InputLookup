({  
    doInit : function(component, event, helper) {
        // Listen for all clicks on the document
        document.addEventListener('click', function (event) {
        if(event.target != null){
            if (!event.target.closest('.slds-listbox__item')) {
                console.log('outside');
                helper.closeDropdown(component);
            } else{
                console.log('inside');
            }
        }
        }, false);
    },

    keyupInput : function(component, event, helper) {
        var searchString = event.target.value;
        component.set("v.searchString", event.target.value);
        
        if(searchString) {
        	helper.doSearch(component, event, helper);
        } else {
            helper.clearResults(component, helper);
            if(component.get("v.showRecents")) {
            	helper.showRecents(component, event, helper);
            }
        }
	},
    
    selectResult : function(component, event, helper) {
        var resultId = event.currentTarget.dataset.id;
        var results = component.get("v.results");
        for (var i in results) {
            if(results[i].Id === resultId) {
                delete results[i].Highlight;
                console.log(results[i]);
            	component.set("v.selectedRecord", results[i]);
                component.set("v.searchString", "");
                component.set("v.results", "");
                helper.closeDropdown(component, event, helper);
            }
        }
	},
    
    revoveSelected : function(component, event, helper) {
        component.set("v.selectedRecord", "");
    },

    focusInput : function(component, event, helper) {
        var container = component.find('container');
        $A.util.addClass(container, 'slds-has-input-focus');
        if(component.get("v.showRecents")) {
            helper.showRecents(component, event, helper);
        }
        
    },

    blurInput : function(component, event, helper) {
        var container = component.find('container');
        $A.util.removeClass(container, 'slds-has-input-focus');
    }
})