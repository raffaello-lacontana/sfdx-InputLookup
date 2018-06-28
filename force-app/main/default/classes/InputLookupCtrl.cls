public class InputLookupCtrl {
    
	@AuraEnabled
    public static List <SObject> getResults(String searchString, String sobjectDeveloperName, String queryWhereCondition, Integer queryLimit) {
        String query = 'SELECT Name FROM '+ sobjectDeveloperName + ' WHERE Name LIKE \'%'+ String.escapeSingleQuotes(searchString) + '%\'';
        
        if(String.isNotBlank(queryWhereCondition)) {
        	query += ' AND ' + queryWhereCondition;
        }
        

        query += ' LIMIT ' + queryLimit;
        return Database.query(query);
    }

    @AuraEnabled
    public static List <SObject> getRecents(String sobjectDeveloperName, String queryWhereCondition, Integer queryLimit) {
        String query = 'SELECT Name FROM '+ sobjectDeveloperName;
        
        if(String.isNotBlank(queryWhereCondition)) {
        	query += ' AND ' + queryWhereCondition;
        }

        query += ' ORDER BY LastViewedDate DESC LIMIT ' + queryLimit;
        return Database.query(query);
    }
}