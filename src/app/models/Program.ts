import { Type } from "@angular/core"
import { textChangeRangeIsUnchanged } from "typescript"

export class Program{
    id: String;
    username: String;
    type: String;
    date: String;
    color: String;
    workoutSet: any[];

    constructor(id: String, username: String, type: String, date: String, color: String, workoutSet: any[]){
        this.id = id;
        this.username = username;
        this.type = type;
        this.date = date;
        this.color = color;
        this.workoutSet = workoutSet;
    }
}