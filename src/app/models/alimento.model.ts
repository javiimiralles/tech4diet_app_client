export class Alimento {
  constructor(
    public uid: string,
    public nombre?: string,
    public marca?: string,
    public cantidadReferencia?: number,
    public unidadMedida?: string,
    public calorias?: number,
    public carbohidratos?: number,
    public proteinas?: number,
    public grasas?: number,
    public idUsuario?: string
  ) {}
}
