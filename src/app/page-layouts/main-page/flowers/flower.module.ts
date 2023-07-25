export class IFlower{
   public name:string;
   public description:string;
   public imgPath:string;
   public price:number

   constructor(name:string, desc:string, imgPath:string, price:number){
    this.name = name;
    this.description = desc;
    this.imgPath = imgPath;
    this.price = price;
   }
}