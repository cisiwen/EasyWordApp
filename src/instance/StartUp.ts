import { UserDataService } from "../Service/UserDataService";
import SQLiteDataProvider from "../provider/SQLiteDataProvider";

export default class StartUp {

    private static SQLiteDataProviderInstance: SQLiteDataProvider;
    private static UserDataServiceInstance: UserDataService;
    public static getInstance<T>(OBJECTID:string): T {
        return this.createInstance<T>(OBJECTID);
    }

    
    private static createInstance<T>(OBJECTID:string): any {
        switch(OBJECTID) {
            case SQLiteDataProvider.OBJECTID:
                if (StartUp.SQLiteDataProviderInstance == null) {
                    StartUp.SQLiteDataProviderInstance = new SQLiteDataProvider();
                    
                }
                return StartUp.SQLiteDataProviderInstance as any;
            case UserDataService.OBJECTID:
                if (StartUp.UserDataServiceInstance == null) {
                    StartUp.UserDataServiceInstance = new UserDataService(StartUp.getInstance<SQLiteDataProvider>(SQLiteDataProvider.OBJECTID));
                }
                return StartUp.UserDataServiceInstance as any;
        }    
    }

}