({
	doSearch : function(component, event, helper) {
        var searchString = component.get("v.searchString");
        var sobjectDeveloperName = component.get("v.sobjectDeveloperName");
        var queryWhereCondition = component.get("v.queryWhereCondition");
        var queryLimit = component.get("v.queryLimit");
        
		var action = component.get("c.getResults");
        action.setParams({
            'searchString': searchString,
            'sobjectDeveloperName': sobjectDeveloperName,
            'queryWhereCondition': queryWhereCondition,
            'queryLimit': queryLimit
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                if(searchString === component.get("v.searchString")) {
                    var results = response.getReturnValue();
                    if (!$A.util.isEmpty(results)) {
                        results = helper.addHighlight(results, searchString);
                        component.set("v.results", results);
                        helper.openDropdown(component);
                    } else {
                        component.set("v.results", "");
                        helper.closeDropdown(component);
                    }
                }
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
	},

    showRecents : function(component, event, helper) {
        var sobjectDeveloperName = component.get("v.sobjectDeveloperName");
        var queryWhereCondition = component.get("v.queryWhereCondition");
        var queryLimit = component.get("v.queryLimit");
        
        var action = component.get("c.getRecents");
        action.setParams({
            'sobjectDeveloperName': sobjectDeveloperName,
            'queryWhereCondition': queryWhereCondition,
            'queryLimit': queryLimit
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var recents = response.getReturnValue();
                if (!$A.util.isEmpty(recents)) {
                    recents = helper.addHighlight(recents, "");
                    component.set("v.results", recents);
                    helper.openDropdown(component);
                } else {
                    component.set("v.results", "");
                    helper.closeDropdown(component);
                }
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    
    openDropdown : function(component) {
		var dropdown = component.find('dropdown');
        $A.util.addClass(dropdown, 'slds-is-open');
	},
    
    closeDropdown : function(component) {
		var dropdown = component.find('dropdown');
        $A.util.removeClass(dropdown, 'slds-is-open');
	},

    clearResults : function(component, helper) {
        component.set("v.results", "");
        helper.closeDropdown(component);
    },

    addHighlight : function(results, searchString) {
        var regex = new RegExp(searchString, 'gi')
        for(var i in results) {   
            results[i].Highlight = results[i].Name.replace(regex, function(str) {
                return "<mark>" + str + "</mark>"
            });
        }
        return results;
    }
})