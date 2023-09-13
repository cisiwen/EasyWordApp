import { UserDataService } from "../Service/UserDataService";
import SQLiteDataProvider from "../provider/SQLiteDataProvider";
import { UserStateManager } from "../ui/stateManager/userStateManager";

export default class StartUp {

    private static SQLiteDataProviderInstance: SQLiteDataProvider;
    private static UserDataServiceInstance: UserDataService;
    private static UserStateManager:UserStateManager;
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
            case UserStateManager.OBJECTID:
                if(StartUp.UserStateManager==null){
                    StartUp.UserStateManager=new UserStateManager(StartUp.getInstance<UserDataService>(UserDataService.OBJECTID));
                }
                return StartUp.UserStateManager as any;
        }    
    }

}