export type User = {
    info: UserInfo;
    token: string;
    config: UserConfig | null
}

export type UserInfo = {
    id: string;
    companyId: string;
    name: string;
    image: string | null;
    email: string;
    role: 'manager' | 'admin' | 'default'
}

export type UserConfig = {
    
}

export type Company = {
    id: string;
    name: string;
    userConfig: Config;
}

export type Config = {

}

export type Product = {

}