@isTest
public with sharing class InputLookupCtrlTest {

    @isTest
    public static void getResults() {
        insert new Account(Name = 'Acme');
        Test.startTest();
        List<SObject> results = InputLookupCtrl.getResults('A', 'Account', 'Id != null', 1);
        Test.stopTest();
        System.assertEquals(1, results.size());
    }
}