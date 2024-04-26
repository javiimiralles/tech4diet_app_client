export class Diario {
  constructor(
    public uid: string,
    public fecha?: Date,
    public alimentosConsumidos?: [
      {
        idAlimento?: string,
        calorias?: number,
        carbohidratos?: number,
        proteinas?: number,
        grasas?: number,
        cantidad?: number,
        categoria?: string
      }
    ],
    public aguaConsumida?: number,
    public caloriasGastadas?: number,
    public caloriasConsumidas?: number,
    public carbosConsumidos?: number,
    public proteinasConsumidas?: number,
    public grasasConsumidas?: number,
    public idUsuario?: string
  ) {}
}
