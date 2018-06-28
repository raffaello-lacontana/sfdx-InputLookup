declare module "@apex/InputLookupCtrl.getResults" {
  export function getResults(param: {searchString: any, sobjectDeveloperName: any, queryWhereCondition: any, queryLimit: any}): Promise<any>;
}
declare module "@apex/InputLookupCtrl.getRecents" {
  export function getRecents(param: {sobjectDeveloperName: any, queryWhereCondition: any, queryLimit: any}): Promise<any>;
}
