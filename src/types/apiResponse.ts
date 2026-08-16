import {Message} from '@/model/user.model'

export interface ApiResponse {
    success: boolean;
    message:string ;
    isAcceptingMessage?:boolean ;
    data?: any ;
    messages ?:Array<Message> ;
}