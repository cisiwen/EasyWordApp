import SQLiteDataProvider from "../provider/SQLiteDataProvider";

export default class StartUp {

    private static SQLiteDataProviderInstance: SQLiteDataProvider;
    public static getInstance<T>(): T {
        return this.createInstance<T>();
    }

    private static createInstance<T>(): any {
        if (StartUp.SQLiteDataProviderInstance == null) {
            StartUp.SQLiteDataProviderInstance = new SQLiteDataProvider();
            
        }
        return StartUp.SQLiteDataProviderInstance as any;
        
    }

}