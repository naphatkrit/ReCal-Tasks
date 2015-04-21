declare module "xcas" {
    module xcas
    {
        interface XCasStaticOptions
        {
            base_url: string,
            service?: string,
            version: number
        }
        interface XCasStatic
        {
            new (options: XCasStaticOptions);
        }
    }
    var xcas: xcas.XCasStatic;
    export = xcas;
}
